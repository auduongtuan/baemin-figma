import { useMemo } from "react";
import { Dialog, IconButton, Tooltip } from "ds";
import { EyeOpenIcon, Pencil2Icon } from "@radix-ui/react-icons";
import LocaleItemForm from "../form/LocaleItemForm";
import {
  LANGUAGE_LIST,
  LocaleItem,
  findItemById,
  isPlurals,
} from "../../../lib";
import EditInfo from "../atoms/EditInfo";
import { useDialog, useLanguages, useLocaleItems } from "../../hooks/locale";
import { Description } from "ds";
const ViewDialog = () => {
  const { dialogProps, state } = useDialog((state) => state.type == "VIEW");
  const items = useLocaleItems();
  const languages = useLanguages();
  const item = useMemo(
    () =>
      state && state.key && state.key != "__SELECTED_ITEMS"
        ? findItemById(state.key, items)
        : undefined,
    [state, state.key]
  );
  return (
    <Dialog {...dialogProps}>
      <Dialog.Panel
        title={"View item"}
        buttons={<EditInfo localeItem={item} />}
      >
        {item ? (
          <>
            <h2 className="font-medium text-large grow">Key</h2>
            <div className="mt-12">{item.key}</div>
            <h2 className="mt-24 font-medium text-large grow">Translation</h2>
            <div className="flex flex-col gap-16 mt-12">
              {languages.map((language) => {
                const content = item[language];
                return (
                  <Description label={LANGUAGE_LIST[language]}>
                    {isPlurals(content) ? (
                      <div className="">
                        <Description label="One" horizontal>
                          {content.one}
                        </Description>
                        <Description label="Other" horizontal>
                          {content.other}
                        </Description>
                      </div>
                    ) : (
                      <div className="">
                        <Description>{content}</Description>
                      </div>
                    )}
                  </Description>
                );
              })}
            </div>
          </>
        ) : null}
      </Dialog.Panel>
    </Dialog>
  );
};
export const ViewDialogTrigger = ({ item }: { item: LocaleItem }) => {
  const { openDialog } = useDialog();
  return (
    <Tooltip content="View item">
      <IconButton
        onClick={() =>
          openDialog({
            type: "VIEW",
            key: [item.fromLibrary, item.key],
          })
        }
      >
        <EyeOpenIcon />
      </IconButton>
    </Tooltip>
  );
};
export default ViewDialog;
