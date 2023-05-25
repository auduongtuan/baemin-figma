import { LANGUAGE_LIST } from "../../lib/constant";
import { LocaleItem, Lang } from "../../lib";
import updateSelection from "./updateSelection";
import updateTextsAsync from "../text/updateText";

async function switchLang(
  lang: Lang,
  localeItems: LocaleItem[],
  scope?: SceneNode | BaseNode
) {
  updateTextsAsync({ lang, items: localeItems }).then(() => {
    figma.notify(`Switched selection to ${LANGUAGE_LIST[lang]}`);
    updateSelection();
  });
}

export default switchLang;
