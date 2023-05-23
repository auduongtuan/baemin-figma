import { GearIcon } from "@radix-ui/react-icons";
import {
  Button,
  Checkbox,
  ErrorMessage,
  IconButton,
  Popover,
  Tooltip,
} from "ds";
import configs from "figma-helpers/configs";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LANGUAGE_LIST } from "../../../lib";
// import Prism from "prismjs";
// import "prismjs/components/prism-json";
// import { Token } from "prismjs";
// import { Token } from "prismjs";
import { isArray } from "lodash-es";
import { runCommand } from "../../uiHelper";
import io from "figma-helpers/io";
const Settings = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const languages = configs.get("languages");
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      languages: [...languages],
    },
  });
  const onSubmit = ({ languages }) => {
    configs.set("languages", languages);
    io.sendAndReceive("set_configs", { configs: { languages } }).then(() => {
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
          <Button type="submit" className="mt-16">
            Save
          </Button>
        </form>
      </Popover.Content>
    </Popover>
  );
};
export default Settings;
