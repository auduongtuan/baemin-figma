import React, { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { addLocaleItem, updateLocaleSelection } from "../state/localeSlice";
import { useForm } from "react-hook-form";
import { TextBox } from "../components/Field";
import { removeVietnameseAccent } from "../../lib/helpers";
import { snakeCase } from "lodash";
import Button from "../components/Button";
import { setNewDialogOpened } from "../state/localeAppSlice";
import { runCommand } from "../uiHelper";
const AddLocaleItemForm = ({
  showTitle = true,
}: {
  showTitle?: boolean;
}) => {
  const newDialogOnDone = useAppSelector((state) => state.localeApp.newDialogOnDone);
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
    if (localeSelection && localeSelection.characters) {
      if (!localeSelection.key) {
        const newKey = snakeCase(
          removeVietnameseAccent(localeSelection.characters)
        );
        setValue("new_key", newKey);
        setValue("en", localeSelection.characters);
        setValue("vi", localeSelection.characters);
      }
    }
    if (!localeSelection) {
      setValue("en", "");
      setValue("vi", "");
    }
  }, [localeSelection]);
  const addNewKey = useCallback(() => {
    const [new_key, en, vi] = getValues(["new_key", "en", "vi"]);
    const localeItem = {
      key: new_key,
      en: en ? en : localeSelection.characters,
      vi: vi ? vi : localeSelection.characters,
    };
    dispatch(
      addLocaleItem(localeItem)
    );
    dispatch(updateLocaleSelection({ key: new_key }));
    if(newDialogOnDone) newDialogOnDone(localeItem);
    dispatch(setNewDialogOpened(false));
    runCommand("show_figma_notify", {message: "Item created"})
  }, [localeSelection]);
  return (
    <div>
      {showTitle && (
        <header className="mb-16">
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
        </header>
      )}
      <div className="">
        <TextBox
          label="Key"
          id="key"
          className=""
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

export default AddLocaleItemForm;
