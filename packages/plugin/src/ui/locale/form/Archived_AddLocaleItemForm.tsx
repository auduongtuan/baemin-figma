import React, { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { addLocaleItem, updateLocaleSelection } from "../../state/localeSlice";
import { TextBox } from "../../components/Field";
import { removeVietnameseAccent } from "../../../lib/helpers";
import { snakeCase } from "lodash";
import Button from "../../components/Button";
import { setCurrentDialog } from "../../state/localeAppSlice";
import { runCommand } from "../../uiHelper";

import { Controller, useForm } from "react-hook-form";
import { LANGUAGES } from "../../../constant/locale";
import Switch from "../../components/Switch";
import { LocaleItem } from "../../../lib/localeData";
import { findItemByKey } from "../../../lib/localeData";

const AddLocaleItemForm = ({
  showTitle = true,
  onDone
}: {
  showTitle?: boolean;
  onDone?: (item: LocaleItem) => void
}) => {
  const currentDialog = useAppSelector((state) => state.localeApp.currentDialog);
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  // reset when key is change
  const watchHasPlurals = watch("hasPlurals", { en: false, vi: false });

  useEffect(() => {
    if (localeSelection && localeSelection.texts[0]) {
      if (!localeSelection.texts[0].key) {
        const newKey = snakeCase(
          removeVietnameseAccent(localeSelection.texts[0].characters)
        );
        setValue("key", newKey);
        setValue("en.one", localeSelection.texts[0].characters);
        setValue("vi.one", localeSelection.texts[0].characters);
      }
    }
    if (!localeSelection) {
      setValue("en.one", "");
      setValue("vi.one", "");
    }
  }, [localeSelection]);
  const isKeyAvailable = useCallback((key) => {
    if(!findItemByKey(key, localeItems)) {
      return true;
    } else {
      return false;
    }
  }, [localeItems]);
  const addNewKey = useCallback(() => {
    const [key, en, vi, hasPlurals] = getValues([
      "key",
      "en",
      "vi",
      "hasPlurals",
    ]);
    const localeItemData = {
      key: key,
      en: hasPlurals.en ? en : en.one,
      vi: hasPlurals.vi ? vi : vi.one,
    };
    dispatch(
      addLocaleItem(localeItemData)
    );
    // may be comment
    // dispatch(updateLocaleSelection({ key: new_key }));
    if(onDone && typeof onDone == 'function') onDone(localeItemData);
    runCommand("show_figma_notify", {message: "Item created"})
  }, [localeSelection]);
  if(errors) {
    console.log(errors);
  }
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
      <form onSubmit={handleSubmit(addNewKey)} className="">
        <TextBox
          label="Key"
          id="key"
          className=""
          helpText={`Tip: Use "." for groupping, e.g: feature_a.message`}
          {...register("key", {required: true, validate: {
            available: isKeyAvailable
          }})}
          errorText={
            errors.key && `${errors.key.type == 'available' ? 'Key already exists' : 'Key is required'}`
          }
        />
        {Object.keys(LANGUAGES).map((lang) => (
              <>
                <div className="relative mt-12">
                  <TextBox
                    label={LANGUAGES[lang]}
                    id={lang}
                    className=""
                    {...register(`${lang}.one`, { required: true })}
                
                  />
                  <div
                    css={`
                      position: absolute;
                      top: -2px;
                      right: 0;
                    `}
                  >
                    <Controller
                      name={`hasPlurals.${lang}`}
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          label="Plural"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        ></Switch>
                      )}
                    ></Controller>
                  </div>
                </div>
                {watchHasPlurals[lang] && (
                  <TextBox
                    label={`${LANGUAGES[lang]} - Plural`}
                    id={lang}
                    className="mt-12"
                    {...register(`${lang}.other`, { required: true })}
                  />
                )}
              </>
            ))}
        <Button
          // variant="secondary"
          className="mt-16"
          type="submit"
        >
          Add new item
        </Button>
      </form>
    </div>
  );
};

export default AddLocaleItemForm;
