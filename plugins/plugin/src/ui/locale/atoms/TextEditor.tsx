import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useForm } from "react-hook-form";
import { DropdownMenu, Dialog, IconButton, Tooltip, TextBox } from "ds";
import { MinusCircledIcon, Pencil2Icon, TextIcon } from "@radix-ui/react-icons";
import LocaleItemForm from "../form/LocaleItemForm";
import KeyCombobox from "./KeyCombobox";
import { setCurrentDialog } from "../../state/localeAppSlice";
import { Lang, LocaleText, LocaleTextVariables, getVariableNames } from "../../../lib/localeData";
import { findItemByKey } from "../../../lib/localeData";
import { get, isObject } from "lodash";
import { runCommand } from "../../uiHelper";
import { updateTextInLocaleSelection } from "../../state/localeSlice";
import { GlobeIcon } from "@radix-ui/react-icons";
import { LANGUAGES } from "../../../constant/locale";
import {Tag} from 'ds';
const TextEditor = ({ text }: { text: LocaleText }) => {
  console.log(text);
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const localeItem =
    text && text.key ? findItemByKey(text.key, localeItems) : null;

  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
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
  console.log(localeItem);

  useEffect(() => {
    const watcher = watch((data) => {
      // if (matchedItem && data.key) {
      // dispatch(
      //   updateLocaleItems(
      //     Object.keys(data).map((key) => {
      //       return { key: key, en: data[key].en, vi: data[key].vi };
      //     })
      //   )
      // );
      const { variables } = data;
      if (variables) {
        if (isObject(variables)) {
          runCommand("update_text", {
            ids: text.id,
            variables: variables as LocaleTextVariables,
            item: localeItem,
          });
          dispatch(updateTextInLocaleSelection(text));
        }
      }

      // }
    });
    return () => {
      watcher.unsubscribe();
    };
  }, [watch, text, localeItem]);

  const variableNames = getVariableNames(localeItem, text);
  const [iconGroupActivated, setIconGroupActivated] = useState(false);
  console.log(variableNames);
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
        <div
          className="flex items-center gap-8"
          css={`
            & > .icon-group {
              transition: opacity 0.1s;
            }
            & > .icon-group:not([data-activated]) {
              opacity: 0;
            }
            &:hover > .icon-group, & > .icon-group[date-activated] {
              opacity: 1;
            }
          `}
        >
          <KeyCombobox
            label={""}
            value={localeItem && localeItem.key ? localeItem.key : undefined}
            text={text}
          />
          {localeItem && (
            <div className={`icon-group flex flex-grow-1 gap-12`} data-activated={iconGroupActivated ? "activated" : undefined}>
              <Tooltip content="Unset this key">
                <IconButton onClick={(e) => {

                  runCommand("update_text", {
                    ids: text.id,
                    key: ''
                  });
                  dispatch(updateTextInLocaleSelection({...text, key: ''}));
                }}>
                  <MinusCircledIcon />
                </IconButton>
              </Tooltip>
              {!localeItem.fromLibrary &&
              <Dialog
                open={currentDialog.type == 'EDIT' && currentDialog.opened && currentDialog.key === text.id}
                onOpenChange={(open) => {
                  if (open) {
                    dispatch(setCurrentDialog({opened: true, type: 'EDIT', key: text.id}));
                  } else {
                    dispatch(setCurrentDialog({opened: false, type: 'EDIT', key: text.id}));
                  }
                }}
              >
                <Tooltip content="Edit locale item">
                  <Dialog.Trigger asChild>
                    <IconButton>
                      <Pencil2Icon></Pencil2Icon>
                    </IconButton>
                  </Dialog.Trigger>
                </Tooltip>
                <Dialog.Panel title="Edit locale item">
                  <Dialog.Content>
                  <LocaleItemForm
                    item={localeItem}
                    showTitle={false}
                    saveOnChange={false}
                  />
                  </Dialog.Content>
                </Dialog.Panel>
              </Dialog>}
              <DropdownMenu onOpenChange={(open) => {
                setIconGroupActivated(open);
              }}>
                <Tooltip content="Switch language">
                  <DropdownMenu.Trigger asChild>
                    <IconButton>
                      <GlobeIcon></GlobeIcon>
                    </IconButton>
                  </DropdownMenu.Trigger>
                </Tooltip>
                <DropdownMenu.Content>
                  {Object.keys(LANGUAGES).map((lang) => {
                    return (
                      <DropdownMenu.Item
                        onSelect={() => {
                          runCommand("update_text", {
                            ids: text.id,
                            lang: lang as Lang,
                            item: localeItem,
                          });
                          dispatch(updateTextInLocaleSelection({id: text.id, lang: lang}));
                        }}
                      >
                        {LANGUAGES[lang]}
                      </DropdownMenu.Item>
                    );
                  })}
                </DropdownMenu.Content>
              </DropdownMenu>
            </div>
          )}
        </div>
        <div>
          {variableNames &&
            variableNames.map((name) => (
              <TextBox
                className="mt-8"
                label={
                  <>
                    <span>{name}</span>{" "}
                    <Tag>VAR</Tag>
                  </>
                }
                defaultValue={text.variables ? get(text.variables, name) : ""}
                {...register(`variables.${name}`)}
              />
            ))}
        </div>
        {/* {localeItem && <LocaleItemForm item={localeItem} showKey={false} />} */}
      </div>
    </div>
  );
};
export default TextEditor;
