import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import Tooltip from "../components/Tooltip";
import { updateLocaleItems } from "../state/localeSlice";
import { useForm } from "react-hook-form";
import { orderBy } from "lodash";
import { IconButton } from "../components/Button";
import { Crosshair2Icon, Pencil2Icon, PlusIcon } from "@radix-ui/react-icons";
import { runCommand } from "../uiHelper";
import { setEditDialogOpened, setNewDialogOpened } from "../state/localeAppSlice";
import Dialog from "../components/Dialog";
import LocaleItemForm from "./LocaleItemForm";
const LocaleItems = () => {
  const editDialogOpened = useAppSelector((state) => state.localeApp.editDialogOpened);
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

  return (
    <div className="p-16">
      <header className="flex">
        {localeItems && (
          <h4 className="mt-0 flex-grow-1">{localeItems.length} locale items</h4>
        )}
        <div>
          <Tooltip content="Add new item">
            <IconButton onClick={() => dispatch(setNewDialogOpened(true))}>
              <PlusIcon />
            </IconButton>
          </Tooltip>
        </div>
      </header>
      <div
        className="mt-8 flex flex-column"
        css={`
          gap: 0px;
        `}
      >
        {localeItems &&
          orderBy(localeItems, ["key"]).map((item) => 
            <div css={`
              border-bottom: 1px solid var(--figma-color-border);
              padding: 8px 0;
              &:last-child {
                border-bottom: 0;
                padding-bottom: 0;
              }
            `}>
           {/* <Accordion type="single" key={item.key + "_edit"} collapsible>
            <Accordion.Item
            title={ */}
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
                      <Dialog open={editDialogOpened == item.key} onOpenChange={open => {
                        if(open) {
                          dispatch(setEditDialogOpened(item.key));
                        } else {
                          dispatch(setEditDialogOpened(''));
                        }
                      }}>
                        <Tooltip content="Edit this key">
                          <Dialog.Trigger>
                            <IconButton>
                              <Pencil2Icon></Pencil2Icon>
                            </IconButton>
                          </Dialog.Trigger>
                        </Tooltip>
                        <Dialog.Content title="Edit locale item">
                          <LocaleItemForm item={item} showTitle={false} saveOnChange={false} />
                        </Dialog.Content>
                      </Dialog>
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
                {/* }
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
                */}
            {/* </Accordion.Item>
            </Accordion> */}
            </div>
          )}
      </div>
    </div>
  );
};

export default LocaleItems;
