import globalColors from "../../plugins/plugin/src/constant/tokens/globalColors";
const tokenColors = {
  default: globalColors.gray[50],
  comment: globalColors.gray[100],
  prolog: globalColors.gray[100],
  doctype: globalColors.gray[100],
  cdata: globalColors.gray[100],
  punctuation: globalColors.gray[300],
  namespace: globalColors.gray[600], // aware
  property: globalColors.purple[300],
  tag: globalColors.purple[300],
  boolean: globalColors.purple[300],
  number: globalColors.purple[300],
  constant: globalColors.purple[300],
  symbol: globalColors.purple[300],
  deleted: globalColors.purple[300],
  selector: globalColors.green[300],
  "attr-name": globalColors.green[300],
  string: globalColors.green[300],
  char: globalColors.green[300],
  builtin: globalColors.green[300],
  inserted: globalColors.green[300],
  operator: globalColors.yellow[300],
  entity: globalColors.yellow[300],
  url: globalColors.yellow[300],
  // "string": globalColors.yellow[300],
  atrule: globalColors.blue[300],
  "attr-value": globalColors.blue[300],
  keyword: globalColors.blue[300],
  function: globalColors.blue[200],
  "class-name": globalColors.blue[200],
  regex: globalColors.yellow[300],
  important: globalColors.yellow[300],
  variable: globalColors.yellow[300],
};
import * as _ from 'lodash';
import { hexToFigmaRGB } from './colors';
import { Token } from "prismjs";
function updateCodeHighlighter(textNode: TextNode, tokens: Array<string | Token>) {
  let characters = "";
  // create characters
  function tokenRecursive(tokenStream) {
    tokenStream.forEach((token) => {
      if (_.isString(token)) {
        characters += token;
      } else if ("content" in token) {
        if (_.isString(token.content)) {
          characters += token.content;
        } else if (_.isArray(token.content)) {
          tokenRecursive(token.content);
        }
      }
    });
  }
  tokenRecursive(tokens);

  if (textNode.type == "TEXT") {
    textNode.characters = characters;
    let characterCount = 0;
    const themedTokenColors: {[key:string]:SolidPaint} = Object.keys(tokenColors).reduce((acc, name) => {
      // const paintStyle = figma.createPaintStyle();
      // console.log(name, tokenColors[name]);
      const paint: SolidPaint = {
        type: "SOLID",
        color: hexToFigmaRGB(name in tokenColors && tokenColors[name] ? tokenColors[name] : tokenColors.default)
      }
      // paintStyle.paints = [paint];
      acc[name] = paint;
      return acc;
    }, {})
    tokens.forEach(token => {
      let paint: SolidPaint;
      if (_.isString(token)) {
        paint = themedTokenColors.default;
      } else if ("content" in token && "type" in token) {
        // const paintStyle = h.getLocalPaintStyle(token.type in themedTokenColors ? themedTokenColors[token.type] : globalColors.gray[90]);
        paint =
          token.type in themedTokenColors
            ? themedTokenColors[token.type]
            : themedTokenColors.default;
      }
      if (paint) {
        textNode.setRangeFills(
          characterCount,
          characterCount + token.length,
          [paint]
        );
      }
      characterCount = characterCount + token.length;
    });
  }
}
export default updateCodeHighlighter;