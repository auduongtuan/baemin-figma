import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  updateMatchedItem,
} from "../state/localeSlice";
import { useForm } from "react-hook-form";
import { TextBox } from "../components/Field";

const MatchedItem = () => {
  const matchedItem = useAppSelector((state) => state.locale.matchedItem);
  const dispatch = useAppDispatch();
  const {
    register,
    // handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm();
  // reset when key is change
  useEffect(() => {
    if(matchedItem && matchedItem.key) {
      for (const inputName in matchedItem) {
        setValue(inputName, matchedItem[inputName]);
      }
    } else {
      reset({key: '', en: '', vi: ''});
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
  return (
    <div className="mt-16">
      <h4>{matchedItem ? `${matchedItem.key}` : 'No matched item'}</h4>
      {/* <TextBox label="Key" id="key" {...register("key")} disabled /> */}
      <TextBox label="English" id="en" className="mt-8" {...register("en")} />
      <TextBox label="Vietnamese" id="vi" className="mt-8" {...register("vi")} />
    </div>
  );
};

export default MatchedItem;