import React from "react";
import { useAppSelector } from "../../hooks/redux";
import CurrentTextInfo from "../CurrentTextInfo";
import MultipleTextEditor from "../atoms/MultipleTextEditor";
import LocaleItemForm from "../form/LocaleItemForm";
import { findItemByKey, getTextByCharacter, getTextCharacters, LocaleItem, LocaleText } from "../../../lib/localeData";
import {Divider, Button} from "ds";
import { useAppDispatch } from "../../hooks/redux";
import { runCommand } from "../../uiHelper";
import { findItemByCharacters } from "../../../lib/localeData";
import { updateTextInLocaleSelection } from "../../state/localeSlice";
import { DEFAULT_LANG } from "../../../constant/locale";
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

  console.log({suggestedText});
  const assignKey = (textOrItem: LocaleText) => {
    runCommand("update_text", {
      ids: localeSelection.texts[0].id,
      ...textOrItem,
    });
    dispatch(
      updateTextInLocaleSelection({
        id: localeSelection.texts[0].id,
        ...textOrItem
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
          {matchedItem ? (
            <LocaleItemForm saveOnChange showTitle item={matchedItem} />
          ) : (
            <>
              {localeSelection.texts.length == 1 &&
                (suggestedText.key &&
                localeSelection &&
                !localeSelection.texts[0].key ? (
                  <div>
                    {suggestedText.key && (
                      <div className="">
                        <p>
                          Assign key{" "}
                          <strong className="font-medium">
                            {suggestedText.key}
                          </strong>{" "}
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
                  </div>
                ) : (
                  <LocaleItemForm showTitle onDone={(item) => assignKey({key: item.key, item})}/>
                ))}
            </>
          )}
        </div>
      </>
    )
  );
};

export default SelectionEditor;
