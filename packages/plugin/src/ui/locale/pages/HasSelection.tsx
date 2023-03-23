import React from "react";
import { useAppSelector } from "../../hooks/redux";
import CurrentTextInfo from "../CurrentTextInfo";
import AddLocaleItemForm from "../AddLocaleItemForm";
import MultipleTextEditor from "../MultipleTextEditor";
import LocaleItemForm from "../LocaleItemForm";
import { findItemByKey } from "../../../lib/localeData";
import Divider from "../../components/Divider";
const HasSelection = () => {
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const matchedItem =
    localeSelection && localeSelection.summary
      ? findItemByKey(localeSelection.summary.key, localeItems)
      : null;
  return (
    localeSelection && (
      <>
        {/* <CurrentTextInfo /> */}
        <MultipleTextEditor />
        <Divider></Divider>
        <div className="p-16">
          {matchedItem ? (
            <LocaleItemForm item={matchedItem} />
          ) : (
            <>{localeSelection.texts.length == 1 && <AddLocaleItemForm />}</>
          )}
        </div>
      </>
    )
  );
};

export default HasSelection;
