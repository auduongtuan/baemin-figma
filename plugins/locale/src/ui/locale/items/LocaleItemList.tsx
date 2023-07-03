import LocaleItemListHeader from "./LocaleItemListHeader";
import LocaleItemToolbar from "./LocaleItemToolbar";
import LocaleItemListBody from "./LocaleItemListBody";

const LocaleItemList = () => {
  return (
    <div className="relative flex flex-col grow">
      <LocaleItemListHeader />
      <LocaleItemListBody />
      <LocaleItemToolbar />
    </div>
  );
};

export default LocaleItemList;
