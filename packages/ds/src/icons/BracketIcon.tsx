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
      d="M5.5 2.5A.5.5 0 0 0 5 2H3.714a1.5 1.5 0 0 0-1.5 1.5v2.286C2.214 6.456 1.671 7 1 7a.5.5 0 0 0 0 1c.67 0 1.214.544 1.214 1.214V11.5a1.5 1.5 0 0 0 1.5 1.5H5a.5.5 0 0 0 0-1H3.714a.5.5 0 0 1-.5-.5V9.214A2.21 2.21 0 0 0 2.402 7.5a2.21 2.21 0 0 0 .812-1.714V3.5a.5.5 0 0 1 .5-.5H5a.5.5 0 0 0 .5-.5ZM10 2a.5.5 0 0 0 0 1h1.286a.5.5 0 0 1 .5.5v2.286c0 .69.316 1.308.812 1.714a2.21 2.21 0 0 0-.812 1.714V11.5a.5.5 0 0 1-.5.5H10a.5.5 0 0 0 0 1h1.286a1.5 1.5 0 0 0 1.5-1.5V9.214C12.786 8.544 13.329 8 14 8a.5.5 0 0 0 0-1c-.67 0-1.214-.544-1.214-1.214V3.5a1.5 1.5 0 0 0-1.5-1.5H10Z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
export default ForwardRef;
