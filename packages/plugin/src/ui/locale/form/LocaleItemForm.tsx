import React, { useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { updateLocaleItem } from "../../state/localeSlice";
import { Controller } from "react-hook-form";
import { TextBox } from "../../components/Field";
import { debounce, get, isString } from "lodash";
import { LANGUAGES } from "../../../constant/locale";
import { LocaleItem, findItemByKey } from "../../../lib/localeData";
import { runCommand } from "../../uiHelper";
import Button from "../../components/Button";
import { setCurrentDialog } from "../../state/localeAppSlice";
import Switch from "../../components/Switch";
import useLocaleForm from "./useLocaleForm";
import { updateTextsOfItem } from "./formCommon";
import { addLocaleItem } from "../../state/localeSlice";
function LocaleItemForm({
  item,
  showTitle = false,
  saveOnChange = false,
  onDone,
}: {
  showTitle?: boolean;
  saveOnChange?: boolean;
  item?: LocaleItem | string;
  onDone?: (item: LocaleItem) => void;
}) {
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const localeItem = useMemo(
    () => (isString(item) ? findItemByKey(item, localeItems) : item),
    [item, localeItems, localeSelection]
  );
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
    setValue,
    getValues,
    watchHasPlurals,
  } = useLocaleForm({ item: localeItem, quickEdit: saveOnChange });
  // reset when key is change
  const isKeyAvailable = useCallback(
    (key) => {
      if (!findItemByKey(key, localeItems)) {
        return true;
      } else {
        return false;
      }
    },
    [localeItems]
  );

  // save on submit
  const updateLocaleItemHandler = useCallback(() => {
    const [key, oldKey, en, vi, hasPlurals] = getValues([
      "key",
      "oldKey",
      "en",
      "vi",
      "hasPlurals",
    ]);
    const localeItemData = {
      key: key,
      en: hasPlurals.en ? en : en.one,
      vi: hasPlurals.vi ? vi : vi.one,
    };
    console.log(localeItemData);
    dispatch(updateLocaleItem({ ...localeItemData, oldKey }));
    if (localeSelection)
      updateTextsOfItem(oldKey, localeItemData, localeSelection);
    dispatch(setCurrentDialog({ type: "EDIT", opened: false }));
    runCommand("show_figma_notify", { message: "Item updated" });

  }, []);

  const updateLocaleItemDebounce = useMemo(
    () =>
      debounce((data) => {
        dispatch(updateLocaleItem(data));
        // update selected text also
        if (localeSelection) updateTextsOfItem(null, data, localeSelection);
      }, 300),
    []
  );
  useEffect(() => {
    return () => {
      updateLocaleItemDebounce.cancel();
    };
  }, []);
  // save on CHange
  useEffect(() => {
    if (saveOnChange) {
      const watcher = watch((data) => {
        if (localeItem && data.key) {
          console.log("Update item using debounce!", data);
          const { key, en, vi, hasPlurals } = data;
          const localeItemData = {
            key: key,
            en: hasPlurals.en ? en : en.one,
            vi: hasPlurals.vi ? vi : vi.one,
          };
          updateLocaleItemDebounce(localeItemData);
        }
      });
      return () => {
        watcher.unsubscribe();
      };
    }
  }, [watch, localeItem, saveOnChange, watchHasPlurals]);

  // add new key
  const addNewKey = useCallback(() => {
    const [key, en, vi, hasPlurals] = getValues([
      "key",
      "en",
      "vi",
      "hasPlurals",
    ]);
    const localeItemData = {
      key: key,
      en: hasPlurals.en ? en : en.one,
      vi: hasPlurals.vi ? vi : vi.one,
    };
    dispatch(addLocaleItem(localeItemData));
    // may be comment
    // dispatch(updateLocaleSelection({ key: new_key }));
    if (onDone && typeof onDone == "function") onDone(localeItemData);
    runCommand("show_figma_notify", { message: "Item created" });
  }, [localeSelection]);

  return (
    <form onSubmit={handleSubmit(item ? updateLocaleItemHandler : addNewKey)}>
      {showTitle && item && saveOnChange && (
        <h4 className="mt-0 mb-4 font-medium text-secondary">
          Quick edit {localeItem.key}
        </h4>
      )}
      {showTitle && !item && (
        <header className="mb-16">
          <h4
            css={`
              margin: 0;
            `}
          >
            Add new locale item
          </h4>
          <p
            className="mt-8"
            css={`
              color: var(--figma-color-text-secondary);
            `}
          >
            No matched item found
          </p>
        </header>
      )}
      <input type="hidden" {...register("oldKey")} />
      <div className="mt-16">
        {!saveOnChange && (
          <TextBox
            label="Key"
            id="key"
            className="mt-12"
            {...register("key", {
              required: true,
              validate: {
                available: (v) =>
                  (localeItem && v == localeItem.key) || isKeyAvailable(v),
              },
            })}
            helpText={`Tip: Use "." for groupping, e.g: feature_a.message`}
            errorText={
              errors.key &&
              `${
                errors.key.type == "available"
                  ? "Key already exists"
                  : "Key is required"
              }`
            }
          />
        )}
        {!saveOnChange && (
          <h4 className="mt-16 font-medium text-secondary">Translation</h4>
        )}
        {/* <p
            css={`
              color: var(--figma-color-text-secondary);
              font-size: var(--font-size-xsmall);
              margin-top: 8px;
            `}
          >{`Use {{count}} for counter. Use {{variableName}} for variable`}</p> */}
        {Object.keys(LANGUAGES).map((lang) => (
          <>
            <div className="relative mt-12">
              <TextBox
                label={LANGUAGES[lang]}
                id={lang}
                className=""
                {...register(`${lang}.one`, { required: true })}
                errorText={
                  get(errors, `${lang}.one`) && "Translation is required"
                }
              />
              <div
                css={`
                  position: absolute;
                  top: -2px;
                  right: 0;
                `}
              >
                <Controller
                  name={`hasPlurals.${lang}`}
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      label="Plural"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    ></Switch>
                  )}
                ></Controller>
              </div>
            </div>
            {watchHasPlurals[lang] && (
              <TextBox
                label={`${LANGUAGES[lang]} - Plural`}
                id={lang}
                className="mt-12"
                {...register(`${lang}.other`, { required: true })}
              />
            )}
          </>
        ))}

        {!saveOnChange && (
          <Button className="mt-16" type="submit">
            {item ? "Update item" : "Add item"}
          </Button>
        )}
      </div>
    </form>
  );
}

export default LocaleItemForm;
