import React, {forwardRef} from "react";
const Tag = forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(({children,...rest}, forwardedRef) => {
  return (
    <span
      ref={forwardedRef}
      css={`
        color: var(--figma-color-bg-component);
        font-size: 7.5px;
        border: 1px solid var(--figma-color-bg-component);
        padding: 1px 2px;
        border-radius: 2px;
      `}
      {...rest}
    >
      {children}
    </span>
  );
});
export default Tag;