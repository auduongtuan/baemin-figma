import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  updateMatchedItem,
} from "../state/localeSlice";
import { useForm } from "react-hook-form";
import { Field, Select } from "../uiComponents";

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
      <h3>Matched item</h3>
      <Field label="Key" id="key" {...register("key")} disabled />
      <Field label="English" id="en" className="mt-16" {...register("en")} />
      <Field label="Vietnamese" id="vi" className="mt-16" {...register("vi")} />
    </div>
  );
};

export default MatchedItem;