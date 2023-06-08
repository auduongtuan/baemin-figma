import * as React from "react";
import { SVGProps, Ref, forwardRef } from "react";
const SvgComponent = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="none"
    ref={ref}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M3.318 1.823c.201-.21.47-.323.744-.323H12v8.75H4.062c-.379 0-.745.107-1.062.304V2.625c0-.305.117-.593.318-.802ZM3 12.375c0 .305.117.593.318.803.201.208.47.322.744.322H12v-2.25H4.062c-.275 0-.543.114-.744.322-.201.21-.318.498-.318.803Zm10-1.625V1a.5.5 0 0 0-.5-.5H4.062c-.553 0-1.08.229-1.465.63-.384.4-.597.938-.597 1.495v9.75c0 .557.213 1.096.597 1.496.385.4.912.629 1.466.629H12.5a.5.5 0 0 0 .5-.5v-3.25Z"
      clipRule="evenodd"
    />
  </svg>
);
const LibraryIcon = forwardRef(SvgComponent);
export default LibraryIcon;
