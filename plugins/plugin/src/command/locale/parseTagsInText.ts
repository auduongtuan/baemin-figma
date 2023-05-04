import { matchAll } from "../../lib/helpers";
export const tagRegex = /\<(b|a|ul|ol|li)\b[^>]*>((?:.|\n)*?)\<\/\1>/;
export type StyleInfo = {
  start: number;
  end: number;
  href?: string;
};
export const styleTypes = [
  "bold",
  "link",
  "unorderedList",
  "orderedList",
] as const;
export type ParsedStylePositions = {
  [key in typeof styleTypes[number]]: StyleInfo[];
};
export type ParsedText = {
  characters?: string;
  stylePositions?: ParsedStylePositions;
  tagsLength?: number;
  hasTags?: boolean;
};
function parseTagsInText(
  textCharacters: string,
  parentTag?: string
): ParsedText {
  const matches = matchAll(tagRegex, textCharacters);
  if (matches.length == 0) {
    return {
      hasTags: false,
      characters: textCharacters,
    };
  }
  let newString = "";
  let currentIndex = 0;
  let currentTagsLength = 0;
  const style: ParsedStylePositions = {
    bold: [],
    link: [],
    unorderedList: [],
    orderedList: [],
  };
  matches.forEach((match) => {
    const tag = match[1];
    const tagsLength = match[0].length - match[2].length;
    const textContent = parseTagsInText(match[2], tag);
    newString +=
      textCharacters.substring(currentIndex, match.index) +
      textContent.characters;
    // const closeTagLength = tag.length + 3;
    // const openTagLength = tagsLength - closeTagLength;
    const newIndex = match.index - currentTagsLength;
    if (tag == "b") {
      style.bold.push({
        start: newIndex,
        end: newIndex + textContent.characters.length,
      });
    }
    if (tag == "a") {
      const href = match[0].match(/href=['"](.*?)['"]/);
      style.link.push({
        start: newIndex,
        end: newIndex + textContent.characters.length,
        href: href ? href[1] : undefined,
      });
    }
    if (tag == "li") {
      if (parentTag == "ol") {
        style.orderedList.push({
          start: newIndex,
          end: newIndex + textContent.characters.length,
        });
      }
      if (parentTag == "ul") {
        style.unorderedList.push({
          start: newIndex,
          end: newIndex + textContent.characters.length,
        });
      }
    }
    // if (textContent.hasTags) {
    styleTypes.forEach((styleType) => {
      if (
        textContent.stylePositions &&
        styleType in textContent.stylePositions &&
        textContent.stylePositions[styleType]
      ) {
        const newStyle: StyleInfo[] = textContent.stylePositions[styleType].map(
          (pos: StyleInfo): StyleInfo => ({
            ...pos,
            start: pos.start + newIndex,
            end: pos.end + newIndex,
          })
        );
        style[styleType].push(...newStyle);
      }
    });

    // }
    currentTagsLength += tagsLength;
    if (textContent.tagsLength) currentTagsLength += textContent.tagsLength;
    currentIndex = match.index + match[2].length + tagsLength;
  });
  newString += textCharacters.substring(currentIndex);

  return {
    hasTags: true,
    characters: newString,
    tagsLength: currentTagsLength,
    stylePositions: style,
  };
}
// test stuff
// const textCharacters =
//   "Oh la la <b>TestBold1</b>, <a>TestLink1</a> nghinh nhi:\n<ul><li>Lalala <b>TestBold2</b></li>\n<li>Dai hon ne <a>TestLink2</a></li></ul>";
// const testParsed = parseTagsInText(textCharacters);
// console.log(JSON.stringify(testParsed));
// console.log("TestLink1", testParsed.characters.indexOf("TestLink1"));
// console.log("TestLink2", testParsed.characters.indexOf("TestLink2"));
// console.log("TestBold1", testParsed.characters.indexOf("TestBold1"));
// console.log("TestBold2", testParsed.characters.indexOf("TestBold2"));
export default parseTagsInText;
