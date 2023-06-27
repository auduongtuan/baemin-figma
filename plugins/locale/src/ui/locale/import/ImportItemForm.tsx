import { pluralize } from "@capaj/pluralize";
import { Button, Checkbox, Dialog, Dropzone } from "ds";
import { useCallback, useEffect, useReducer } from "react";
import { useDialog, useLocaleItems } from "../../hooks/locale";
import { useAppDispatch } from "../../hooks/redux";
import { addLocaleItems } from "../../state/localeSlice";
import { runCommand } from "../../uiHelper";
import { getLibraryOptions } from "../../state/helpers";
import { Select } from "ds";
import LocaleItemReview from "../items/LocaleItemReview";
import parseItemsFromFile from "./parseItemsFromFile";
import { importReducer, getInitialImportState } from "./importState";

const ImportItemForm = () => {
  const dispatch = useAppDispatch();

  const [importState, dispatchImportState] = useReducer(
    importReducer,
    getInitialImportState()
  );

  const { context, closeDialog } = useDialog();

  useEffect(() => {
    context.setContextValue({
      afterClose: () => {
        dispatchImportState({ type: "RESET" });
      },
    });
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
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
    dispatch(
      addLocaleItems({
        itemsToAdd: importState.items,
        skipDuplicated: !importState.options.override,
      })
    );
    closeDialog();
    runCommand("show_figma_notify", {
      message: `${importState.items.length} ${pluralize(
        "item",
        importState.items.length
      )} imported`,
    });
  }, [importState]);
  useEffect(() => {
    dispatchImportState({
      type: "SET_ITEMS",
      items: parseItemsFromFile(
        importState.files,
        importState.options.libraryId
      ),
    });
  }, [importState.files, importState.options]);
  return (
    <>
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
          <LocaleItemReview items={importState.items} />
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
    </>
  );
};

export default ImportItemForm;
