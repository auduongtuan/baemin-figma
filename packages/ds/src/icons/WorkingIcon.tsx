import React from "react";
import { UpdateIcon } from "@radix-ui/react-icons";

const WorkingIcon = ({ showText = false }) => {
  return (
    <div className="flex items-center gap-4">
      <UpdateIcon width="14" height="14" className="animate-spin" />
      {showText && <span>Working...</span>}
    </div>
  );
};
export default WorkingIcon;
