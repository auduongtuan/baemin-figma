import React, { ComponentPropsWithRef, ReactElement, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
// position: absolute;
// left: 0;
// top: calc(100% + 1px);
export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {}
const MenuContainer = ({ className, children, ...rest }: MenuProps) => {
  return (
    <div
      // style={{width: menuWidth}}
      className={twMerge(
        "bg-hud shadow-hud rounded-sm m-0 py-8 z-[1000] overflow-x-['overlay'] overflow-y-auto invisible-scrollbar",
        className
      )}
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
      className={twMerge(
        "w-16 h-16 mr-8 pointer-events-none bg-no-repeat bg-center shrink-0 grow-0",
        selected ? "opacity-100" : "opacity-0"
      )}
      style={{
        backgroundImage:
          'url("data:image/svg+xml;utf8,%3Csvg%20fill%3D%22none%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20width%3D%2216%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20clip-rule%3D%22evenodd%22%20d%3D%22m13.2069%205.20724-5.50002%205.49996-.70711.7072-.70711-.7072-3-2.99996%201.41422-1.41421%202.29289%202.29289%204.79293-4.79289z%22%20fill%3D%22%23fff%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E")',
      }}
    ></span>
  ) : (
    <span className="w-14 h-14 mr-8 pointer-events-none shrink-0 grow-0 [&_svg]:w-14 [&_svg]:h-14">
      {icon}
    </span>
  );
};
const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  (
    {
      selected,
      highlighted: externalHighlighted,
      name,
      content,
      contentTruncate = true,
      icon,
      ...rest
    },
    ref
  ) => {
    const [hovered, setHovered] = React.useState(false);
    const highlighted =
      typeof externalHighlighted === "boolean" ? externalHighlighted : hovered;
    return (
      <div
        className="flex items-center pl-8 pr-16 font-normal outline-none cursor-default select-none text-onbrand text-small disabled:text-oncomponentTeritary data-[highlighted]:bg-brand"
        data-selected={selected ? selected : undefined}
        data-highlighted={highlighted ? highlighted : undefined}
        onMouseOver={() => {
          setHovered(true);
        }}
        onMouseLeave={() => setHovered(false)}
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
export default Object.assign(MenuContainer, {
  Trigger: MenuTrigger,
  Item: MenuItem,
  Icon: MenuIcon,
});
