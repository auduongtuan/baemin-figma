import React from "react";
import { setCurrentDialog } from "../../state/localeAppSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Checkbox, Dialog, RadioGroup, SectionTitle, Select, Button } from "ds";
import { useForm, Controller } from "react-hook-form";
import { getLibraryOptions } from "../../state/helpers";
import { useLocaleItems } from "@ui/hooks/locale";
import LocaleItemReview from "../items/LocaleItemReview";
import { unionWith } from "lodash-es";
const MoveLibraryDialog = () => {
  const currentDialog = useAppSelector(
    (state) => state.localeApp.currentDialog
  );
  const dispatch = useAppDispatch();
  console.log("aaaaaaa");
  const libraryOptions = getLibraryOptions();
  const { control, setValue, getValues, handleSubmit } = useForm({
    defaultValues: {
      toLibrary: libraryOptions[0].value,
      duplication: "CANCEL",
    },
  });
  const selectedItems = useLocaleItems().filter((item) => item.isLocal);
  const localeItems = useLocaleItems();

  const submit = () => {
    const { toLibrary, duplication } = getValues();
    const libraryItems = localeItems.filter(
      (item) => item.fromLibrary == toLibrary
    );
    console.log(libraryItems);
    const duplicatedItems = selectedItems.filter((selectedItem) =>
      libraryItems.find((libraryItem) => libraryItem.key == selectedItem.key)
    );
    if (duplicatedItems.length > 0 && duplication == "CANCEL") {
      return;
    }
    if (duplicatedItems.length > 0 && duplication == "OVERWRITE") {
      // const mergedItems = unionWith()
    }
    if (duplicatedItems.length > 0 && duplication == "SKIP") {
    }
  };
  return (
    <Dialog
      // open={currentDialog.type == "MOVE_LIBRARY" && currentDialog.opened}
      open
      onOpenChange={(open) =>
        dispatch(setCurrentDialog({ type: "MOVE_LIBRARY", opened: open }))
      }
    >
      <Dialog.Panel title="Move items to other library">
        <Dialog.Content>
          <form
            className="flex flex-col gap-16"
            onSubmit={handleSubmit(submit)}
          >
            <section>
              <SectionTitle>Items will be moved</SectionTitle>
              <LocaleItemReview items={selectedItems} />
            </section>
            <section>
              <Controller
                name={`toLibrary`}
                control={control}
                render={({ field }) => (
                  <Select
                    label="Move to"
                    labelComponent={SectionTitle}
                    value={field.value}
                    onChange={field.onChange}
                    options={libraryOptions}
                  />
                )}
              />
            </section>
            <section>
              <SectionTitle>When key duplication occurs</SectionTitle>
              <Controller
                name={`duplication`}
                control={control}
                render={({ field, formState }) => (
                  <>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      className="mt-8"
                      options={[
                        {
                          label: "Cancel moving process",
                          value: "CANCEL",
                        },
                        {
                          label: "Skip moving duplicated items",
                          value: "SKIP",
                        },
                        {
                          label: "Overwrite current items by new moved items",
                          value: "OVERWRITE",
                        },
                      ]}
                    ></RadioGroup>
                  </>
                )}
              />
            </section>
          </form>
        </Dialog.Content>
      </Dialog.Panel>
      <Dialog.Footer>
        <Button onClick={handleSubmit(submit)}>Move</Button>
      </Dialog.Footer>
    </Dialog>
  );
};
export default MoveLibraryDialog;
