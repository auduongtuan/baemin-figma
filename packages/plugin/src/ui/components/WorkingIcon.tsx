import React from "react";
import { UpdateIcon } from "@radix-ui/react-icons";
import { keyframes } from "styled-components";

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const WorkingIcon = ({showText = false}) => {
  return (
    <div className="flex gap-4 align-items-center">
    <UpdateIcon
      width="14"
      height="14"
      css={`
        animation: ${rotate} 1s linear infinite;
      `}
    />
    {showText && <span>Working...</span>}
    </div>
  );
};
export default WorkingIcon;
