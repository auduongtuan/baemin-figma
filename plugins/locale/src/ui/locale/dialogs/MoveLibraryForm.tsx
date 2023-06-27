import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  Dialog,
  RadioGroup,
  SectionTitle,
  Select,
  Button,
  ErrorMessage,
} from "ds";
import { useForm, Controller, useWatch } from "react-hook-form";
import { getLibraryOptions } from "../../state/helpers";
import { useDialog, useLocaleItems } from "@ui/hooks/locale";
import LocaleItemReview from "../items/LocaleItemReview";
import { runCommand } from "@ui/uiHelper";
import { moveLocaleItemsToLibrary } from "@ui/state/localeSlice";
import { pluralize } from "@capaj/pluralize";
import { cloneDeep } from "lodash-es";
const MoveLibraryForm = () => {
  const dispatch = useAppDispatch();
  const libraryOptions = getLibraryOptions();
  const selectedItems = useAppSelector(
    (state) => state.localeApp.list.selectedItems
  );
  const localeItems = useLocaleItems();
  const { control, getValues, handleSubmit } = useForm({
    defaultValues: {
      toLibrary: libraryOptions[0].value,
      duplication: "SKIP",
    },
  });
  const toLibrary = useWatch({ control, name: "toLibrary" });
  const itemsWillBeMoved = useMemo(
    () =>
      cloneDeep(
        selectedItems.filter(
          (selectedItem) => selectedItem.fromLibrary != toLibrary
        )
      ),
    [toLibrary]
  );
  const duplicatedItems = useMemo(
    () =>
      itemsWillBeMoved.filter((movedItem) =>
        localeItems.find(
          (item) => item.fromLibrary == toLibrary && item.key == movedItem.key
        )
      ),
    [itemsWillBeMoved]
  );
  const { closeDialog } = useDialog();
  const submit = useCallback(() => {
    const { toLibrary, duplication } = getValues();
    closeDialog();
    dispatch(
      moveLocaleItemsToLibrary({
        itemsToMove: itemsWillBeMoved,
        libraryId: toLibrary,
        skipDuplicated: duplication == "SKIP",
      })
    );
    runCommand("show_figma_notify", {
      message: "Items moved successfully",
    });
  }, [
    localeItems,
    selectedItems,
    toLibrary,
    duplicatedItems,
    itemsWillBeMoved,
  ]);
  return (
    <>
      <form className="flex flex-col gap-16" onSubmit={handleSubmit(submit)}>
        <section>
          <Controller
            name={`toLibrary`}
            control={control}
            render={({ field }) => (
              <Select
                label={`Move ${selectedItems.length} selected 
              ${pluralize("item", selectedItems.length)} to`}
                labelComponent={SectionTitle}
                value={field.value}
                onChange={field.onChange}
                options={libraryOptions}
              />
            )}
          />
        </section>
        {itemsWillBeMoved.length > 0 && (
          <section>
            <SectionTitle>
              {itemsWillBeMoved.length}{" "}
              {pluralize("item", itemsWillBeMoved.length)} will be moved
            </SectionTitle>
            <LocaleItemReview items={itemsWillBeMoved} />
          </section>
        )}
        {itemsWillBeMoved.length == 0 && (
          <ErrorMessage className="mt-0">
            Selected items are already in this library.
          </ErrorMessage>
        )}

        {duplicatedItems.length > 0 && (
          <section>
            <SectionTitle>
              {duplicatedItems.length > 0 &&
                `${duplicatedItems.length} ${pluralize(
                  "duplicated item",
                  duplicatedItems.length
                )} found`}
            </SectionTitle>
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
        )}
      </form>
      <Dialog.Footer>
        {itemsWillBeMoved.length > 0 ? (
          <Button onClick={handleSubmit(submit)}>Move</Button>
        ) : (
          <Button onClick={() => closeDialog()}>Close</Button>
        )}
      </Dialog.Footer>
    </>
  );
};
export default MoveLibraryForm;
