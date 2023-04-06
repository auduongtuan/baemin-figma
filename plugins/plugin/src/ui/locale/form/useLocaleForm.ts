import { useEffect } from "react";
import { useAppSelector } from "../../hooks/redux";
import { useForm } from "react-hook-form";
import {
  LocaleItem, isPlurals
} from "../../../lib/localeData";
import { removeVietnameseAccent } from "../../../lib/helpers";
import { snakeCase } from "lodash";
function useLocaleForm({item, quickEdit}: {item: LocaleItem, quickEdit?: boolean}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const watchHasPlurals = watch("hasPlurals", { en: false, vi: false });
  const isEdit = item ? true : false;
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );  
  // setup values for edit form
  useEffect(() => {
    if (item && item.key) {
      for (const inputName in item) {
        if (inputName == "key") {
          setValue("oldKey", item.key);
          setValue("key", item.key);
        }
        // language
        else {
          const itemContent = item[inputName];
          console.log(itemContent, isPlurals(itemContent));
          if (isPlurals(itemContent)) {
            setValue(`hasPlurals.${inputName}`, true);
            setValue(`${inputName}.one`, itemContent.one);
            setValue(`${inputName}.other`, itemContent.other);
          } else {
            setValue(`hasPlurals.${inputName}`, false);
            setValue(`${inputName}.one`, itemContent);
          }
        }
      }
    } else {
      reset({
        oldKey: "",
        key: "",
        en: null,
        vi: null,
        hasPlurals: { en: false, vi: false },
      });
    }
  }, [item]);
  // setup values for new form
  useEffect(() => {
    if (!item && localeSelection && localeSelection.texts[0]) {
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

  return {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
    setValue,
    getValues,
    watchHasPlurals,
    isEdit
  }
}

export default useLocaleForm;