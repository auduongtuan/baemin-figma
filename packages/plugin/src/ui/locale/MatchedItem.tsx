import React, { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { updateMatchedItem } from "../state/localeSlice";
import { useForm } from "react-hook-form";
import { TextBox } from "../components/Field";
import { debounce } from "lodash";
import AddLocaleItem from "./AddLocaleItem";
import LocaleItemForm from "./LocaleItemForm";
const MatchedItem = () => {
  const matchedItem = useAppSelector((state) => state.locale.matchedItem);
  console.log('Matched item from MatchedItem', matchedItem);
  return (
    <div>
      {matchedItem && <LocaleItemForm item={matchedItem} />}
    </div>
  );
};

export default MatchedItem;
