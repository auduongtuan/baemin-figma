import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import Tooltip from "../components/Tooltip";
import { updateLocaleItems } from "../state/localeSlice";
import { useForm } from "react-hook-form";
import { TextBox } from "../components/Field";
import { orderBy } from "lodash";
import { IconButton } from "../components/Button";
import Accordion from "../components/Accordion";
import { Crosshair2Icon, Pencil2Icon, TextIcon } from "@radix-ui/react-icons";
import { runCommand } from "../uiHelper";
import { findItemByKey } from "../../lib/localeData";
import LocaleItemForm from "./LocaleItemForm";
import Combobox from "../components/Combobox";
const MultipleTextEditor = () => {
  // const matchedItem = useAppSelector((state) => state.locale.matchedItem);
  const selectedText = useAppSelector((state) => state.locale.selectedText);
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

  return selectedText && selectedText.multiple ? (
    <div className="p-16">
      <h4 className="mt-0">{selectedText.texts.length} texts</h4>
      <div className="mt-16 flex flex-column gap-16">
        {selectedText.texts.map((text) => {
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
                  className="text-secondary mr-4 flex-shrink-0 flex-grow-0"
                  css={`
                    width: 12px;
                    height: 12px;
                  `}
                />
                <div className="flex-grow-1 flex-shrink-1 font-medium truncate">
                  {text.characters}
                </div>
              </div>
              <div className="pl-16 mt-4">
                <Combobox
                  label="Key"
                  value={text && "key" in text ? text.key : undefined}
                  placeholder="Select key"
                  menuWidth={"300px"}
                  options={
                    //   (selectedText && selectedText.key === MIXED_VALUE
                    //   ? [
                    //       {
                    //         id: "mixed",
                    //         value: MIXED_VALUE,
                    //         name: "Mixed",
                    //         disabled: true,
                    //       },
                    //     ]
                    //   : []
                    // ).concat(
                    localeItems.map((item) => {
                      return {
                        id: item.key,
                        value: item.key,
                        name: item.key,
                        disabled: false,
                        content: item.vi,
                        altContent: item.en,
                      };
                    })
                    // )
                  }
                  onChange={(value) => {
                    // console.log(value);
                    // dispatch(
                    //   updateSelectedText({
                    //     key: value
                    //   })
                    // );
                  }}
                  // disabled={
                  //   selectedText && selectedText.key != MIXED_VALUE ? false : true
                  // }
                  className="w-half"
                ></Combobox>
                {localeItem && <LocaleItemForm item={localeItem} />}
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
