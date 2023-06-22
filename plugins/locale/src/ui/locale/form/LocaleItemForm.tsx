import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import {
  Button,
  Checkbox,
  Dialog,
  IconButton,
  Select,
  Switch,
  TextBox,
  Textarea,
  Tooltip,
} from "ds";
import { get, isString } from "lodash-es";
import { useCallback, useEffect, useMemo } from "react";
import { Controller } from "react-hook-form";
import { LANGUAGE_LIST, Lang, LocaleItem, findItemByKey } from "../../../lib";
import {
  useLanguages,
  useLocaleItems,
  useLocaleSelection,
} from "../../hooks/locale";
import { getLibraryOptions, isIdAvailable } from "../../state/helpers";
import EditInfo from "./../atoms/EditInfo";
import {
  addItemHandler,
  quickUpdateItemHandler,
  updateItemHandler,
} from "./itemHandler";
import { debounce } from "lodash-es";
import useLocaleForm, { FormValues } from "./useLocaleForm";

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
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    getValues,
    watchHasPlurals,
  } = useLocaleForm({ item: localeItem });

  // save on submit
  const updateLocaleItemHandler = useCallback(() => {
    updateItemHandler(getValues());
  }, []);

  const quickUpdateItemDebounce = useMemo(
    () => debounce((data: FormValues) => quickUpdateItemHandler(data), 300),
    []
  );
  useEffect(() => {
    if (saveOnChange) {
      const watcher = watch((data) => {
        quickUpdateItemDebounce(data as FormValues);
      });
      return () => {
        watcher.unsubscribe();
      };
    }
  }, []);

  // add new key
  const addNewKey = useCallback(() => {
    const localeItemData = addItemHandler(getValues());
    if (onDone && typeof onDone == "function") onDone(localeItemData);
  }, []);

  const submitFn = handleSubmit(item ? updateLocaleItemHandler : addNewKey);

  return (
    <form onSubmit={submitFn}>
      {showTitle && item && saveOnChange && (
        <header className="flex items-center justify-between mb-8">
          <h4 className="mt-0 font-medium truncate">
            Quick edit {localeItem.key}
          </h4>
          <EditInfo localeItem={localeItem} />
        </header>
      )}
      {showTitle && !item && (
        <header className="mb-16">
          <h4 className="mb-0">Add new locale item</h4>
          <p className="mt-8 text-secondary">No matched item found</p>
        </header>
      )}
      <input type="hidden" {...register("oldKey")} />
      <input type="hidden" {...register("oldFromLibrary")} />
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
                  (localeItem && v == localeItem.key) ||
                  isIdAvailable([v, getValues("fromLibrary")]),
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
            <h4 className="font-medium grow">Translation</h4>
            <div className="grow-0 shrink-0">
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
        {languages.map((lang: Lang) => (
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
                          // {...field}
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
                // {...field}
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
            <footer className="flex items-center justify-between">
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
