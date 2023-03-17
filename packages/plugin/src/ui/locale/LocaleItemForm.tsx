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
function LocaleItemForm({item}) {
  const key = item ? item.key : undefined;
  console.log(item);
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const matchedItem = findItemByKey(key, localeItems);
  console.log('Matched item', matchedItem);
  console.log('Key', key);
  const selectedText = useAppSelector((state) => state.locale.selectedText);
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
      if (selectedText && !selectedText.multiple) {
        if (selectedText.key == data.key) {
          console.log("Update matched item and text", selectedText.id, {
            item: matchedItem
          });
          runCommand("update_text", {
            id: selectedText.id,
            localeItem: data,
          });
        }
      }
      else if (selectedText && selectedText.multiple) {
        const texts = selectedText.texts.filter(text => text.key == data.key);
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
          <h4 className="mt-0 font-medium text-secondary">{matchedItem.key}</h4>
          <div className="pt-4">
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
