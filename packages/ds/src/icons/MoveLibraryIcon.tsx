import * as React from "react";
import { SVGProps, Ref, forwardRef } from "react";
const MoveLibraryIcon = (
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
      d="M4.063 2c-.289 0-.561.11-.76.3A.97.97 0 0 0 3 3v7.054a2.017 2.017 0 0 1 1.063-.304H12V2H4.062Zm-.745 9.072c-.201.21-.318.498-.318.803V12c0 .258.107.51.304.7.198.19.47.3.759.3H12v-2.25H4.062c-.275 0-.543.114-.744.322ZM13 1.5v12a.5.5 0 0 1-.5.5H4.062c-.54 0-1.062-.206-1.45-.579A1.97 1.97 0 0 1 2 12V3c0-.537.222-1.048.611-1.421S3.521 1 4.062 1H12.5a.5.5 0 0 1 .5.5ZM8.29 3.438a.5.5 0 1 0-.78.624l.95 1.188H5.5a.5.5 0 0 0 0 1h2.96l-.95 1.188a.5.5 0 1 0 .78.624l1.6-2a.5.5 0 0 0 0-.624l-1.6-2Z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(MoveLibraryIcon);
export default ForwardRef;
