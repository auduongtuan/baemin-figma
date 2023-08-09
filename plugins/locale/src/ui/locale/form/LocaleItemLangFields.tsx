import { useCallback } from "react";
import { Switch } from "ds";
import { Controller, useFormContext } from "react-hook-form";
import { LANGUAGE_LIST } from "../../../lib";
import LocaleItemTextarea from "./LocaleItemTextarea";

const LocaleItemLangFields = ({ hasPlural, lang }) => {
  const { control, setValue, getValues } = useFormContext();
  const onVariableSelect = useCallback(
    (fieldName: string) =>
      (variableName: string, textareaEl: HTMLTextAreaElement) => {
        const selectionStart = textareaEl.selectionStart;
        const selectionEnd = textareaEl.selectionEnd;
        const oldValue = (getValues(fieldName) as string) || "";
        const newValue =
          oldValue.substring(0, selectionStart) +
          variableName +
          oldValue.substring(selectionEnd);
        setValue(fieldName, newValue);
        setTimeout(() => {
          textareaEl.selectionStart = selectionStart + variableName.length;
          textareaEl.selectionEnd = selectionStart + variableName.length;
        }, 0);
      },
    [getValues, setValue]
  );
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
            onVariableSelect={onVariableSelect(field.name)}
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
              onVariableSelect={onVariableSelect(field.name)}
              ref={field.ref}
            />
          )}
        />
      )}
    </div>
  );
};

export default LocaleItemLangFields;
