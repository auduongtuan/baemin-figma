import * as h from "../commandHelper";
import {
  PREFIX, DEFAULT_LANG, LANGUAGES
} from "../../constant/locale";
import { findItemByKey, findItemByCharacters, findItemByKeyOrCharacters, LocaleItem, Lang } from "../../lib/localeData";
import updateSelection from "./updateSelection";
export function getLang(node: TextNode) {
  const lang = h.getNodeData(node, `${PREFIX}lang`);
  if(lang == 'en' || lang == 'vi') {
    return lang;
  } else {
    return DEFAULT_LANG;
  }
}

export function setLang(node: TextNode, lang: string) {
  h.setNodeData(node, `${PREFIX}lang`, lang);
}
export function getKey(node: TextNode) {
  return h.getNodeData(node, `${PREFIX}key`);
}
export function setKey(node: TextNode, key: string) {
  h.setNodeData(node, `${PREFIX}key`, key);
}

export function changeLang(textNode: TextNode, lang, localeItems: LocaleItem[]) {
  const key = getKey(textNode);
  const item =
    findItemByKey(key, localeItems) ||
    findItemByCharacters(textNode.characters, localeItems);
  if (item && item[lang]) {
    textNode.characters = item[lang];
    setLang(textNode, lang);
  }
}
export function autoSetKey(textNode: TextNode, localeItems: LocaleItem[], callback?: Function) {
  const item = findItemByCharacters(textNode.characters, localeItems);
  if(item) {
    if(getKey(textNode) != item.key) {
      setKey(textNode, item.key);
      if(callback) callback();
    }
  }
}
export function switchLang(lang: Lang, localeItems: LocaleItem[]) {
  h.selection().forEach((selection) => {
    if (h.isText(selection)) {
      changeLang(selection, lang, localeItems);
    } else if (h.isContainer(selection)) {
      const texts = selection.findAll((node) => h.isText(node)) as TextNode[];
      texts.forEach((textNode) => {
        changeLang(textNode, lang, localeItems);
      });
    }
  });
  figma.notify(`Switched selection to ${LANGUAGES[lang]}`);
  updateSelection();
};

export function checkNodeVisible(node: SceneNode) {
  return node.visible &&
              (!node.parent || !h.isContainer(node.parent) ||
                (h.isContainer(node.parent) && node.parent.visible)) &&
              (!node.parent.parent || !h.isContainer(node.parent.parent) ||
                (h.isContainer(node.parent.parent) && node.parent.parent.visible)) &&
              (!node.parent.parent.parent || !h.isContainer(node.parent.parent.parent) ||
                (h.isContainer(node.parent.parent.parent) && node.parent.parent.parent.visible))
}