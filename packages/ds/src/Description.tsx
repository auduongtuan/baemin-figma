import { twMerge } from "tailwind-merge";

const Description = ({
  label,
  children,
  horizontal = false,
  className,
  ...rest
}: {
  label?: React.ReactNode;
  horizontal?: boolean;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      {...rest}
      className={twMerge(
        className,
        "flex",
        horizontal ? "flex-row gap-16" : "flex-col"
      )}
    >
      {label && (
        <div
          className={twMerge(
            horizontal ? "w-1/3" : "mb-4 font-medium text-secondary"
          )}
        >
          {label}
        </div>
      )}
      <div>
        {children ? children : <span className="text-secondary">–</span>}
      </div>
    </div>
  );
};
export default Description;
