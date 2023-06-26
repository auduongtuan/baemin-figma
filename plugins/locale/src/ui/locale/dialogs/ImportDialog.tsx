import { pluralize } from "@capaj/pluralize";
import { Button, Checkbox, Collapsible, Dialog, Divider, Dropzone } from "ds";
import { groupBy, orderBy, unionWith } from "lodash-es";
import React, { useCallback, useEffect, useReducer } from "react";
import { LocaleItem, getStringContent } from "../../../lib";
import { flat } from "../../../lib/helpers";
import { useLanguages, useLocaleItems } from "../../hooks/locale";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  closeCurrentDialog,
  setCurrentDialog,
} from "../../state/localeAppSlice";
import { setLocaleData } from "../../state/localeSlice";
import { runCommand } from "../../uiHelper";
import {
  getDefaultLocalLibraryId,
  getLibraryOptions,
} from "../../state/helpers";
import { Select } from "ds";
interface ImportFile {
  name: string;
  items: Object;
}
const getInitialImportState = () => ({
  files: [],
  items: [],
  options: { override: false, libraryId: getDefaultLocalLibraryId() },
});
const importReducer = (
  state: {
    files: ImportFile[];
    items: LocaleItem[];
    options: { override: boolean; libraryId: string };
  },
  action: {
    type: "ADD_FILE" | "SET_ITEMS" | "CHANGE_OPTIONS" | "RESET";
    file?: ImportFile;
    items?: LocaleItem[];
    options?: { override?: boolean; libraryId?: string };
  }
) => {
  if (action.type == "ADD_FILE") {
    state = { ...state, files: [...state.files, action.file] };
  } else if (action.type == "SET_ITEMS") {
    state = { ...state, items: [...action.items] };
  } else if (action.type == "CHANGE_OPTIONS") {
    state = { ...state, options: { ...state.options, ...action.options } };
  } else if (action.type == "RESET") {
    state = { ...getInitialImportState() };
  }
  return state;
};

const ImportDialog = () => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const localeItems = useLocaleItems();
  const dispatch = useAppDispatch();
  const languages = useLanguages();

  const [importState, dispatchImportState] = useReducer(
    importReducer,
    getInitialImportState()
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
    dispatch(closeCurrentDialog());
    dispatchImportState({ type: "RESET" });
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
            fromLibrary: importState.options.libraryId,
            isLocal: true,
            imported: true,
          };
        }),
      });
    }
  }, [importState.files, importState.options]);
  return (
    <Dialog
      open={currentDialog.type == "IMPORT"}
      // open={true}
      onOpenChange={(open) => {
        if (!open) {
          dispatchImportState({ type: "RESET" });
          dispatch(closeCurrentDialog());
        }
      }}
    >
      <Dialog.Panel title="Import locale items">
        {importState.items && importState.items.length > 0 ? (
          <div>
            <h4 className="mt-0 mb-8 font-medium text-secondary">
              Import options
            </h4>

            <Select
              // inline
              // maxWidth={"120px"}
              label="Library"
              value={importState.options.libraryId}
              onChange={(value) => {
                dispatchImportState({
                  type: "CHANGE_OPTIONS",
                  options: { libraryId: value },
                });
              }}
              options={getLibraryOptions()}
            />
            <Checkbox
              checked={importState.options.override}
              onCheckedChange={(checked) =>
                dispatchImportState({
                  type: "CHANGE_OPTIONS",
                  options: { override: checked == true },
                })
              }
              label="Override local items if duplicated"
              className="mt-8"
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
                            <div className="flex flex-col gap-4 py-8 pl-16">
                              {languages.map(
                                (lang) =>
                                  lang in item && (
                                    <div className="truncate">
                                      {getStringContent(item[lang])}
                                    </div>
                                  )
                              )}
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
