import React from "react";
import { useAppSelector } from "../hooks/redux";
import LocaleItemForm from "./LocaleItemForm";
import { findItemByKey } from "../../lib/localeData";
const MatchedItem = () => {
  const localeSelection = useAppSelector((state) => state.locale.localeSelection);
  const localeItems = useAppSelector((state) => state.locale.localeItems);
  const matchedItem = findItemByKey(localeSelection.key, localeItems);
  console.log('Matched item from MatchedItem', matchedItem);
  return (
    <div>
      {matchedItem && <LocaleItemForm item={matchedItem} />}
    </div>
  );
};

export default MatchedItem;
