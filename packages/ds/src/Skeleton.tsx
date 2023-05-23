import React from "react";
import { keyframes } from "styled-components";

const shine = keyframes`
  to {
    background-position-x: -200%;
  }
`;
const Skeleton = ({
  width = "100%",
  height = "20px",
}: {
  width?: string | number;
  height?: string | number;
}) => {
  return (
    <div
      css={`
        background: #eee;
        background: linear-gradient(
          110deg,
          #ececec 8%,
          #f5f5f5 18%,
          #ececec 33%
        );
        border-radius: 5px;
        background-size: 200% 100%;
        animation: 1.5s ${shine} linear infinite;
      `}
      style={{
        width,
        height,
      }}
    ></div>
  );
};
export default Skeleton;
