export const PLUGIN_NAME = "BM i18n";
export const LANGUAGE_LIST = {
  en: "English",
  vi: "Vietnamese",
  ko: "Korean",
  ja: "Japanese",
  zh: "Chinese",
  fr: "French",
  de: "German",
};
export const NUMBER_FORMAT_LIST = {
  "period-comma": {
    name: "English (United States)",
    representative: "en-US",
    usedIn: ["en", "ko", "ja", "zh"],
    description: "Decimal separator (.) thousands separator (,)",
  },
  "comma-space": {
    name: "Français (France)",
    representative: "fr-FR",
    usedIn: ["fr"],
    description: "Decimal separator (,) thousands separator ( )",
  },
  "comma-period": {
    name: "Deutsch (Deutschland)",
    representative: "de-DE",
    usedIn: ["de", "vi"],
    description: "Decimal separator (,) thousands separator (.)",
  },
};
export const INITIAL_LANGUAGES = ["en", "vi"];
export const INITIAL_DEFAULT_LANGUAGE = "vi";
// export const PREFIX = "baemin_locale_";
export const PREFIX = "locale_";
export const MIXED_VALUE = "__mixed";
export const DATA_FRAME_NAME = "i18n Data";
export const CODE_FRAME_NAME = "i18n JSON Code";
export const CODE_INFO_FRAME_NAME = "i18n JSON Info";
export const DEFAULT_FONTS = [
  { family: "Roboto", style: "Regular" },
  { family: "Roboto", style: "Medium" },
  { family: "Roboto", style: "SemiBold" },
  { family: "Roboto", style: "Bold" },
  { family: "Roboto Mono", style: "Regular" },
  { family: "Roboto Mono", style: "Medium" },
  { family: "Roboto Mono", style: "SemiBold" },
  { family: "Roboto Mono", style: "Bold" },
];
