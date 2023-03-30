import React from "react";
import { useAppSelector } from "../hooks/redux";
import LocaleItemForm from "./form/LocaleItemForm";
import { findItemByKey } from "../../lib/localeData";
const MatchedItem = () => {
  const localeSelection = useAppSelector((state) => state.locale.localeSelection);
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const matchedItem = findItemByKey(localeSelection.texts[0].key, localeItems);
  console.log('Matched item from MatchedItem', matchedItem);
  return (
    <div>
      {matchedItem && <LocaleItemForm item={matchedItem} />}
    </div>
  );
};

export default MatchedItem;
