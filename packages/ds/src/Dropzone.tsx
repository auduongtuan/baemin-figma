import { FilePlusIcon } from "@radix-ui/react-icons";
import React, { DragEvent, useCallback, useReducer } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
export interface DropzoneProps extends DropzoneOptions {
  description?: string;
  dragDescription?: string;
}
const Dropzone = ({
  description = `Drag 'n' drop some files here, or click to select files`,
  dragDescription = "Drop the files here ..",
  ...options
}: DropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...options,
  });
  return (
    <div
      {...getRootProps()}
      data-drag-active={isDragActive ? "true" : undefined}
      css={`
        border-width: 1px;
        border-style: dashed;
        border-color: var(--figma-color-border);
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        min-height: 120px;
        gap: 8px;
        padding: 8px 16px;
        color: var(--figma-color-text-secondary);
        &[data-drag-active] {
          border-color: var(--figma-color-border-brand-strong);
          color: var(--figma-color-text-brand);
        }
        p {
          height: 32px;
          line-height: 16px;
        }
      `}
    >
      <FilePlusIcon
        width={24}
        height={24}
        css={`
          font-size: 24px;
        `}
      />
      <input {...getInputProps()} />
      {isDragActive ? <p>{dragDescription}</p> : <p>{description}</p>}
    </div>
  );
};
export default Dropzone;
