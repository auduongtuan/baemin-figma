import React, { useState, useCallback } from "react";
import { groupBy, orderBy } from "lodash-es";
import { pluralize } from "@capaj/pluralize";
import { Collapsible, Empty } from "ds";
import { LocaleItem } from "../../../lib";
import LocaleItemRecord from "./LocaleItemRecord";
import { useLocaleItems } from "../../hooks/locale";
import LocaleItemListHeader from "./LocaleItemListHeader";

const LocaleItemList = () => {
  const [source, setSource] = useState("all");
  const filterFn = useCallback(
    (item: LocaleItem) => {
      if (source == "all") return true;
      return item.fromLibrary && item.fromLibrary == source;
    },
    [source]
  );
  const localeItems = useLocaleItems();
  const filteredLocaleItems = localeItems.filter(filterFn);
  const groupedLocaleItems = Object.entries(
    groupBy(orderBy(filteredLocaleItems, ["key"]), (item) => {
      const parts = item.key.split(".");
      if (parts.length >= 2) return parts[0];
      return "";
    })
  ).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div
      className=""
      css={`
        position: relative;
      `}
    >
      <LocaleItemListHeader source={source} setSource={setSource} />
      <div
        className="p-16 flex gap-8 flex-column"
        css={`
          min-height: calc(100% - 41px);
        `}
      >
        {localeItems && (
          <h4 className="mt-0 --flex-grow-1 font-medium text-secondary">
            {localeItems.length} locale {pluralize("item", localeItems.length)}
          </h4>
        )}
        {localeItems && localeItems.length == 0 && (
          <Empty
            className="flex-grow-1 h-full"
            title={"No items yet"}
            description={"Import or add your i18n items to use the plugin."}
          ></Empty>
        )}
        {localeItems &&
          groupedLocaleItems &&
          groupedLocaleItems.map(([name, items]) => (
            <Collapsible defaultOpen={localeItems.length < 12}>
              <Collapsible.Trigger
                css={`
                  font-weight: var(--font-weight-medium);
                `}
              >
                {name || "Ungrouped"} ({items.length})
              </Collapsible.Trigger>
              <Collapsible.Content
                css={`
                  padding-left: 16px;
                  padding-bottom: 8px;
                `}
              >
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
