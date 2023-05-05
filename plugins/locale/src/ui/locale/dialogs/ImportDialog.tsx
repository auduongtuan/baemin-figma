import React, { useCallback, useEffect, useReducer } from "react";
import { setCurrentDialog } from "../../state/localeAppSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Dialog, Dropzone, Button, Checkbox, Collapsible, Divider } from "ds";
import { flat } from "../../../lib/helpers";
import LocaleItemList from "../items/LocaleItemList";
import { groupBy, orderBy, unionWith } from "lodash";
import { LocaleItem } from "../../../lib";
import { setLocaleData } from "../../state/localeSlice";
import { runCommand } from "../../uiHelper";
import { pluralize } from "@capaj/pluralize";
interface ImportFile {
  name: string;
  items: Object;
}
const ImportDialog = () => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const dispatch = useAppDispatch();

  const [importState, dispatchImportState] = useReducer(
    (
      state: {
        files: ImportFile[];
        items: LocaleItem[];
        options: { override: boolean };
      },
      action: {
        type: "ADD_FILE" | "SET_ITEMS" | "CHANGE_OPTIONS";
        file?: ImportFile;
        items?: LocaleItem[];
        options?: { override: boolean };
      }
    ) => {
      if (action.type == "ADD_FILE") {
        state = { ...state, files: [...state.files, action.file] };
      } else if (action.type == "SET_ITEMS") {
        state = { ...state, items: [...action.items] };
      } else if (action.type == "CHANGE_OPTIONS") {
        state = { ...state, options: { ...state.options, ...action.options } };
      }
      return state;
    },
    { files: [], items: [], options: { override: false } }
  );

  const groupedLocaleItems = Object.entries(
    groupBy(orderBy(importState.items, ["key"]), (item) => {
      const parts = item.key.split(".");
      if (parts.length >= 2) return parts[0];
      return "";
    })
  ).sort((a, b) => a[0].localeCompare(b[0]));

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files

    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const content = reader.result as string;
        try {
          const langObject = JSON.parse(content);
          dispatchImportState({
            type: "ADD_FILE",
            file: {
              name: file.name,
              items: langObject,
            },
          });
        } catch (e) {
          console.log(e);
        }
      };
      reader.readAsText(file);
    });
  }, []);
  const importLocaleItemsHandler = useCallback(() => {
    const compareFn = (a: LocaleItem, b: LocaleItem) => a.key == b.key;
    let newLocaleItems: LocaleItem[];
    if (importState.options.override) {
      newLocaleItems = unionWith(importState.items, localeItems, compareFn);
    } else {
      newLocaleItems = unionWith(localeItems, importState.items, compareFn);
    }
    dispatch(
      setLocaleData({
        localeItems: newLocaleItems,
      })
    );
    dispatch(
      setCurrentDialog({
        opened: false,
      })
    );
    runCommand("show_figma_notify", {
      message: `${importState.items.length} ${pluralize(
        "item",
        importState.items.length
      )} imported`,
    });
  }, [importState]);
  useEffect(() => {
    let parsedLangItems = {};
    importState.files.forEach((fileObject) => {
      let parsedItems = {};
      const flattenItems = flat(fileObject.items);
      Object.keys(flattenItems).forEach((key) => {
        // const content = flattenItems[key].replaceAll(/\{\{\s*(length|quantity)\s*\}\}/g, '{{content}}');
        // parse key into plural group
        if (
          key.endsWith(".one") &&
          key.replace(/\.one$/, ".other") in flattenItems
        ) {
          const newKey = key.replace(/\.one$/, "");
          const newContent = {
            one: flattenItems[key],
            other: flattenItems[newKey + ".other"],
          };
          parsedItems[newKey] = newContent;
        } else if (
          key.endsWith(".other") &&
          key.replace(".other", ".one") in flattenItems
        ) {
          // newKey = key.replace(".other", "_other");
        } else {
          parsedItems[key] = flattenItems[key];
        }
      });
      parsedLangItems[fileObject.name.replace(".json", "")] = parsedItems;
    });
    const langs = Object.keys(parsedLangItems);
    if (langs.length > 0) {
      const keyList = Object.keys(parsedLangItems[langs[0]]);
      const currentTime = new Date().toJSON();
      dispatchImportState({
        type: "SET_ITEMS",
        items: keyList.map((key) => {
          const translations = langs.reduce((acc, lang) => {
            if (key in parsedLangItems[lang]) {
              acc[lang] = parsedLangItems[lang][key];
            }
            return acc;
          }, {});
          return {
            key: key,
            ...translations,
            createdAt: currentTime,
            imported: true,
          };
        }),
      });
    }
  }, [importState.files]);
  return (
    <Dialog
      open={currentDialog.type == "IMPORT" && currentDialog.opened}
      // open={true}
      onOpenChange={(open) =>
        dispatch(setCurrentDialog({ type: "IMPORT", opened: open }))
      }
    >
      <Dialog.Panel title="Import locale items">
        <Dialog.Content>
          {importState.items && importState.items.length > 0 ? (
            <div>
              <h4 className="mt-0 mb-8 font-medium text-secondary">
                Import options
              </h4>
              <Checkbox
                checked={importState.options.override}
                onCheckedChange={(checked) =>
                  dispatchImportState({
                    type: "CHANGE_OPTIONS",
                    options: { override: checked == true },
                  })
                }
                label="Override local items if duplicated"
              />
              <h4 className="mt-16 mb-8 font-medium text-secondary">
                Review items
              </h4>
              {groupedLocaleItems &&
                groupedLocaleItems.map(([name, items]) => (
                  <Collapsible defaultOpen={importState.items.length < 12}>
                    <Collapsible.Trigger>
                      {name || "Ungrouped"} ({items.length})
                    </Collapsible.Trigger>
                    <Collapsible.Content className="pl-16">
                      {items.map((item) => (
                        <>
                          <Collapsible defaultOpen={false}>
                            <Collapsible.Trigger>
                              <div className="truncate">{item.key}</div>
                            </Collapsible.Trigger>
                            <Collapsible.Content>
                              <div className="py-8 pl-16 flex flex-column gap-4">
                                <div className="truncate">{item.en}</div>
                                <div className="truncate">{item.vi}</div>
                              </div>
                            </Collapsible.Content>
                          </Collapsible>
                          <Divider />
                        </>
                      ))}
                    </Collapsible.Content>
                  </Collapsible>
                ))}
            </div>
          ) : (
            <Dropzone
              onDrop={onDrop}
              description="Drag and drop JSON language files here, or click to select files"
              accept={{
                "application/json": [".json"],
              }}
            />
          )}
        </Dialog.Content>
        {importState.items && importState.items.length > 0 && (
          <Dialog.Footer>
            <Button onClick={importLocaleItemsHandler}>Import</Button>
          </Dialog.Footer>
        )}
      </Dialog.Panel>
    </Dialog>
  );
};
export default ImportDialog;
