import React from "react";
import { Skeleton, Divider } from "ds";
import { memo } from "react";
function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const MainSekeleton = memo(() => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex content-between justify-between w-full px-16 py-10">
        <Skeleton width="80px" height="20px" />
        <div className="flex gap-8">
          <Skeleton width="20px" height="20px" />
          <Skeleton width="20px" height="20px" />
        </div>
      </div>
      <Divider />
      <div className="flex flex-col h-full gap-24 p-16 py-24 grow">
        <Skeleton height="20px" width="100px" />
        {[...Array(8)].map((_, i) => (
          <Skeleton
            height="20px"
            width={randomIntFromInterval(40, 100) + "%"}
          />
        ))}
      </div>
      <Divider />
      <div className="flex content-between justify-between w-full px-16 py-10 grow-0 shrink-0">
        <Skeleton width="40px" height="20px" />
        <div className="flex gap-8">
          <Skeleton width="20px" height="20px" />
          <Skeleton width="20px" height="20px" />
          <Skeleton width="20px" height="20px" />
        </div>
      </div>
    </div>
  );
});
export default MainSekeleton;
