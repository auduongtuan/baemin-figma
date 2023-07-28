import { useState } from "react";
import { Switch } from "ds";
import { Controller, useFormContext } from "react-hook-form";
import { LANGUAGE_LIST } from "../../../lib";
import { useLanguages } from "@ui/hooks/locale";
import VariableMenu from "./VariableMenu";
import LocaleItemTextarea from "./LocaleItemTextarea";

const LocaleItemLangFields = ({ hasPlural, lang }) => {
  const { control, setValue } = useFormContext();
  return (
    <div className="mt-12">
      <Controller
        name={`${lang}.one`}
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <LocaleItemTextarea
            label={LANGUAGE_LIST[lang]}
            afterLabel={
              <Controller
                name={`hasPlurals.${lang}`}
                control={control}
                render={({ field }) => (
                  <div>
                    <Switch
                      // {...field}
                      label="Plural"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    ></Switch>
                  </div>
                )}
              ></Controller>
            }
            id={lang}
            maxRows={6}
            errorText={
              fieldState.error &&
              `${LANGUAGE_LIST[lang]} translation is required`
            }
            value={field.value}
            onChange={field.onChange}
            onVariableSelect={(variableName, textareaEl) => {
              const selectionStart = textareaEl.selectionStart;
              const selectionEnd = textareaEl.selectionEnd;
              const oldValue = field.value as string;
              const newValue =
                oldValue.slice(0, selectionStart) +
                variableName +
                oldValue.slice(selectionEnd);
              setValue(`${lang}.one`, newValue);
              setTimeout(() => {
                textareaEl.selectionStart =
                  selectionStart + variableName.length;
                textareaEl.selectionEnd = selectionStart + variableName.length;
              }, 0);
            }}
            ref={field.ref}
          />
        )}
      />

      {hasPlural && (
        <Controller
          name={`${lang}.other`}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <LocaleItemTextarea
              label={`${LANGUAGE_LIST[lang]} - Plural`}
              id={lang}
              className="mt-12"
              value={field.value}
              onChange={field.onChange}
              onVariableSelect={(variableName) => {}}
              ref={field.ref}
            />
          )}
        />
      )}
    </div>
  );
};

export default LocaleItemLangFields;
