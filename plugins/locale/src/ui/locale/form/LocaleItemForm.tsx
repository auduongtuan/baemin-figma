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
  Select,
  Tooltip,
  IconButton,
  Dialog,
} from "ds";
import { debounce, get, isString } from "lodash-es";
import { LANGUAGE_LIST, LocaleItem, findItemByKey } from "../../../lib";
import { runCommand } from "../../uiHelper";
import { setCurrentDialog } from "../../state/localeAppSlice";
import useLocaleForm from "./useLocaleForm";
import {
  getDefaultLocalLibraryId,
  getLibrary,
  getLibraryOptions,
  updateTextsOfItem,
} from "../../state/helpers";
import { addLocaleItem } from "../../state/localeSlice";
import {
  useLanguages,
  useLocaleItems,
  useLocaleSelection,
} from "../../hooks/locale";
import EditInfo from "./../atoms/EditInfo";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

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
    formState: { errors },
    getValues,
    watchHasPlurals,
  } = useLocaleForm({ item: localeItem, quickEdit: saveOnChange });
  // reset when key is change
  const isKeyAvailable = useCallback(
    (key) => {
      const foundItem = localeItems.find(
        (item) => item.key === key && item.isLocal
      );
      if (!foundItem) {
        return true;
      } else {
        return false;
      }
    },
    [localeItems]
  );
  const defaultLocalLibraryId = getDefaultLocalLibraryId();
  const getContent = (
    type: "create" | "update" | "quick-update" = "create",
    data = null
  ): LocaleItem => {
    const { key, hasPlurals, prioritized, fromLibrary, ...content } =
      data || getValues();
    const currentDate = new Date();
    return languages.reduce(
      (acc, lang: string) => {
        if (lang in hasPlurals && lang in content && content[lang]) {
          acc[lang] = hasPlurals[lang] ? content[lang] : content[lang].one;
        }
        return acc;
      },
      {
        ...(localeItem
          ? {
              createdAt: localeItem.createdAt,
              prioritized: localeItem.prioritized,
              imported: localeItem.imported,
            }
          : {}),
        key: key,
        fromLibrary: fromLibrary || defaultLocalLibraryId,
        isLocal: getLibrary(fromLibrary)?.local || false,
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

  const localeLibraries = useAppSelector(
    (state) => state.locale.localeLibraries
  );
  const submitFn = handleSubmit(item ? updateLocaleItemHandler : addNewKey);
  return (
    <form onSubmit={submitFn}>
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
            labelClass="font-medium"
            id="key"
            className="mt-0"
            {...register("key", {
              required: true,
              validate: {
                available: (v) =>
                  (localeItem && v == localeItem.key) || isKeyAvailable(v),
              },
            })}
            afterLabel={
              <Tooltip
                content={'Tip: Use "." for groupping, e.g: feature_a.message'}
              >
                <IconButton>
                  <QuestionMarkCircledIcon />
                </IconButton>
              </Tooltip>
            }
            helpText={``}
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
          <div className="flex mt-24">
            <h4 className="font-medium flex-grow-1">Translation</h4>
            <div className="flex-grow-0 flex-shrink-0">
              <Tooltip
                content={
                  <>
                    <p>
                      {`Tip: Use {{count}} for counter. Use {{variableName}} for variable.`}
                    </p>
                    <p className="mt-8">
                      {`Tip: <b>, <a>, <ul>, <ol>, <li> HTML tags could be used to style texts.`}
                    </p>
                  </>
                }
              >
                <IconButton>
                  <QuestionMarkCircledIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        )}
        {languages.map((lang) => (
          <>
            <div className="relative mt-12">
              <Textarea
                label={LANGUAGE_LIST[lang]}
                afterLabel={
                  <Controller
                    name={`hasPlurals.${lang}`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Switch
                          {...field}
                          label="Plural"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        ></Switch>
                      </div>
                    )}
                  ></Controller>
                }
                id={lang}
                maxRows={6}
                className=""
                {...register(`${lang}.one`, { required: true })}
                errorText={
                  get(errors, `${lang}.one`) &&
                  `${LANGUAGE_LIST[lang]} translation is required`
                }
              />
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
          <Dialog.Footer>
            <footer className="flex justify-between items-center">
              <Button type="submit" onClick={submitFn}>
                {localeItem ? "Update item" : "Add item"}
              </Button>

              <Controller
                name={`fromLibrary`}
                control={control}
                render={({ field }) => (
                  <Select
                    inline
                    maxWidth={"120px"}
                    value={field.value}
                    onChange={field.onChange}
                    options={getLibraryOptions()}
                  />
                )}
              />
            </footer>
          </Dialog.Footer>
        )}
      </div>
    </form>
  );
}

export default LocaleItemForm;
