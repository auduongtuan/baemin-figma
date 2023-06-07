import { BaseInputStyle, Menu } from "ds";
import React, { useState } from "react";
import {
  Mention,
  MentionsInput,
  MentionsInputProps,
  SuggestionDataItem,
} from "react-mentions";
import styled from "styled-components";
import { getStringContent } from "../../../lib";
import { useAppSelector } from "../../hooks/redux";
import { useLocaleSelection, useLocaleItems } from "../../hooks/locale";
const mentionInputClassName = "mention-input";
const FormulaInputContainer = styled.div`
  .${mentionInputClassName}__input {
    ${BaseInputStyle};
  }
  .${mentionInputClassName}__control {
    min-height: 98px;
  }
  .${mentionInputClassName}__suggestions {
    margin-left: 10px;
    padding-top: 16px;
    background-color: transparent !important;
  }
`;
export interface FormulaEditorProps
  extends Omit<MentionsInputProps, "children" | "value" | "onChange"> {
  value?: string;
  onChange?: (e: React.FormEvent<HTMLTextAreaElement>) => void;
}
const FormulaEditor = ({ value, onChange, ...rest }: FormulaEditorProps) => {
  const localeItems = useLocaleItems();
  const queryItem = (query, callback) => {
    if (query.length === 0) return;

    const matches = localeItems
      .filter((item) => {
        return query ? item.key.indexOf(query.toLowerCase()) > -1 : true;
      })
      .slice(0, 10);
    return matches.map(({ key, vi }) => ({
      id: key,
      content: getStringContent(vi),
    }));
  };
  const [internalValue, setInternalValue] = useState("");
  const passedValue = value ? value : internalValue;
  const handleChange = (e) => {
    if (typeof value != "undefined" && onChange) {
      onChange(e);
    } else {
      setInternalValue(e.target.value);
    }
  };
  return (
    <FormulaInputContainer>
      <MentionsInput
        className={mentionInputClassName}
        value={passedValue}
        onChange={handleChange}
        placeholder={"Enter formula, press ':' to add keys"}
        customSuggestionsContainer={(children) => (
          <Menu className="max-w-[160px]">{children}</Menu>
        )}
        {...rest}
      >
        <Mention
          trigger=":"
          displayTransform={(id) => `:${id}:`}
          markup=":__id__:"
          data={queryItem}
          renderSuggestion={(
            entry: SuggestionDataItem & { content?: string },
            search,
            highlightedDisplay,
            index,
            focused
          ) => {
            return (
              <Menu.Item
                name={entry.id}
                content={entry?.content}
                highlighted={focused}
              />
            );
          }}
        />
      </MentionsInput>
    </FormulaInputContainer>
  );
};

export default FormulaEditor;
