import React, { useState, useCallback, useMemo } from "react";
import { groupBy, orderBy } from "lodash-es";
import { pluralize } from "@capaj/pluralize";
import { Checkbox, Collapsible, Empty } from "ds";
import { LocaleItem } from "../../../lib";
import LocaleItemRecord from "./LocaleItemRecord";
import { useLocaleItems } from "../../hooks/locale";
import LocaleItemListHeader from "./LocaleItemListHeader";

const LocaleItemList = () => {
  const [source, setSource] = useState("all");
  const localeItems = useLocaleItems();
  const filteredLocaleItems = localeItems.filter((item: LocaleItem) => {
    if (source == "all") return true;
    return item.fromLibrary && item.fromLibrary == source;
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
    <div className="relative">
      <LocaleItemListHeader source={source} setSource={setSource} />
      <div className="p-16 flex gap-8 flex-col min-h-[calc(100%-41px)]">
        {localeItems && (
          <h4 className="mt-0 --grow font-medium text-secondary">
            {filteredLocaleItems.length}{" "}
            {pluralize("item", filteredLocaleItems.length)}
          </h4>
        )}
        {localeItems && localeItems.length == 0 && (
          <Empty
            className="grow h-full"
            title={"No items yet"}
            description={"Import or add your i18n items to use the plugin."}
          ></Empty>
        )}
        {localeItems &&
          groupedLocaleItems &&
          groupedLocaleItems.map(([name, items]) => (
            <Collapsible key={source + name} defaultOpen={defaultExpanded}>
              <Collapsible.Trigger className="font-medium">
                <div className="flex gap-8">
                  <Checkbox
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />{" "}
                  <span className="grow">
                    {name || "Ungrouped"} ({items.length})
                  </span>
                </div>
              </Collapsible.Trigger>
              <Collapsible.Content className="pl-16 pb-8">
                {items.map((item) => (
                  <LocaleItemRecord item={item} group={name} />
                ))}
              </Collapsible.Content>
            </Collapsible>
          ))}
      </div>
    </div>
  );
};

export default LocaleItemList;
