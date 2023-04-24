import React from "react";
import { useAppSelector } from "../../hooks/redux";
import CurrentTextInfo from "../CurrentTextInfo";
import MultipleTextEditor from "../atoms/MultipleTextEditor";
import LocaleItemForm from "../form/LocaleItemForm";
import {
  findItemByKey,
  getTextByCharacter,
  LocaleTextProps,
} from "../../../lib/localeData";
import { Divider, Button } from "ds";
import { useAppDispatch } from "../../hooks/redux";
import { runCommand } from "../../uiHelper";
import { updateTextInLocaleSelection } from "../../state/localeSlice";
const SelectionEditor = () => {
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const matchedItem =
    localeSelection && localeSelection.summary
      ? findItemByKey(localeSelection.summary.key, localeItems)
      : null;
  const dispatch = useAppDispatch();

  const suggestedText =
    !matchedItem && localeSelection && localeSelection.texts.length == 1
      ? getTextByCharacter(localeSelection.texts[0].characters, localeItems)
      : null;

  const assignKey = (textOrItem: LocaleTextProps) => {
    runCommand("update_text", {
      ids: localeSelection.texts[0].id,
      ...textOrItem,
    });
    dispatch(
      updateTextInLocaleSelection({
        id: localeSelection.texts[0].id,
        ...textOrItem,
      })
    );
  };
  // return <div>Test</div>;
  return (
    localeSelection &&
    localeSelection.texts && (
      <>
        <CurrentTextInfo />
        <MultipleTextEditor />
        <Divider />
        <div className="p-16">
          {matchedItem && (
            <LocaleItemForm saveOnChange showTitle item={matchedItem} />
          )}
          {suggestedText && suggestedText.key &&
            localeSelection &&
            localeSelection.texts.length == 1 &&
            !localeSelection.texts[0].key && !localeSelection.texts[0].formula && (
              <div className="">
                <p>
                  Assign key{" "}
                  <strong className="font-medium">{suggestedText.key}</strong>{" "}
                  to this text.
                </p>
                <Button
                  // variant="secondary"
                  className="mt-16"
                  onClick={() => assignKey(suggestedText)}
                >
                  Assign key
                </Button>
              </div>
            )}
          {!matchedItem && !suggestedText && localeSelection && localeSelection.texts.length == 1 && (
            <LocaleItemForm
              showTitle
              onDone={(item) => assignKey({ key: item.key, item })}
            />
          )}
        </div>
      </>
    )
  );
};

export default SelectionEditor;
