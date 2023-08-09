import React from "react";
import { twMerge } from "tailwind-merge";
const Divider = ({ className }: { className?: string }) => {
  return (
    <hr
      className={twMerge("border-top border-solid border-[#eee]", className)}
    ></hr>
  );
};
export default Divider;
