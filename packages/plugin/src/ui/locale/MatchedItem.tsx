import React, { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  updateMatchedItem,
  addLocaleItemsItem,
  updateSelectedText,
} from "../state/localeSlice";
import { useForm } from "react-hook-form";
import { TextBox } from "../components/Field";
import { removeVietnameseAccent } from "../../lib/helpers";
import { snakeCase } from "lodash";
import Button from "../components/Button";
const MatchedItem = () => {
  const matchedItem = useAppSelector((state) => state.locale.matchedItem);
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
  useEffect(() => {
    const watcher = watch((data) => {
      if (matchedItem && data.key) {
        // console.log(data);
        dispatch(updateMatchedItem(data));
      }
    });
    return () => {
      watcher.unsubscribe();
    };
  }, [watch, matchedItem]);
  useEffect(() => {
    if (selectedText) {
      if(!selectedText.key) {
        const newKey = snakeCase(removeVietnameseAccent(selectedText.characters));
        setValue("new_key", newKey);
        setValue('en', selectedText.characters);
        setValue('vi', selectedText.characters);
      }
    }
  }, [selectedText]);
  const addNewKey = useCallback(() => {
    const [new_key, en, vi] = getValues(["new_key", "en", "vi"]);
    dispatch(
      addLocaleItemsItem({
        key: new_key,
        en: en ? en : selectedText.characters,
        vi: vi ? vi : selectedText.characters,
      })
    );
    dispatch(updateSelectedText({ key: new_key }));
  }, [selectedText]);
  return (
    <div>
      <div className="mt-16">
        <h4>{matchedItem ? `${matchedItem.key}` : "No matched item"}</h4>
        {/* <TextBox label="Key" id="key" {...register("key")} disabled /> */}
        <TextBox label="English" id="en" className="mt-8" {...register("en")} />
        <TextBox
          label="Vietnamese"
          id="vi"
          className="mt-8"
          {...register("vi")}
        />
      </div>
      {selectedText && !selectedText.multiple && !matchedItem ? (
        <div className="flex w-full gap-8 align-items-end mt-16">
          <TextBox
            label="Add new key to sheet?"
            id="key"
            className="flex-grow-1"
            {...register("new_key")}
          />
          <Button
            // variant="secondary"
            // className="mt-12"
            onClick={addNewKey}
          >
            Add
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default MatchedItem;
