import { GearIcon } from "@radix-ui/react-icons";
import {
  Button,
  Checkbox,
  ErrorMessage,
  IconButton,
  Popover,
  Select,
  Tooltip,
} from "ds";
import configs from "figma-helpers/configs";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LANGUAGE_LIST, NUMBER_FORMAT_LIST } from "../../../lib";
// import Prism from "prismjs";
// import "prismjs/components/prism-json";
// import { Token } from "prismjs";
// import { Token } from "prismjs";
import { isArray } from "lodash-es";
import { runCommand } from "../../uiHelper";
import io from "figma-helpers/io";
import { useConfigs } from "../../hooks/locale";
import { useAppDispatch } from "../../hooks/redux";
import { setConfigs } from "../../state/localeAppSlice";
const Settings = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { languages, defaultLanguage, numberFormat } = useConfigs();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue,
    reset,
    getValues,
    watch,
  } = useForm({
    // defaultValues,
  });
  useEffect(() => {
    reset({
      languages,
      defaultLanguage,
      numberFormat,
    });
  }, [languages, defaultLanguage, numberFormat]);
  const fieldLanguages = watch("languages");
  const dispatch = useAppDispatch();
  const onSubmit = ({ languages, defaultLanguage, numberFormat }) => {
    dispatch(setConfigs({ languages, defaultLanguage, numberFormat }));
    io.sendAndReceive("set_configs", { configs: configs.getAll() }).then(() => {
      runCommand("show_figma_notify", { message: "Settings updated." });
    });
    setPopoverOpen(false);
    // console.log(
    //   Object.keys(newLanguages).filter((lang) => newLanguages[lang] == true)
    // );
  };
  return (
    <Popover open={popoverOpen} onOpenChange={(open) => setPopoverOpen(open)}>
      <Tooltip content="Settings">
        <Popover.Trigger asChild>
          <IconButton>
            <GearIcon />
          </IconButton>
        </Popover.Trigger>
      </Tooltip>

      <Popover.Content title="Settings" width={"210px"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="languages" className="text-xsmall">
            Languages
          </label>
          <Controller
            name={`languages`}
            control={control}
            rules={{
              validate: {
                atLeast2: (v) => isArray(v) && v.length > 1,
              },
            }}
            render={({ field }) => (
              <>
                {Object.keys(LANGUAGE_LIST).map((lang) => {
                  return (
                    <Checkbox
                      {...field}
                      value={lang}
                      label={LANGUAGE_LIST[lang]}
                      onCheckedChange={(value) => {
                        const currentValue = new Set(field.value);
                        if (value) {
                          field.onChange([...currentValue.add(lang)]);
                        }
                        if (!value && currentValue.has(lang)) {
                          currentValue.delete(lang);
                          field.onChange([...currentValue]);
                        }
                      }}
                      checked={field.value.includes(lang)}
                      className="mt-8"
                    />
                  );
                })}
              </>
            )}
          />
          {errors.languages && (
            <ErrorMessage>Please select at least 2 languages.</ErrorMessage>
          )}
          <Controller
            name="defaultLanguage"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                className="mt-16"
                label="Default language"
                options={
                  fieldLanguages
                    ? fieldLanguages.map((lang) => ({
                        value: lang,
                        name: LANGUAGE_LIST[lang],
                      }))
                    : []
                }
                errorText={
                  errors.defaultLanguage
                    ? "Please select default language."
                    : undefined
                }
              />
            )}
          />
          <Controller
            name="numberFormat"
            control={control}
            rules={{ required: false }}
            defaultValue={"by-language"}
            render={({ field }) => (
              <Select
                {...field}
                className="mt-16"
                label="Number Format"
                contentTruncate={false}
                options={
                  NUMBER_FORMAT_LIST
                    ? [
                        {
                          value: "by-language",
                          name: "By language",
                          content: "Changed by text language",
                        },
                      ].concat(
                        Object.keys(NUMBER_FORMAT_LIST).map((numberFormat) => ({
                          value: numberFormat,
                          name: new Intl.NumberFormat(
                            NUMBER_FORMAT_LIST[numberFormat].representative
                          ).format(1234.56),
                          content: NUMBER_FORMAT_LIST[numberFormat].description,
                        }))
                      )
                    : []
                }
              />
            )}
          />
          <Button type="submit" className="mt-16">
            Save
          </Button>
        </form>
      </Popover.Content>
    </Popover>
  );
};
export default Settings;
