import { Textarea, TextareaProps } from "ds";
import VariableMenu from "./VariableMenu";
import { forwardRef, useCallback, useState } from "react";
const LocaleItemTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps & {
    onVariableSelect?: (
      variableName: string,
      textareaEl: HTMLTextAreaElement
    ) => void;
  }
>(({ onVariableSelect, ...rest }, ref) => {
  const [textareaEl, setTextareaEl] = useState<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [variableMenuOpen, setVariableMenuOpen] = useState(false);
  const textareaRef = useCallback(
    (node: HTMLTextAreaElement) => {
      if (node !== null) {
        setTextareaEl(node);
      }
    },
    [setTextareaEl]
  );
  return (
    <div className="relative group">
      <Textarea
        {...rest}
        ref={(node) => {
          textareaRef(node);
          if (typeof ref == "function") ref(node);
        }}
        onFocus={() => setIsFocused(true)}
        afterTextarea={
          (variableMenuOpen || isFocused) && (
            <VariableMenu
              open={variableMenuOpen}
              onOpenChange={setVariableMenuOpen}
              onSelect={onVariableSelect}
              textareaEl={textareaEl}
            />
          )
        }
      />
    </div>
  );
});
export default LocaleItemTextarea;
