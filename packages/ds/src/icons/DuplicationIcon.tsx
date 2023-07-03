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
      d="M5.249 2.45a.5.5 0 0 1 .5-.5h3.3v2.7a.5.5 0 0 0 .5.5h2.7v4.9a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-7.6Zm6.292 1.7L10.05 2.657V4.15h1.492ZM5.75.95a1.5 1.5 0 0 0-1.5 1.5v1H3.25a1.5 1.5 0 0 0-1.5 1.5v7.6a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5v-1h.999a1.5 1.5 0 0 0 1.5-1.5v-5.4a.5.5 0 0 0-.147-.354l-3.2-3.2A.5.5 0 0 0 9.55.95h-3.8Zm4.001 10.6H5.749a1.5 1.5 0 0 1-1.5-1.5v-5.6H3.25a.5.5 0 0 0-.5.5v7.6a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5v-1Z"
      clipRule="evenodd"
    />
  </svg>
);
const DuplicationIcon = forwardRef(SvgComponent);
export default DuplicationIcon;
