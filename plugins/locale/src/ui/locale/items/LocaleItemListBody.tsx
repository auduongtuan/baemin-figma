import { groupBy, orderBy } from "lodash-es";
import { pluralize } from "@capaj/pluralize";
import { Empty } from "ds";
import { LocaleItem } from "@lib";
import { useLocaleItems } from "@ui/hooks/locale";
import { useAppDispatch, useAppSelector } from "@ui/hooks/redux";
import LocaleItemListGroup from "./LocaleItemListGroup";
import { useEffect } from "react";
import { clearSelectedItems } from "@ui/state/localeAppSlice";
const LocaleItemListBody = () => {
  const listState = useAppSelector((state) => state.localeApp.list);
  const localeItems = useLocaleItems();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(clearSelectedItems());
  }, [localeItems]);
  const filteredLocaleItems = localeItems.filter((item: LocaleItem) => {
    const needLocal = !listState.editMode || item.isLocal;
    if (listState.source == "all") return needLocal && true;
    return (
      needLocal && item.fromLibrary && item.fromLibrary == listState.source
    );
  });
  const groupedLocaleItems = Object.entries(
    groupBy(orderBy(filteredLocaleItems, ["key"]), (item) => {
      const parts = item.key.split(".");
      if (parts.length >= 2) return parts[0];
      return "";
    })
  ).sort((a, b) => a[0].localeCompare(b[0]));
  const defaultExpanded =
    filteredLocaleItems.length < 32 || groupedLocaleItems.length < 4;
  return (
    <div className="flex flex-col gap-8 p-16 grow">
      {localeItems && (
        <h4 className="mt-0 font-medium --grow text-secondary">
          {filteredLocaleItems.length} {listState.editMode && "editable "}
          {pluralize("item", filteredLocaleItems.length)}
        </h4>
      )}
      {localeItems && localeItems.length == 0 && (
        <Empty
          className="h-full grow"
          title={"No items yet"}
          description={"Import or add your i18n items to use the plugin."}
        ></Empty>
      )}
      {localeItems &&
        groupedLocaleItems &&
        groupedLocaleItems.map(([name, items]) => (
          <LocaleItemListGroup
            key={listState.source + name}
            defaultExpanded={defaultExpanded}
            name={name}
            items={items}
          />
        ))}
    </div>
  );
};
export default LocaleItemListBody;
