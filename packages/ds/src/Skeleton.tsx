const Skeleton = ({
  width = "100%",
  height = "20px",
}: {
  width?: string | number;
  height?: string | number;
}) => {
  return (
    <div
      className={
        "bg-skeleton rounded-md bg-[length:200%_100%] animate-[shine_1.5s_linear_infinite]"
      }
      style={{
        width,
        height,
      }}
    ></div>
  );
};
export default Skeleton;
