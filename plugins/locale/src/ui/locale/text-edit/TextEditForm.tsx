import {
  FontFamilyIcon,
  MinusCircledIcon,
  PlusCircledIcon,
  TextIcon,
} from "@radix-ui/react-icons";
import { IconButton, Switch, Tag, Textarea, Tooltip } from "ds";
import { debounce, get, isObject } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Lang,
  LocaleItem,
  LocaleText,
  LocaleTextVariables,
} from "../../../lib";
import { findItemByKey } from "../../../lib/localeItem";
import { getVariableNames } from "../../../lib/localeText";
import { useLocaleItems } from "../../hooks/locale";
import { useAppDispatch } from "../../hooks/redux";
import { updateText } from "../../state/helpers";
import { setCurrentDialog } from "../../state/localeAppSlice";
import { EditDialogTrigger } from "../dialogs/EditDialog";
import FormulaEditor from "../atoms/FormulaEditor";
import KeyCombobox from "../atoms/KeyCombobox";
import SwitchLanguageDropdownMenu from "../atoms/SwitchLanguageDropdownMenu";
import TextEditToolbar, { TextEditIconGroup } from "./TextEditToolbar";
const TextEditForm = ({ text }: { text: LocaleText }) => {
  const localeItems = useLocaleItems();
  const localeItem =
    text && text.key ? findItemByKey(text.key, localeItems) : null;
  const [useFormula, setUseFormula] = useState(false);
  const dispatch = useAppDispatch();
  const {
    register,
    // handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm();
  const updateTextDebounce = useMemo(
    () =>
      debounce((data) => {
        const { variables, formula } = data;
        const textProps = {
          variables: isObject(variables)
            ? { ...(variables as LocaleTextVariables) }
            : undefined,
          formula: formula,
        };
        updateText(text.id, {
          lang: text.lang as Lang,
          ...textProps,
        });
      }, 200),
    [localeItems, text]
  );
  useEffect(() => {
    if (text.formula) {
      setUseFormula(true);
      setValue("formula", text.formula);
    } else {
      setUseFormula(false);
      setValue("formula", "");
    }
    const watcher = watch((data) => {
      if (data) {
        updateTextDebounce(data);
      }
    });
    return () => {
      watcher.unsubscribe();
      updateTextDebounce.cancel();
    };
  }, [watch, text, localeItem, localeItems]);

  const variableNames = useMemo(
    () =>
      getVariableNames(
        {
          ...text,
          item: localeItem,
        },
        localeItems
      ),
    [text, localeItem, localeItems]
  );
  const [iconGroupActivated, setIconGroupActivated] = useState(false);
  return (
    <div>
      <div className="flex items-center w-full font-normal text-left text-small group">
        <TextIcon className="w-16 h-16 mr-8 text-secondary shrink-0 grow-0" />
        <div className="font-medium truncate grow shrink">
          {text.characters}
        </div>
      </div>
      <div className="pl-24 mt-8">
        {!useFormula && (
          <TextEditToolbar>
            <KeyCombobox
              label={""}
              value={localeItem && localeItem.key ? localeItem.key : undefined}
              text={text}
            />
            <TextEditIconGroup
              data-activated={iconGroupActivated ? "activated" : undefined}
            >
              {localeItem && !useFormula && (
                <>
                  <Tooltip content="Unset this key">
                    <IconButton
                      onClick={(e) => {
                        updateText(text.id, {
                          key: "",
                        });
                      }}
                    >
                      <MinusCircledIcon />
                    </IconButton>
                  </Tooltip>
                  {!localeItem.fromLibrary && (
                    <EditDialogTrigger item={localeItem} />
                  )}
                </>
              )}
              {!localeItem && (
                <Tooltip content="Add new item">
                  <IconButton
                    onClick={(e) => {
                      dispatch(
                        setCurrentDialog({
                          type: "NEW",
                          onDone: (localeItem: LocaleItem) => {
                            updateText(text.id, {
                              key: localeItem.key,
                              item: localeItem,
                            });
                            // onChangeHandler(localeItem.key);
                          },
                        })
                      );
                    }}
                  >
                    <PlusCircledIcon />
                  </IconButton>
                </Tooltip>
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
                  onOpenChange={(open) => {
                    setIconGroupActivated(open);
                  }}
                />
              )}
            </TextEditIconGroup>
          </TextEditToolbar>
        )}
        {useFormula && (
          <div>
            <TextEditToolbar className="mb-4">
              <Switch
                label="Formula"
                checked={useFormula}
                onCheckedChange={(checked) => {
                  setUseFormula(checked);
                  updateText(text.id, {
                    formula: "",
                  });
                }}
              />
              <TextEditIconGroup
                data-activated={iconGroupActivated ? "activated" : undefined}
              >
                <SwitchLanguageDropdownMenu
                  text={text}
                  onOpenChange={(open) => {
                    setIconGroupActivated(open);
                  }}
                />
              </TextEditIconGroup>
            </TextEditToolbar>
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
        {variableNames && (
          <div>
            {variableNames.map((variableName) => {
              // use count for formattedCount
              const name = (() => {
                if (variableName == "formattedCount") return "count";
                if (variableName == "formattedNumber") return "number";
                return variableName;
              })();
              const value = get(text.variables, name);
              return (
                <Controller
                  control={control}
                  name={`variables.${name}`}
                  defaultValue={value}
                  render={({ field: { onChange, onBlur, value, ref } }) => {
                    return (
                      <Textarea
                        className="mt-8"
                        maxRows={6}
                        label={
                          <>
                            <span>{name}</span> <Tag>VAR</Tag>
                          </>
                        }
                        onBlur={onBlur} // notify when input is touched
                        onChange={onChange} // send value to hook form
                        value={value}
                        ref={ref}
                      />
                    );
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default TextEditForm;
