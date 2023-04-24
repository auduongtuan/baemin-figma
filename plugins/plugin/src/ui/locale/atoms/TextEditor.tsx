import React, { useEffect, useState, useMemo } from "react";
import { debounce } from "lodash";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Controller, useForm } from "react-hook-form";
import { IconButton, Tooltip, TextBox, Textarea, Switch } from "ds";
import {
  FontFamilyIcon,
  MinusCircledIcon,
  TextIcon,
} from "@radix-ui/react-icons";
import KeyCombobox from "./KeyCombobox";
import {
  LocaleText,
  LocaleTextVariables,
  getVariableNames,
} from "../../../lib/localeData";
import { findItemByKey } from "../../../lib/localeData";
import { get, isObject } from "lodash";
import { runCommand } from "../../uiHelper";
import { updateTextInLocaleSelection } from "../../state/localeSlice";
import { Tag } from "ds";
import SwitchLanguageDropdownMenu from "./SwitchLanguageDropdownMenu";
import EditDialog from "../dialogs/EditDialog";
import FormulaEditor from "./FormulaEditor";
import classNames from "classnames";
const Toolbar: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  children,
}) => {
  return (
    <div
      className={classNames("flex items-center gap-8", className)}
      css={`
        & > .icon-group {
          transition: opacity 0.1s;
        }
        & > .icon-group:not([data-activated]) {
          opacity: 0;
        }
        &:hover > .icon-group,
        & > .icon-group[date-activated] {
          opacity: 1;
        }
      `}
    >
      {children}
    </div>
  );
};
const TextEditor = ({ text }: { text: LocaleText }) => {
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const localeItem =
    text && text.key ? findItemByKey(text.key, localeItems) : null;

  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const [useFormula, setUseFormula] = useState(false);
  const dispatch = useAppDispatch();
  const {
    register,
    // handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const updateTextDebounce = useMemo(
    () =>
      debounce((data) => {
        const { variables, formula } = data;
        const textProps = {
          variables: isObject(variables)
            ? (variables as LocaleTextVariables)
            : undefined,
          formula: formula,
        };
        runCommand("update_text", {
          ids: text.id,
          item: localeItem,
          items: localeItems,
          ...textProps,
        });
        dispatch(
          updateTextInLocaleSelection({
            ...text,
            ...textProps,
          })
        );
      }, 300),
    []
  );
  useEffect(() => {
    if (text.formula) setUseFormula(true);
    const watcher = watch((data) => {
      if (data) {
        updateTextDebounce(data);
      }
    });
    return () => {
      watcher.unsubscribe();
      updateTextDebounce.cancel();
    };
  }, [watch, text, localeItem]);

  const variableNames = getVariableNames(localeItem, text);
  const [iconGroupActivated, setIconGroupActivated] = useState(false);
  return (
    <div>
      <div
        className="text-left font-normal text-small flex w-full items-center"
        css={`
          & .actions {
            opacity: 0;
          }
          &:hover .actions {
            opacity: 1;
          }
        `}
      >
        <TextIcon
          className="text-secondary mr-8 flex-shrink-0 flex-grow-0"
          css={`
            width: 16px;
            height: 16px;
          `}
        />
        <div className="flex-grow-1 flex-shrink-1 font-medium truncate">
          {text.characters}
        </div>
      </div>
      <div className="pl-24 mt-8">
        {!useFormula && (
          <Toolbar>
            <KeyCombobox
              label={""}
              value={localeItem && localeItem.key ? localeItem.key : undefined}
              text={text}
            />
            <div
              className={`icon-group flex flex-grow-1 gap-12`}
              data-activated={iconGroupActivated ? "activated" : undefined}
            >
              {localeItem && !useFormula && (
                <>
                  <Tooltip content="Unset this key">
                    <IconButton
                      onClick={(e) => {
                        runCommand("update_text", {
                          ids: text.id,
                          key: "",
                        });
                        dispatch(
                          updateTextInLocaleSelection({ ...text, key: "" })
                        );
                      }}
                    >
                      <MinusCircledIcon />
                    </IconButton>
                  </Tooltip>
                  {!localeItem.fromLibrary && (
                    <EditDialog item={localeItem} text={text} />
                  )}
                </>
              )}
              <Tooltip content="Use formula">
                <IconButton
                  onClick={(e) => {
                    setUseFormula(true);
                    if (text && text.key) {
                      setValue("formula", `:${text.key}:`);
                    }
                  }}
                >
                  <FontFamilyIcon />
                </IconButton>
              </Tooltip>
              {localeItem && (
                <SwitchLanguageDropdownMenu
                  text={text}
                  item={localeItem}
                  onOpenChange={(open) => {
                    setIconGroupActivated(open);
                  }}
                />
              )}
            </div>
          </Toolbar>
        )}
        {useFormula && (
          <div>
            <Toolbar className="mb-4">
              <Switch
                label="Formula"
                checked={useFormula}
                onCheckedChange={(checked) => {
                  setUseFormula(checked);
                  runCommand("update_text", {
                    ids: text.id,
                    formula: "",
                  });
                  console.log({
                    ...text,
                    formula: "",
                  });
                  dispatch(
                    updateTextInLocaleSelection({
                      ...text,
                      formula: "",
                    })
                  );
                }}
              />
              <div
                className={`icon-group flex flex-grow-1 gap-12`}
                data-activated={iconGroupActivated ? "activated" : undefined}
              >
                <SwitchLanguageDropdownMenu
                  text={text}
                  items={localeItems}
                  onOpenChange={(open) => {
                    setIconGroupActivated(open);
                  }}
                />
              </div>
            </Toolbar>
            <Controller
              control={control}
              name="formula"
              defaultValue={text.formula || ""}
              render={({ field: { onChange, onBlur, value, name, ref } }) => {
                return (
                  <FormulaEditor
                    onBlur={onBlur} // notify when input is touched
                    onChange={onChange} // send value to hook form
                    value={value}
                    inputRef={ref}
                  />
                );
              }}
            ></Controller>
          </div>
        )}
        {!useFormula && (
          <div>
            {variableNames &&
              variableNames.map((name) => (
                <TextBox
                  className="mt-8"
                  label={
                    <>
                      <span>{name}</span> <Tag>VAR</Tag>
                    </>
                  }
                  defaultValue={text.variables ? get(text.variables, name) : ""}
                  {...register(`variables.${name}`)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default TextEditor;
