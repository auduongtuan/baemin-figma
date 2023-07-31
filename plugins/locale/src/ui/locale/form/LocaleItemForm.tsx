import { DashboardIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
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
  DropdownMenu,
} from "ds";
import { get, isString } from "lodash-es";
import { useCallback, useEffect, useMemo } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { LANGUAGE_LIST, Lang, LocaleItem, findItemByKey } from "../../../lib";
import {
  useDialog,
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
import LocaleItemLangFields from "./LocaleItemLangFields";

function LocaleItemForm({
  item,
  showTitle = false,
  saveOnChange = false,
  onDone: onDoneProp,
}: {
  showTitle?: boolean;
  saveOnChange?: boolean;
  item?: LocaleItem | string;
  onDone?: (localeItem: LocaleItem) => void;
}) {
  const localeItems = useLocaleItems();
  const localeSelection = useLocaleSelection();
  const localeItem = useMemo(
    () => (isString(item) ? findItemByKey(item, localeItems) : item),
    [item, localeItems, localeSelection]
  );
  const languages = useLanguages();
  const {
    state: { onDone: dialogOnDone },
    closeDialog,
    context,
  } = useDialog();
  const onDone = onDoneProp || dialogOnDone;
  const { methods, watchHasPlurals } = useLocaleForm({ item: localeItem });
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    getValues,
  } = methods;

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

  const submitFn = handleSubmit(() => {
    if (item) {
      updateLocaleItemHandler();
    } else {
      addNewKey();
    }
    if (!saveOnChange) closeDialog();
  });

  const renderFooter = () => {
    return (
      <footer className="flex items-center justify-between">
        <Button type="submit" onClick={submitFn}>
          {localeItem ? "Update" : "Add"}
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
    );
  };
  return (
    <FormProvider {...methods}>
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
            <h4 className="mb-0">Add new item</h4>
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
            <LocaleItemLangFields
              hasPlural={watchHasPlurals[lang]}
              lang={lang}
            />
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
          {!saveOnChange &&
            (Object.keys(context).length > 0 ? (
              <Dialog.Footer>{renderFooter()}</Dialog.Footer>
            ) : (
              <div className="mt-24">{renderFooter()}</div>
            ))}
        </div>
      </form>
    </FormProvider>
  );
}

export default LocaleItemForm;
