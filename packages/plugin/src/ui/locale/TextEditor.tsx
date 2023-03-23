import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import Tooltip from "../components/Tooltip";
import { useForm } from "react-hook-form";
import { TextBox } from "../components/Field";
import { IconButton } from "../components/Button";
import { Pencil2Icon, TextIcon } from "@radix-ui/react-icons";
import LocaleItemForm from "./LocaleItemForm";
import KeyCombobox from "./KeyCombobox";
import Dialog from "../components/Dialog";
import { setEditDialogOpened } from "../state/localeAppSlice";
import { Lang, LocaleText, getVariableNames } from "../../lib/localeData";
import { findItemByKey } from "../../lib/localeData";
import { get, isObject } from "lodash";
import { runCommand } from "../uiHelper";
const TextEditor = ({ text }: { text: LocaleText }) => {
  console.log(text);
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const localeItem =
    text && text.key ? findItemByKey(text.key, localeItems) : null;

  const editDialogOpened = useAppSelector(
    (state) => state.localeApp.editDialogOpened
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
        console.log(variables);
        if (isObject(variables)) {
          console.log(text.id, variables, localeItem);
          runCommand("update_text", {
            id: text.id,
            variables: variables,
            localeItem: localeItem,
          });
        }
      }

      // }
    });
    return () => {
      watcher.unsubscribe();
    };
  }, [watch, text, localeItem]);
  
  const variableNames = getVariableNames(localeItem, text);
  console.log(variableNames);
  return (
    <div>
      <div
        className="text-left font-normal text-small flex w-full align-items-center"
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
        <div className="flex align-items-center gap-8">
          <KeyCombobox
            label={""}
            value={localeItem && localeItem.key ? localeItem.key : undefined}
            text={text}
          />
          {localeItem && (
            <Dialog
              open={editDialogOpened && editDialogOpened === text.id}
              onOpenChange={(open) => {
                if (open) {
                  dispatch(setEditDialogOpened(text.id));
                } else {
                  dispatch(setEditDialogOpened(""));
                }
              }}
            >
              <Tooltip content="Edit this key">
                <Dialog.Trigger>
                  <IconButton>
                    <Pencil2Icon></Pencil2Icon>
                  </IconButton>
                </Dialog.Trigger>
              </Tooltip>
              <Dialog.Content title="Edit locale item">
                <LocaleItemForm
                  item={localeItem}
                  showTitle={false}
                  saveOnChange={false}
                />
              </Dialog.Content>
            </Dialog>
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
                    <span
                      className="text-xsmall"
                      css={`
                        color: var(--figma-color-bg-component);
                      `}
                    >
                      VAR
                    </span>
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
