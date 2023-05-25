import React from "react";
import { useAppSelector } from "../../hooks/redux";
import CurrentTextInfo from "../CurrentTextInfo";
import MultipleTextEditor from "../atoms/MultipleTextEditor";
import LocaleItemForm from "../form/LocaleItemForm";
import {
  LocaleTextProps,
  findItemByKey,
  getTextPropsByCharacters,
} from "../../../lib";
import { Divider, Button } from "ds";
import { updateText } from "../../state/helpers";
const SelectionEditor = () => {
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const matchedItem =
    localeSelection && localeSelection.summary
      ? findItemByKey(localeSelection.summary.key, localeItems)
      : null;

  const suggestedText =
    !matchedItem && localeSelection && localeSelection.texts.length == 1
      ? getTextPropsByCharacters(
          localeSelection.texts[0].characters,
          localeItems
        )
      : null;

  const assignKey = (key: string, otherProps: LocaleTextProps = {}) => {
    updateText(localeSelection.texts[0].id, {
      key,
      ...otherProps,
      item: findItemByKey(key, localeItems),
    });
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
          {suggestedText &&
            suggestedText.key &&
            localeSelection &&
            localeSelection.texts.length == 1 &&
            !localeSelection.texts[0].key &&
            !localeSelection.texts[0].formula && (
              <div className="">
                <p>
                  Assign key{" "}
                  <strong className="font-medium">{suggestedText.key}</strong>{" "}
                  to this text.
                </p>
                <Button
                  // variant="secondary"
                  className="mt-16"
                  onClick={() => assignKey(suggestedText.key, suggestedText)}
                >
                  Assign key
                </Button>
              </div>
            )}
          {!matchedItem &&
            !suggestedText &&
            localeSelection &&
            localeSelection.texts.length == 1 && (
              <LocaleItemForm
                showTitle
                onDone={(item) => assignKey(item.key)}
              />
            )}
        </div>
      </>
    )
  );
};

export default SelectionEditor;
