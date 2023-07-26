import React, { ComponentPropsWithRef, ReactElement, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {}
const MenuContainer = ({ children, ...rest }) => {
  return (
    <div
      // style={{width: menuWidth}}
      css={`
        /* position: absolute; */
        /* left: 0; */
        background-color: var(--hud);
        box-shadow: var(--shadow-hud);
        padding: var(--size-xxsmall) 0 var(--size-xxsmall) 0;
        border-radius: var(--border-radius-small);
        margin: 0;
        z-index: 1000;
        overflow-x: overlay;
        overflow-y: auto;
        /* top: calc(100% + 1px); */
        &::-webkit-scrollbar {
          width: 12px;
          background-color: transparent;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=);
          background-repeat: repeat;
          background-size: 100% auto;
        }
        &::-webkit-scrollbar-track {
          border: solid 3px transparent;
          -webkit-box-shadow: inset 0 0 10px 10px transparent;
          box-shadow: inset 0 0 10px 10px transparent;
        }
        &::-webkit-scrollbar-thumb {
          border: solid 3px transparent;
          border-radius: 6px;
          -webkit-box-shadow: inset 0 0 10px 10px rgba(255, 255, 255, 0.4);
          box-shadow: inset 0 0 10px 10px rgba(255, 255, 255, 0.4);
        }
      `}
      {...rest}
    >
      {children}
    </div>
  );
};
export interface MenuItemProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "content"> {
  selected?: boolean;
  highlighted?: boolean;
  name: React.ReactNode;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  contentTruncate?: boolean;
}
const MenuIcon = ({
  children,
  selected,
  icon,
  highlighted,
  ...rest
}: ComponentPropsWithRef<"span"> & {
  selected?: boolean;
  highlighted?: boolean;
  icon?: React.ReactNode;
}) => {
  return !icon ? (
    <span
      css={`
        width: var(--size-xsmall);
        height: var(--size-xsmall);
        margin-right: var(--size-xxsmall);
        opacity: ${selected ? "1" : "0"};
        pointer-events: none;
        background-image: url("data:image/svg+xml;utf8,%3Csvg%20fill%3D%22none%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20width%3D%2216%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20clip-rule%3D%22evenodd%22%20d%3D%22m13.2069%205.20724-5.50002%205.49996-.70711.7072-.70711-.7072-3-2.99996%201.41422-1.41421%202.29289%202.29289%204.79293-4.79289z%22%20fill%3D%22%23fff%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E");
        background-repeat: no-repeat;
        background-position: center center;
        flex-shrink: 0;
        flex-grow: 0;
      `}
    ></span>
  ) : (
    <span
      css={`
        width: 14px;
        height: 14px;
        margin-right: var(--size-xxsmall);
        pointer-events: none;
        flex-shrink: 0;
        flex-grow: 0;
        svg {
          width: 14px;
          height: 14px;
        }
      `}
    >
      {icon}
    </span>
  );
};
const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  (
    {
      selected,
      highlighted = false,
      name,
      content,
      contentTruncate = true,
      icon,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        className="flex items-center pl-8 pr-16 font-normal outline-none cursor-default select-none text-onbrand text-small disabled:text-oncomponentTeritary data-[highlighted]:bg-brand"
        data-selected={selected ? selected : undefined}
        data-highlighted={highlighted ? highlighted : undefined}
        {...rest}
        ref={ref}
      >
        <MenuIcon {...{ selected, highlighted, icon }} />
        <span className="flex flex-col py-4 w-[calc(100%-16px)]">
          <span className="w-full truncate pointer-events-none">{name}</span>
          {content && (
            <span
              className={twMerge(
                "w-full pointer-events-none text-xsmall text-onbrandSecondary leading-tight",
                contentTruncate && "truncate"
              )}
            >
              {content}
            </span>
          )}
        </span>
      </div>
    );
  }
);
const MenuTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, ...rest }, forwardedRef) => {
  return <button ref={forwardedRef} {...rest}></button>;
});
export default Object.assign(MenuContainer, { Item: MenuItem, Icon: MenuIcon });
