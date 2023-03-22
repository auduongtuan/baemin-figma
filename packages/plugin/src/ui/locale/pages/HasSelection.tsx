import React from "react";
import { useAppSelector } from "../../hooks/redux";
import CurrentTextInfo from "../CurrentTextInfo";
import AddLocaleItemForm from "../AddLocaleItemForm";
import MultipleTextEditor from "../MultipleTextEditor";
import LocaleItemForm from "../LocaleItemForm";
import { findItemByKey } from "../../../lib/localeData";
const HasSelection = () => {
  const localeSelection = useAppSelector(
    (state) => state.locale.localeSelection
  );
  const localeItems = useAppSelector(state => state.locale.localeItems)
  const matchedItem = findItemByKey(localeSelection.key, localeItems);
  return localeSelection && <>
    <CurrentTextInfo />
    {localeSelection.multiple ?  <MultipleTextEditor /> : (
      <div className="p-16">
        {matchedItem ? (
          <LocaleItemForm item={matchedItem} />
        ) : (
          <AddLocaleItemForm />
        )}
      </div>
    )}
    </>
}

export default HasSelection;