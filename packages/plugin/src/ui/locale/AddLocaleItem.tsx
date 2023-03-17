import React, { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { addLocaleItemsItem, updateSelectedText } from "../state/localeSlice";
import { useForm } from "react-hook-form";
import { TextBox } from "../components/Field";
import { removeVietnameseAccent } from "../../lib/helpers";
import { snakeCase } from "lodash";
import Button from "../components/Button";
const AddLocaleItem = () => {
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
    if (selectedText && selectedText.characters) {
      if (!selectedText.key) {
        const newKey = snakeCase(
          removeVietnameseAccent(selectedText.characters)
        );
        setValue("new_key", newKey);
        setValue("en", selectedText.characters);
        setValue("vi", selectedText.characters);
      }
    }
    if (!selectedText) {
      setValue("en", "");
      setValue("vi", "");
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
      <div className="pt-4">
        <TextBox
          label="Key"
          id="key"
          className="mt-12"
          helpText={`Tip: Use "." for groupping, e.g: feature_a.message`}
          {...register("new_key")}
        />
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
        <Button
          // variant="secondary"
          className="mt-16"
          onClick={addNewKey}
        >
          Add new item
        </Button>
      </div>
    </div>
  );
};

export default AddLocaleItem;
