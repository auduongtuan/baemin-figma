import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import Tooltip from "../components/Tooltip";
import { updateLocaleItems } from "../state/localeSlice";
import { useForm } from "react-hook-form";
import { TextBox } from "../components/Field";
import { orderBy } from "lodash";
import { IconButton } from "../components/Button";
import Accordion from "../components/Accordion";
import { Crosshair2Icon, MagicWandIcon, Pencil2Icon, TextIcon } from "@radix-ui/react-icons";
import { runCommand } from "../uiHelper";
import { findItemByKey } from "../../lib/localeData";
import LocaleItemForm from "./LocaleItemForm";
import Combobox from "../components/Combobox";
import KeyCombobox from "./KeyCombobox";
import pluralize from "pluralize";
const MultipleTextEditor = () => {
  // const matchedItem = useAppSelector((state) => state.locale.matchedItem);
  const localeSelection = useAppSelector((state) => state.locale.localeSelection);
  const localeItems = useAppSelector((state) => state.locale.localeItems);

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
  // reset when key is change
  useEffect(() => {
    const watcher = watch((data) => {
      // if (matchedItem && data.key) {
      dispatch(
        updateLocaleItems(
          Object.keys(data).map((key) => {
            return { key: key, en: data[key].en, vi: data[key].vi };
          })
        )
      );

      // }
    });
    return () => {
      watcher.unsubscribe();
    };
  }, [watch]);

  return localeSelection && localeSelection.multiple && localeSelection.texts ? (
    <div className="p-16">
      <header className="flex align-items-center">
        <h4 className="mt-0 flex-grow-1">{localeSelection.texts.length} {pluralize('text', localeSelection.texts.length)} in selection</h4>
        <div className="flex-shrink-0">
          <Tooltip content="Auto assign key">
            <IconButton onClick={() => runCommand('auto_set_key', {
              localeItems
            })}><MagicWandIcon /></IconButton>
          </Tooltip>
        </div>
      </header>
      <div className="mt-16 flex flex-column gap-16">
        {localeSelection.texts.map((text) => {
          const localeItem = text.key
            ? findItemByKey(text.key, localeItems)
            : null;
          return (
            // <Accordion type="single" key={text.id + "_edit"} collapsible defaultChecked={true}>
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
                <KeyCombobox label={''} value={localeItem ? localeItem.key : undefined} text={text} />
                {/* {localeItem && <LocaleItemForm item={localeItem} showKey={false} />} */}
              </div>
            </div>
            // </Accordion>
          );
        })}
      </div>
    </div>
  ) : null;
};

export default MultipleTextEditor;
