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
      d="M14.354 1.354a.5.5 0 0 0-.708-.708L12.293 2H2.5A2.5 2.5 0 0 0 0 4.5v5a2.5 2.5 0 0 0 2.3 2.492L.647 13.646a.5.5 0 0 0 .708.708L3.707 12h3.586l2.853 2.854A.5.5 0 0 0 11 14.5V12h1.5A2.5 2.5 0 0 0 15 9.5v-5a2.5 2.5 0 0 0-1.5-2.292l.854-.854ZM11.293 3H2.5A1.5 1.5 0 0 0 1 4.5v5A1.5 1.5 0 0 0 2.5 11h.793l8-8Zm-6.586 8 7.988-7.987A1.5 1.5 0 0 1 14 4.5v5a1.5 1.5 0 0 1-1.5 1.5h-2a.5.5 0 0 0-.5.5v1.793l-2.146-2.146A.5.5 0 0 0 7.5 11H4.707Z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
export default ForwardRef;
