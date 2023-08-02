import configs from "figma-helpers/configs";
import { formatNumber, parseFloatOpts } from "./helpers";
import { Lang, LocaleTextVariables, Configs } from "./types";
import { NUMBER_FORMAT_LIST } from "./constant";

export function formatNumbersInVariables(
  variables: LocaleTextVariables,
  lang: Lang
): LocaleTextVariables {
  const formattedVariables = { ...variables };
  if ("count" in formattedVariables || "number" in formattedVariables) {
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
    if (formattedVariables.count || formattedVariables.count === 0) {
      if (typeof formattedVariables.count == "string")
        formattedVariables.count = parseInt(formattedVariables.count);
      formattedVariables.formattedCount = formatNumber(
        formattedVariables.count,
        sep.decimal,
        sep.thousands
      );
    }
    if (formattedVariables.number || formattedVariables.number === 0) {
      if (typeof formattedVariables.number == "string")
        formattedVariables.number = parseFloat(formattedVariables.number);
      formattedVariables.formattedNumber = formatNumber(
        formattedVariables.number,
        sep.decimal,
        sep.thousands
      );
    }
  }
  return formattedVariables;
}

export function deformatNumbersInVariables(
  formattedVariables: LocaleTextVariables
) {
  const variables = { ...formattedVariables };
  if ("formattedCount" in variables) {
    variables.count = parseInt(variables.formattedCount.toString());
  }
  if ("formattedNumber" in variables) {
    variables.number = parseFloatOpts(variables.formattedNumber);
  }
  return variables;
}
