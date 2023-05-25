import React, { useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { updateLocaleItem } from "../../state/localeSlice";
import { Controller } from "react-hook-form";
import {
  TextBox,
  Textarea,
  Button,
  Switch,
  Checkbox,
  IconButton,
  Tooltip,
} from "ds";
import { defaultDateTimeFormat } from "../../../lib/helpers";
import { debounce, get, has, isString } from "lodash-es";
import { LANGUAGE_LIST, LocaleItem, findItemByKey } from "../../../lib";
import { runCommand } from "../../uiHelper";
import { setCurrentDialog } from "../../state/localeAppSlice";
import useLocaleForm from "./useLocaleForm";
import { updateTextsOfItem } from "../../state/helpers";
import { addLocaleItem } from "../../state/localeSlice";
import {
  useLanguages,
  useLocaleItems,
  useLocaleSelection,
} from "../../hooks/locale";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
const EditInfo = ({ localeItem }: { localeItem: LocaleItem }) => {
  return (
    localeItem &&
    ("createdAt" in localeItem || "updatedAt" in localeItem) && (
      <Tooltip
        content={
          <div className="flex flex-column gap-4">
            {localeItem.createdAt && (
              <div>
                <p className="font-medium">Created at:</p>
                <p className="mt-2">
                  {defaultDateTimeFormat(localeItem.createdAt)}
                </p>
              </div>
            )}
            {localeItem.updatedAt && (
              <div>
                <p className="font-medium">Updated at:</p>
                <p className="mt-2">
                  {defaultDateTimeFormat(localeItem.updatedAt)}
                </p>
              </div>
            )}
          </div>
        }
      >
        <IconButton>
          <CounterClockwiseClockIcon />
        </IconButton>
      </Tooltip>
    )
  );
};
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
  const localeItems = useLocaleItems();
  const localeSelection = useLocaleSelection();
  const localeItem = useMemo(
    () => (isString(item) ? findItemByKey(item, localeItems) : item),
    [item, localeItems, localeSelection]
  );
  const languages = useLanguages();
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
      const foundItem = localeItems.find(
        (item) =>
          item.key === key && (!("fromLibrary" in item) || !item.fromLibrary)
      );
      if (!foundItem) {
        return true;
      } else {
        return false;
      }
    },
    [localeItems]
  );
  const getContent = (
    type: "create" | "update" | "quick-update" = "create",
    data = null
  ): LocaleItem => {
    const { key, hasPlurals, prioritized, ...content } = data || getValues();
    const currentDate = new Date();
    return languages.reduce(
      (acc, lang: string) => {
        if (lang in hasPlurals && lang in content && content[lang]) {
          acc[lang] = hasPlurals[lang] ? content[lang] : content[lang].one;
        }
        return acc;
      },
      {
        key: key,
        ...(type == "create"
          ? {
              createdAt: currentDate.toJSON(),
            }
          : {}),
        updatedAt: currentDate.toJSON(),
        ...(type != "quick-update"
          ? { prioritized: prioritized || false }
          : {}),
      }
    );
  };
  // save on submit
  const updateLocaleItemHandler = useCallback(() => {
    const oldKey = getValues("oldKey");
    const localeItemData = getContent("update");
    dispatch(updateLocaleItem({ ...localeItemData, oldKey }));
    if (localeSelection) updateTextsOfItem(oldKey, localeItemData);
    dispatch(setCurrentDialog({ type: "EDIT", opened: false }));
    runCommand("show_figma_notify", { message: "Item updated" });
  }, [localeSelection, localeItems]);

  const updateLocaleItemDebounce = useMemo(
    () =>
      debounce((data) => {
        dispatch(updateLocaleItem(data));
        // update selected text also
        if (localeSelection) updateTextsOfItem(null, data);
      }, 300),
    [localeSelection, localeItems]
  );
  useEffect(() => {
    return () => {
      updateLocaleItemDebounce.cancel();
    };
  }, []);
  // save on Change
  useEffect(() => {
    if (saveOnChange) {
      const watcher = watch((data) => {
        if (localeItem && data.key) {
          // console.log("Update item using debounce!", data);
          const localeItemData = getContent("quick-update", data);
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
    const localeItemData = getContent("create");
    dispatch(addLocaleItem(localeItemData));
    if (onDone && typeof onDone == "function") onDone(localeItemData);
    runCommand("show_figma_notify", { message: "Item created" });
  }, [localeSelection]);

  return (
    <form onSubmit={handleSubmit(item ? updateLocaleItemHandler : addNewKey)}>
      {showTitle && item && saveOnChange && (
        <header className="flex justify-between items-center mb-8">
          <h4 className="mt-0 font-medium truncate">
            Quick edit {localeItem.key}
          </h4>
          <EditInfo localeItem={localeItem} />
        </header>
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
      <div>
        {!saveOnChange && (
          <TextBox
            label="Key"
            id="key"
            className="mt-0"
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
        {!saveOnChange && <h4 className="mt-16 font-medium">Translation</h4>}
        <p className="text-secondary text-xsmall mt-4">
          {`Tip: <b>, <a>, <ul>, <ol>, <li> HTML tags could be used to style texts.`}
        </p>
        {/* <p
            css={`
              color: var(--figma-color-text-secondary);
              font-size: var(--font-size-xsmall);
              margin-top: 8px;
            `}
          >{`Use {{count}} for counter. Use {{variableName}} for variable`}</p> */}
        {languages.map((lang) => (
          <>
            <div className="relative mt-12">
              <Textarea
                label={LANGUAGE_LIST[lang]}
                id={lang}
                maxRows={6}
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
              <Textarea
                label={`${LANGUAGE_LIST[lang]} - Plural`}
                id={lang}
                className="mt-12"
                {...register(`${lang}.other`, { required: true })}
              />
            )}
          </>
        ))}
        {!saveOnChange && (
          <Controller
            name={`prioritized`}
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                label="Prioritize this when text duplication occurs"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-16"
              ></Checkbox>
            )}
          ></Controller>
        )}
        {!saveOnChange && (
          <footer className="flex justify-between items-center mt-16">
            <Button type="submit">{item ? "Update item" : "Add item"}</Button>

            {localeItem && <EditInfo localeItem={localeItem} />}
          </footer>
        )}
      </div>
    </form>
  );
}

export default LocaleItemForm;
