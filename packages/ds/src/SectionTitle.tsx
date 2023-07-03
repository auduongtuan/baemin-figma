import React, { forwardRef } from "react";
import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
const SectionTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<"h4">
>(({ children, className, ...rest }, ref) => {
  return (
    <h4
      ref={ref}
      className={twMerge("mt-0 mb-0 font-medium text-secondary", className)}
      {...rest}
    >
      {children}
    </h4>
  );
});
export default SectionTitle;
