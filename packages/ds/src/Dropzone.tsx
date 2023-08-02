import { FilePlusIcon } from "@radix-ui/react-icons";
import React, { DragEvent, useCallback, useReducer } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { twMerge } from "tailwind-merge";
export interface DropzoneProps extends DropzoneOptions {
  description?: string;
  dragDescription?: string;
  className?: string;
}
const Dropzone = ({
  description = `Drag 'n' drop some files here, or click to select files`,
  dragDescription = "Drop the files here ..",
  className,
  ...options
}: DropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...options,
  });
  return (
    <div
      {...getRootProps()}
      data-drag-active={isDragActive ? "true" : undefined}
      className={twMerge(
        `border border-dashed border-divider rounded-md flex flex-col items-center justify-center`,
        `text-center min-h-120px gap-8 px-16 py-8 text-secondary data-[drag-active]:text-brand data-[drag-active]:border-brandStrong transition-colors duration-100`,
        `[&_p]:h-32 [&_p]:leading-[16px]`,
        className
      )}
    >
      <FilePlusIcon width={24} height={24} className="text-[24px]" />
      <input {...getInputProps()} />
      {isDragActive ? <p>{dragDescription}</p> : <p>{description}</p>}
    </div>
  );
};
export default Dropzone;
