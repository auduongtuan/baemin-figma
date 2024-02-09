import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  Dialog,
  SectionTitle,
  Button,
  ErrorMessage,
  TextBox,
  Select,
} from "ds";
import { useForm, Controller, useWatch } from "react-hook-form";
import { getLibraryOptions } from "../../state/helpers";
import { useDialog, useLocaleItems } from "@ui/hooks/locale";
import LocaleItemReview from "../items/LocaleItemReview";
import { runCommand } from "@ui/uiHelper";
import { pluralize } from "@capaj/pluralize";
import { getGroupNameFromItems, getItemKeyInNewGroup } from "@lib";
import { moveLocaleItemsToGroup } from "@ui/state/localeSlice";

const MoveGroupForm = () => {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector(
    (state) => state.localeApp.list.selectedItems
  );
  const localeItems = useLocaleItems();
  const currentLibrary = useMemo(
    () => selectedItems[0]?.fromLibrary,
    [selectedItems]
  );
  const currentLibraryItems = localeItems.filter(
    (item) => item.fromLibrary == currentLibrary
  );
  const { control, getValues, register, setValue, handleSubmit } = useForm({
    defaultValues: {
      newGroupName: "",
      duplication: "SKIP",
      newGroupNameSelect: "__UNGROUPED",
    },
  });
  const hasSameLibrary = useMemo(
    () =>
      selectedItems.every(
        (selectedItem) => selectedItem.fromLibrary == currentLibrary
      ),
    [currentLibrary]
  );
  const newGroupName = useWatch({ control, name: "newGroupName" });
  const newGroupNameSelect = useWatch({ control, name: "newGroupNameSelect" });
  const groupNames = getGroupNameFromItems(currentLibraryItems);

  const duplicatedItems = useMemo(
    () =>
      currentLibraryItems.filter((currentItem) =>
        selectedItems.find(
          (item) =>
            currentItem.key == getItemKeyInNewGroup(item.key, newGroupName)
        )
      ),
    [newGroupName, selectedItems]
  );
  const itemsWillBeModified = useMemo(
    () =>
      selectedItems.filter(
        (selectedItem) =>
          !duplicatedItems.map((item) => item.key).includes(selectedItem.key)
      ),
    [selectedItems, duplicatedItems]
  );
  const modifiedItems = useMemo(
    () =>
      itemsWillBeModified.map((item) => ({
        ...item,
        key: getItemKeyInNewGroup(item.key, newGroupName),
      })),
    [newGroupName, itemsWillBeModified]
  );
  const { closeDialog } = useDialog();
  const submit = useCallback(() => {
    const { newGroupName, duplication } = getValues();
    console.log(newGroupName);
    closeDialog();
    dispatch(
      moveLocaleItemsToGroup({
        items: itemsWillBeModified,
        groupName: newGroupName,
        // skipDuplicated: duplication == "SKIP",
      })
    );
    runCommand("show_figma_notify", {
      message: "Items moved successfully",
    });
  }, [localeItems, selectedItems, duplicatedItems]);
  const groupNameOptions = [
    {
      value: "__CUSTOM",
      name: "Use a custom name",
    },
    ...groupNames.map((g) => ({
      value: g === "" ? "__UNGROUPED" : g,
      name: g === "" ? "Ungrouped" : g,
    })),
  ];

  return (
    <>
      <form className="flex flex-col gap-16" onSubmit={handleSubmit(submit)}>
        {!hasSameLibrary && (
          <ErrorMessage className="mt-0">
            Cannot move because current selected items are not from a same
            library.
          </ErrorMessage>
        )}
        {hasSameLibrary && (
          <>
            <section>
              <Select
                label="Select new group name"
                value={newGroupNameSelect}
                onChange={(value) => {
                  setValue("newGroupNameSelect", value);
                  if (value == "__UNGROUPED") {
                    setValue("newGroupName", "");
                  } else if (value !== "__CUSTOM") {
                    setValue("newGroupName", value);
                  }
                  // console.log(value);
                }}
                options={groupNameOptions}
              ></Select>

              {newGroupNameSelect == "__CUSTOM" ? (
                <Controller
                  name={`newGroupName`}
                  control={control}
                  render={({ field }) => (
                    <TextBox
                      //   label={`Move ${selectedItems.length} selected
                      // ${pluralize("item", selectedItems.length)} to`}
                      label="Enter a new group name"
                      helpText={`Use "." for nested groupping, e.g: feature_a.message`}
                      placeholder=""
                      // labelComponent={SectionTitle}
                      value={field.value}
                      onChange={field.onChange}
                      className="mt-8"
                      // options={libraryOptions}
                    />
                  )}
                />
              ) : null}
            </section>
            {itemsWillBeModified.length > 0 && (
              <section>
                <SectionTitle>
                  {itemsWillBeModified.length}{" "}
                  {pluralize("item", itemsWillBeModified.length)} will be
                  modified
                </SectionTitle>
                <LocaleItemReview items={itemsWillBeModified} />
              </section>
            )}

            {duplicatedItems.length > 0 && (
              <ErrorMessage className="mt-0">
                {duplicatedItems.length > 0 &&
                  `${duplicatedItems.length} ${pluralize(
                    "item",
                    duplicatedItems.length
                  )} already in this group will not be modified`}
              </ErrorMessage>
            )}
            {modifiedItems.length > 0 && (
              <section>
                <SectionTitle>
                  {pluralize("This", modifiedItems.length)}{" "}
                  {pluralize("item", modifiedItems.length)} after modification
                </SectionTitle>
                <LocaleItemReview items={modifiedItems} />
              </section>
            )}
          </>
        )}
      </form>
      <Dialog.Footer>
        {hasSameLibrary && itemsWillBeModified.length > 0 ? (
          <Button onClick={handleSubmit(submit)}>Move</Button>
        ) : (
          <Button onClick={() => closeDialog()}>Close</Button>
        )}
      </Dialog.Footer>
    </>
  );
};
export default MoveGroupForm;
