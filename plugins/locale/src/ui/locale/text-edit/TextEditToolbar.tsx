import clsx from "clsx";
const TextEditToolbar: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  children,
}) => {
  return (
    <div
      className={clsx("flex items-center gap-8", className)}
      css={`
        & > .icon-group {
          transition: opacity 0.1s;
        }
        & > .icon-group:not([data-activated]) {
          opacity: 0;
        }
        &:hover > .icon-group,
        & > .icon-group[date-activated] {
          opacity: 1;
        }
      `}
    >
      {children}
    </div>
  );
};
export default TextEditToolbar;
