import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  updateLocaleItem,
  updateTextsInLocaleSelection,
} from "../state/localeSlice";
import { useForm } from "react-hook-form";
import { TextBox } from "../components/Field";
import { debounce, isEmpty, isString } from "lodash";
import AddLocaleItemForm from "./AddLocaleItemForm";
import {
  LocaleItem,
  LocaleSelection,
  LocaleText,
  findItemByKey,
} from "../../lib/localeData";
import { runCommand } from "../uiHelper";
import Button from "../components/Button";
import { setEditDialogOpened } from "../state/localeAppSlice";
import { store } from "../state/store";
import Switch from "../components/Switch";
function updateTextsOfItem(
  oldKey: string,
  data: LocaleItem,
  localeSelection: LocaleSelection
) {
  const key = oldKey ? oldKey : data.key;
  // update selected text also
  const texts = localeSelection.texts.filter((text) => text.key == key);
  texts.forEach((text) => {
    runCommand("update_text", {
      id: text.id,
      localeItem: data,
    });
  });
  store.dispatch(
    updateTextsInLocaleSelection(
      localeSelection.texts.map((text) =>
        text.key == key ? { ...text, characters: data[text.lang] } : text
      )
    )
  );
}
function LocaleItemForm({
  item,
  showTitle = true,
  saveOnChange = true,
}: {
  item: LocaleItem | string;
  showTitle?: boolean;
  saveOnChange?: boolean;
}) {
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const localeItem = useMemo(() => isString(item) ? findItemByKey(item, localeItems) : item, [item, localeItems]);
  const [hasPlurals, setHasPlurals] = useState<boolean>(true);
  // useEffect(() => {
  //   setHasPlurals('plurals' in localeItem && !isEmpty(localeItem.plurals));
  // }, [localeItem]);
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const dispatch = useAppDispatch();
  const {
    register,
    // handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  // reset when key is change
  useEffect(() => {
    if (localeItem && localeItem.key) {
      for (const inputName in localeItem) {
        setValue(inputName, localeItem[inputName]);
      }
      setValue("new_key", localeItem.key);
    } else {
      reset({ key: "", en: "", vi: "", plurals: null });
    }
  }, [localeItem?.key]);

  // save on submit
  const updateLocaleItemHandler = () => {
    const [key, en, vi, plurals] = getValues(["key", "en", "vi", "plurals"]);
    const localeItemData = hasPlurals ? {
      key: key,
      plurals: plurals
    } : {
      key: key,
      en: en,
      vi: vi,
    };
    dispatch(updateLocaleItem(localeItemData));
    if (localeSelection) updateTextsOfItem(null, localeItem, localeSelection);
    dispatch(setEditDialogOpened(""));
  };

  const updateLocaleItemDebounce = useMemo(
    () =>
      debounce((data) => {
        console.log("Update", data);
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
          console.log("Update item using debounce!");
          console.log(data);
          const {key, en, vi, plurals} = data;
          const localeItemData = hasPlurals ? {
            key: key,
            plurals: plurals
          } : {
            key: key,
            en: en,
            vi: vi,
          };
          updateLocaleItemDebounce(localeItemData);
        }
      });
      return () => {
        watcher.unsubscribe();
      };
    }
  }, [watch, localeItem, saveOnChange]);

  return (
    <div>
      {localeItem && (
        <>
          {showTitle && (
            <h4 className="mt-0 mb-4 font-medium text-secondary">
              Quick edit {localeItem.key}
            </h4>
          )}
          <Switch label='Has plurals' checked={hasPlurals} onCheckedChange={setHasPlurals}></Switch>
          <input type="hidden" {...register("key")} />
          <div className="mt-16">
            {!saveOnChange && (
              <TextBox
                label="Key"
                id="new_key"
                className="mt-12"
                disabled
                {...register("new_key")}
              />
            )}
            {hasPlurals === false && <>
            <TextBox
              label="English"
              id="en"
              className="mt-12"
              {...register("en", {required: true})}
            />
            <TextBox
              label="Vietnamese"
              id="vi"
              className="mt-12"
              {...register("vi", {required: true})}
            />
            </>}
            {hasPlurals === true && (
              <div>
                {["one", "other"].map((quantity) => {
                  return (
                    <div className="mt-16">
                      <h4>{quantity}</h4>
                      <TextBox
                        label="English"
                        id="en"
                        className="mt-12"
                        {...register(`plurals.${quantity}.en`, {required: true})}
                      />
                      <TextBox
                        label="Vietnamese"
                        id="vi"
                        className="mt-12"
                        {...register(`plurals.${quantity}.vi`, {required: true})}
                      />
                    </div>
                  );
                })}
              </div>
            )}
            {!saveOnChange && (
              <Button
                // variant="secondary"
                className="mt-16"
                onClick={updateLocaleItemHandler}
              >
                Update item
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default LocaleItemForm;
