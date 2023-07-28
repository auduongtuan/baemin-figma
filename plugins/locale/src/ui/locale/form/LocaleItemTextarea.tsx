import { Textarea, TextareaProps } from "ds";
import VariableMenu from "./VariableMenu";
import { forwardRef, useCallback, useState } from "react";
const LocaleItemTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps & {
    onVariableSelect?: (variableName: string) => void;
  }
>(({ onVariableSelect, ...rest }, ref) => {
  const [textareaEl, setTextareaEl] = useState<HTMLTextAreaElement>(null);
  const textareaRef = useCallback(
    (node) => {
      if (node !== null) {
        setTextareaEl(node);
      }
    },
    [setTextareaEl]
  );
  console.log("textareaEl", textareaEl);
  return (
    <div className="relative">
      <Textarea
        {...rest}
        ref={(node) => {
          textareaRef(node);
          if (typeof ref == "function") ref(node);
        }}
      />
      <VariableMenu onSelect={onVariableSelect} textareaEl={textareaEl} />
    </div>
  );
});
export default LocaleItemTextarea;
