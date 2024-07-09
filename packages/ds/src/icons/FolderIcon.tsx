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
      d="M1 3a1.5 1.5 0 0 1 1.5-1.5h3.558a1.5 1.5 0 0 1 1.11.491l1.404 1.545a.5.5 0 0 0 .37.164H10.5A1.5 1.5 0 0 1 12 5.2v.3h1.007a1.5 1.5 0 0 1 1.387 2.07l-2.057 5a1.5 1.5 0 0 1-1.387.93H2.5A1.5 1.5 0 0 1 1 12V3Zm1 7 1.195-3.486A1.5 1.5 0 0 1 4.615 5.5H11v-.3a.5.5 0 0 0-.5-.5H8.942a1.5 1.5 0 0 1-1.11-.491L6.428 2.664a.5.5 0 0 0-.37-.164H2.5A.5.5 0 0 0 2 3v7Zm2.141-3.162a.5.5 0 0 1 .473-.338h8.393a.5.5 0 0 1 .463.69l-2.058 5a.5.5 0 0 1-.462.31H2.9a.5.5 0 0 1-.473-.662l1.714-5Z"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgComponent);
export default ForwardRef;
