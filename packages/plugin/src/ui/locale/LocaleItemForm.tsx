import React, { useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  updateLocaleItem,
  updateTextsInLocaleSelection,
} from "../state/localeSlice";
import { useForm } from "react-hook-form";
import { TextBox } from "../components/Field";
import { debounce, isString } from "lodash";
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
function updateTextsOfItem(
  oldKey: string,
  data: LocaleItem,
  localeSelection: LocaleSelection
) {
  const key = oldKey ? oldKey : data.key;
  console.log("Update", key, data);
  // update selected text also
  if (localeSelection && !localeSelection.multiple) {
    if (localeSelection.key == key) {
      runCommand("update_text", {
        id: localeSelection.id,
        localeItem: data,
      });
    }
  } else if (localeSelection && localeSelection.multiple) {
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
        ),
      )
    );
  }
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
  const matchedItem = isString(item) ? findItemByKey(item, localeItems) : item;
  console.log("Matched item", matchedItem);
  console.log("Key", matchedItem.key);
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
    if (matchedItem && matchedItem.key) {
      for (const inputName in matchedItem) {
        setValue(inputName, matchedItem[inputName]);
      }
      setValue("new_key", matchedItem.key);
    } else {
      reset({ key: "", en: "", vi: "" });
    }
  }, [matchedItem?.key]);
  const updateLocaleItemHandler = () => {
    const [key, en, vi] = getValues(["key", "en", "vi"]);
    const localeItem = {
      key: key,
      en: en,
      vi: vi,
    };
    dispatch(updateLocaleItem(localeItem));
    updateTextsOfItem(null, localeItem, localeSelection);
    dispatch(setEditDialogOpened(""));
  };

  const updateMatchedItemDebounce = useMemo(
    () =>
      debounce((data) => {
        console.log("Update", data);
        dispatch(updateLocaleItem(data));
        // update selected text also
        updateTextsOfItem(null, data, localeSelection);
        // if (.)
      }, 300),
    []
  );
  useEffect(() => {
    return () => {
      updateMatchedItemDebounce.cancel();
    };
  }, []);
  useEffect(() => {
    if (saveOnChange) {
      const watcher = watch((data) => {
        if (matchedItem && data.key) {
          console.log("Update item using debounce!");
          updateMatchedItemDebounce({
            key: data.key,
            en: data.en,
            vi: data.vi,
          });
        }
      });
      return () => {
        watcher.unsubscribe();
      };
    }
  }, [watch, matchedItem, saveOnChange]);

  return (
    <div>
      {matchedItem && (
        <>
          {showTitle && (
            <h4 className="mt-0 mb-4 font-medium text-secondary">
              Quick edit {matchedItem.key}
            </h4>
          )}
          <div className="">
            <input type="hidden" {...register("key")} />
            {!saveOnChange && (
              <TextBox
                label="Key"
                id="new_key"
                className="mt-12"
                disabled
                {...register("new_key")}
              />
            )}
            <TextBox
              label="English"
              id="en"
              className="mt-12"
              {...register("en")}
            />
            <TextBox
              label="Vietnamese"
              id="vi"
              className="mt-12"
              {...register("vi")}
            />
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
