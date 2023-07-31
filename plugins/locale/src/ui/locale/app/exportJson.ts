import {
  LocaleItem,
  LocaleJsonFormat,
  isPlurals,
  filterItemsByLibrary,
  Lang,
} from "../../../lib";
// import Prism from "prismjs";
// import "prismjs/components/prism-json";
// import { Token } from "prismjs";
// import { Token } from "prismjs";
import { js_beautify } from "js-beautify";
import { set } from "lodash-es";
import { compareTimeAsc } from "../../../lib/helpers";
export function getLangJSON(
  items: LocaleItem[],
  lang: Lang,
  format: LocaleJsonFormat
) {
  return js_beautify(
    JSON.stringify(
      items
        .sort(
          (a, b) =>
            compareTimeAsc(a.updatedAt, b.updatedAt) ||
            compareTimeAsc(a.createdAt, b.createdAt)
          // cu truoc moi sau
        )
        .reduce((acc, item) => {
          if (isPlurals(item[lang])) {
            if (format == "i18next") {
              Object.keys(item[lang]).forEach((quantity) => {
                // set one as default
                if (quantity === "one") {
                  set(acc, `${item.key}`, item[lang][quantity]);
                } else {
                  set(acc, `${item.key}_${quantity}`, item[lang][quantity]);
                }
              });
            } else if (format == "i18n-js") {
              Object.keys(item[lang]).forEach((quantity) => {
                set(acc, `${item.key}.${quantity}`, item[lang][quantity]);
              });
            }
          } else {
            set(acc, item.key, item[lang]);
          }
          return acc;
        }, {})
    ),
    {
      indent_size: 2,
    }
  );
}
