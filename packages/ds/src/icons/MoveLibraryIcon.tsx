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
      d="M4.063 1.5c-.276 0-.544.114-.745.323-.201.21-.318.497-.318.802v7.929a2.017 2.017 0 0 1 1.063-.304H12V1.5H4.062Zm-.745 11.678A1.159 1.159 0 0 1 3 12.374c0-.305.117-.593.318-.803.201-.208.47-.322.744-.322H12v2.25H4.062c-.275 0-.543-.114-.744-.322ZM13 1v13a.5.5 0 0 1-.5.5H4.062c-.553 0-1.08-.229-1.465-.63A2.159 2.159 0 0 1 2 12.376v-9.75c0-.557.213-1.096.597-1.496C2.982.73 3.51.5 4.063.5H12.5a.5.5 0 0 1 .5.5ZM8.29 3.688a.5.5 0 1 0-.78.624L8.46 5.5H5.5a.5.5 0 0 0 0 1h2.96l-.95 1.188a.5.5 0 1 0 .78.624l1.6-2a.5.5 0 0 0 0-.624l-1.6-2Z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(MoveLibraryIcon);
export default ForwardRef;
