import { LocaleItem, getStringContent } from "@lib";
import { useLanguages } from "@ui/hooks/locale";
import { Collapsible, Divider } from "ds";
import { groupBy, orderBy } from "lodash-es";

const LocaleItemReview = ({
  items,
  defaultOpen,
}: {
  items: LocaleItem[];
  defaultOpen?: boolean | ((items: LocaleItem[]) => boolean);
}) => {
  const languages = useLanguages();
  const groupedLocaleItems = Object.entries(
    groupBy(orderBy(items, ["key"]), (item) => {
      const parts = item.key.split(".");
      if (parts.length >= 2) return parts[0];
      return "";
    })
  ).sort((a, b) => a[0].localeCompare(b[0]));
  return (
    <div>
      {groupedLocaleItems &&
        groupedLocaleItems.map(([name, items]) => (
          <Collapsible
            defaultOpen={
              typeof defaultOpen == "function"
                ? defaultOpen(items)
                : defaultOpen
            }
          >
            <Collapsible.Trigger>
              {name || "Ungrouped"} ({items.length})
            </Collapsible.Trigger>
            <Collapsible.Content className="pl-16">
              {items.map((item, i) => (
                <>
                  <Collapsible defaultOpen={false}>
                    <Collapsible.Trigger>
                      <div className="truncate">{item.key}</div>
                    </Collapsible.Trigger>
                    <Collapsible.Content>
                      <div className="flex flex-col gap-4 py-8 pl-16">
                        {languages.map(
                          (lang) =>
                            lang in item && (
                              <div className="flex gap-2">
                                <span className="w-20 text-xs font-medium uppercase grow-0 shrink-0 text-secondary">
                                  {lang}
                                </span>
                                <div>{getStringContent(item[lang])}</div>
                              </div>
                            )
                        )}
                      </div>
                    </Collapsible.Content>
                  </Collapsible>
                  {i !== items.length - 1 && <Divider />}
                </>
              ))}
            </Collapsible.Content>
          </Collapsible>
        ))}
    </div>
  );
};

export default LocaleItemReview;
