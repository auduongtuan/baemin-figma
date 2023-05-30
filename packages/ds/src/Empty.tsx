import React from "react";
import { FaceIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
const Empty = ({
  title,
  description,
  className,
  ...rest
}: React.ComponentPropsWithRef<"div"> & {
  title: string;
  description?: string;
}) => {
  return (
    <div
      className={clsx(
        "flex flex-column items-center justify-center",
        className
      )}
      {...rest}
    >
      <FaceIcon width={32} height={32} className="text-secondary" />
      <h2 className="mt-12 text-large">{title}</h2>
      {description && <p className="mt-4 text-secondary mb-8">{description}</p>}
    </div>
  );
};

export default Empty;
