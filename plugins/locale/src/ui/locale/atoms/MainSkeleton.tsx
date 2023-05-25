import React from "react";
import { Skeleton, Divider } from "ds";
import { memo } from "react";
function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const MainSekeleton = memo(() => {
  return (
    <div
      className="flex flex-column"
      css={`
        height: 100vh;
      `}
    >
      <div className="py-10 px-16 flex align-content-between justify-between w-full">
        <Skeleton width="80px" height="20px" />
        <Skeleton width="100px" height="20px" />
      </div>
      <Divider />
      <div className="py-24 p-16 flex flex-column h-full gap-24 flex-grow-1">
        {[...Array(8)].map((_, i) => (
          <Skeleton
            height="20px"
            width={randomIntFromInterval(40, 100) + "%"}
          />
        ))}
      </div>
      <Divider />
      <div className="py-10 px-16 flex align-content-between justify-between w-full flex-grow-0 flex-shrink-0">
        <Skeleton width="40px" height="20px" />
        <Skeleton width="80px" height="20px" />
      </div>
    </div>
  );
});
export default MainSekeleton;
