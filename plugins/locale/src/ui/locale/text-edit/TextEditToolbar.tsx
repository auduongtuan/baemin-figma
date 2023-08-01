import clsx from "clsx";
import { twMerge } from "tailwind-merge";
const TextEditToolbar: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  children,
}) => {
  return (
    <div className={clsx("flex items-center gap-8 group", className)}>
      {children}
    </div>
  );
};
export const TextEditIconGroup: React.FC<
  React.ComponentPropsWithRef<"div">
> = ({ className, children, ...rest }) => {
  return (
    <div
      className={twMerge(
        "flex grow gap-12 transition-opacity duration-100 opacity-0 group-hover:opacity-100 data-[activated]:opacity-100",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
export default TextEditToolbar;
