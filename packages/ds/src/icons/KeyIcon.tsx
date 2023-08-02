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
      d="M6.5 5.5a3 3 0 1 1 1.904 2.794.5.5 0 0 0-.552.127l-.213.233-.993.992A.5.5 0 0 0 6.5 10v.5H6a.5.5 0 0 0-.5.5v.5H5a.5.5 0 0 0-.5.5v.496H2.501l.002-1.086 4.122-4.217a.5.5 0 0 0 .104-.542A2.99 2.99 0 0 1 6.5 5.5Zm0 6.5v-.5H7a.5.5 0 0 0 .5-.5v-.793l.854-.853a.474.474 0 0 0 .015-.016 4 4 0 1 0-2.68-2.619l-4.043 4.138a.5.5 0 0 0-.142.348l-.004 1.79a.5.5 0 0 0 .5.501h3a.5.5 0 0 0 .5-.5V12.5H6a.5.5 0 0 0 .5-.5Zm3-7a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Zm.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
export default ForwardRef;
