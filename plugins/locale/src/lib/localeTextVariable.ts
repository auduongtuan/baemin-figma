import configs from "figma-helpers/configs";
import { formatNumber, parseFloatOpts } from "./helpers";
import { Lang, LocaleTextVariables, Configs } from "./types";
import { NUMBER_FORMAT_LIST } from "./constant";
export function formatNumbersInVariables(
  variables: LocaleTextVariables,
  lang: Lang
) {
  if ("count" in variables || "number" in variables) {
    const numberFormat: Configs["numberFormat"] = configs.get(
      "numberFormat",
      "by-language"
    );
    let sep: { decimal: string; thousands: string };
    if (numberFormat == "by-language") {
      const format = Object.keys(NUMBER_FORMAT_LIST).find((key) =>
        NUMBER_FORMAT_LIST[key].usedIn.includes(lang)
      );
      if (format) {
        sep = NUMBER_FORMAT_LIST[format]?.sep;
      }
    } else {
      sep = NUMBER_FORMAT_LIST[numberFormat]?.sep;
    }
    if (!sep) return;
    // formatted count
    if (variables.count || variables.count === 0) {
      variables.formattedCount = formatNumber(
        variables.count,
        sep.decimal,
        sep.thousands
      );
    }
    if (variables.number || variables.number === 0) {
      variables.formattedNumber = formatNumber(
        variables.number,
        sep.decimal,
        sep.thousands
      );
    }
  }
}
export function deformatNumbersInVariables(variables: LocaleTextVariables) {
  if ("formattedCount" in variables) {
    variables.count = parseInt(variables.formattedCount.toString());
  }
  if ("formattedNumber" in variables) {
    variables.number = parseFloatOpts(variables.formattedNumber);
  }
}
