import { useState, useCallback, useRef, ElementRef } from "react";
import Tooltip, { TooltipProps } from "./Tooltip";
import { copyToClipboard } from "./helpers";
export function useCopyToClipboard(str: string) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    copyToClipboard(str);
    setCopied(true);
  }, [str]);
  return { copy, copied, setCopied };
}
export interface CopyTooltipProps extends Omit<TooltipProps, "content"> {
  stringToCopy: string;
  copyContent?: React.ReactNode;
  copiedContent?: React.ReactNode;
  render?: (props: ReturnType<typeof useCopyToClipboard>) => React.ReactNode;
}
const CopyTooltip = ({
  stringToCopy,
  copyContent,
  copiedContent,
  children,
  render,
  ...rest
}: CopyTooltipProps) => {
  const { copy, copied, setCopied } = useCopyToClipboard(stringToCopy);
  const triggerRef = useRef<ElementRef<"button">>(null);
  const props = {
    copy,
    copied,
    setCopied,
  };
  return (
    <Tooltip
      content={copied ? copiedContent || "Copied" : copyContent || "Copy"}
      triggerRef={triggerRef}
      triggerProps={{
        onClick: (e) => {
          e.preventDefault();
          copy();
        },
        onBlur: (e) => {
          e.preventDefault();
        },
        onMouseDown: (e) => {
          e.preventDefault();
        },
        onMouseLeave: (e) => {
          e.preventDefault();
          setCopied(false);
        },
      }}
      contentProps={{
        onPointerDownOutside: (e) => {
          if (
            e.target === triggerRef.current ||
            triggerRef.current.contains(e.target as Node)
          )
            e.preventDefault();
        },
      }}
      {...rest}
    >
      {render ? render(props) : children}
    </Tooltip>
  );
};
export default CopyTooltip;
