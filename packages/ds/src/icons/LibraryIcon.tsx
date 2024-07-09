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
      d="M3.304 2.3c.198-.19.47-.3.759-.3H12v7.75H4.062c-.379 0-.745.107-1.062.304V3a.97.97 0 0 1 .304-.7ZM3 11.875c0-.305.117-.593.318-.803.201-.208.47-.322.744-.322H12V13H4.062c-.288 0-.56-.11-.758-.3A.97.97 0 0 1 3 12v-.125Zm10-1.625V1.5a.5.5 0 0 0-.5-.5H4.062c-.54 0-1.062.206-1.45.579A1.97 1.97 0 0 0 2 3v9c0 .537.222 1.048.611 1.421s.91.579 1.451.579H12.5a.5.5 0 0 0 .5-.5v-3.25Z"
      clipRule="evenodd"
    />
  </svg>
);
const LibraryIcon = forwardRef(SvgComponent);
export default LibraryIcon;
