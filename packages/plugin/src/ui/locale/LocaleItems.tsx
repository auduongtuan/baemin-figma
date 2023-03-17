import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import Tooltip from "../components/Tooltip";
import {
  updateLocaleItems
} from "../state/localeSlice";
import { useForm } from "react-hook-form";
import { TextBox } from "../components/Field";
import { orderBy } from "lodash";
import { IconButton } from "../components/Button";
import Accordion from "../components/Accordion";
import { Crosshair2Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { runCommand } from "../uiHelper";
const LocaleItems = () => {
  const matchedItem = useAppSelector((state) => state.locale.matchedItem);
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

  return !selectedText ? (
    <div className="p-16">
      <h4 className="mt-0">{localeItems.length} items</h4>
      <div
        className="mt-8 flex flex-column"
        css={`
          gap: 4px;
        `}
      >
        {orderBy(localeItems, ["key"]).map((item) => (
          <Accordion type="single" key={item.key + "_edit"} collapsible>
            <Accordion.Item
              title={
                <div
                  className="text-left font-normal flex w-full"
                  css={`
                    font-size: var(--font-size-small);
                    & .actions {
                      opacity: 0;
                    }
                    &:hover .actions {
                      opacity: 1;
                    }
                  `}
                >
                  <div className="flex-grow-1 flex-shrink-0">{item.key}</div>
                  <div className="actions flex gap-8 flex-grow-0 flex-shrink-0">
                    <Tooltip content="Edit this key">
                      <IconButton
                      >
                        <Pencil2Icon></Pencil2Icon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Select texts with this key">
                    <IconButton
                      onClick={(e: React.MouseEvent<HTMLElement>) => {
                        runCommand("select_texts", { key: item.key });
                        e.stopPropagation();
                      }}
                    >
                      <Crosshair2Icon></Crosshair2Icon>
                    </IconButton>
                    </Tooltip>
                  </div>
                </div>
              }
            >
              <TextBox
                placeholder="English"
                className="mt-8"
                defaultValue={item.en}
                {...register(`${item.key}.en`)}
              />
              <TextBox
                placeholder="Vietnamese"
                className="mt-8 mb-8"
                defaultValue={item.vi}
                {...register(`${item.key}.vi`)}
              />
            </Accordion.Item>
          </Accordion>
        ))}
      </div>
    </div>
  ) : null;
};

export default LocaleItems;
