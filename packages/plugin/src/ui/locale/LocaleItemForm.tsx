import React, { useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { updateMatchedItem } from "../state/localeSlice";
import { useForm } from "react-hook-form";
import { TextBox } from "../components/Field";
import { debounce } from "lodash";
import AddLocaleItem from "./AddLocaleItem";
import { findItemByKey } from "../../lib/localeData";
import { runCommand } from "../uiHelper";
import Combobox from "../components/Combobox";
function LocaleItemForm({item, showKey = true}) {
  const key = item ? item.key : undefined;
  console.log(item);
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const matchedItem = findItemByKey(key, localeItems);
  console.log('Matched item', matchedItem);
  console.log('Key', key);
  const localeSelection = useAppSelector((state) => state.locale.localeSelection);
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
    } else {
      reset({ key: "", en: "", vi: "" });
    }
  }, [matchedItem?.key]);
  const updateMatchedItemDebounce = useMemo(
    () => debounce((data) => {
      console.log('Update', data);
      dispatch(updateMatchedItem(data));
      // update selected text also
      if (localeSelection && !localeSelection.multiple) {
        if (localeSelection.key == data.key) {
          runCommand("update_text", {
            id: localeSelection.id,
            localeItem: data,
          });
        }
      }
      else if (localeSelection && localeSelection.multiple) {
        const texts = localeSelection.texts.filter(text => text.key == data.key);
        texts.forEach(text => {
          runCommand("update_text", {
            id: text.id,
            localeItem: data
          })
        });
      }
      // if (.)
    }, 300),
    []
  );
  useEffect(() => {
    return () => {
      updateMatchedItemDebounce.cancel();
    }
  }, []) 
  useEffect(() => {
    const watcher = watch((data) => {
      if (matchedItem && data.key) {
        console.log("Test debounce!");
        updateMatchedItemDebounce({ key: data.key, en: data.en, vi: data.vi });
      }
    });
    return () => {
      watcher.unsubscribe();
    };
  }, [watch, matchedItem]);


  return (
    <div>
      {matchedItem && (
        <>
          {showKey && <h4 className="mt-0 mb-4 font-medium text-secondary">Edit {matchedItem.key}</h4>}
          <div className="">
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
          </div>
        </>
      )}
    </div>
  );
};

export default LocaleItemForm;
