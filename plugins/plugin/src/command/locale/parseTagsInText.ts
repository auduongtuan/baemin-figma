import { matchAll } from "../../lib/helpers";
const textCharacters =
  "Oh la la <b>TestBold1</b>, <a>TestLink1</a> nghinh nhi:\n<ul><li>Lalala <b>TestBold2</b></li>\n<li>Dai hon ne <a>TestLink2</a></li></ul>";
const tagRegex = /\<(b|a|ul|li)\b[^>]*>((?:.|\n)*?)\<\/\1>/;
type StylePosition = [number, number];
const styleTypes = ["bold", "link", "unorderedList", "orderedList"] as const;
type ParsedStyle = {
  [key in typeof styleTypes[number]]: StylePosition[];
};
type ParsedText = {
  characters?: string;
  style?: ParsedStyle;
  hasTags?: boolean;
};
function parseTagsInText(textCharacters: string, parentTag?: string) {
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
  const style: ParsedStyle = {
    bold: [],
    link: [],
    unorderedList: [],
    orderedList: [],
  };
  matches.forEach((match) => {
    const tag = match[1];
    console.log(tag);
    const tagsLength = match[0].length - match[2].length;
    const textContent = parseTagsInText(match[2], tag);
    console.log("textContent", textContent);
    newString +=
      textCharacters.substring(currentIndex, match.index) +
      textContent.characters;
    // const closeTagLength = tag.length + 3;
    // const openTagLength = tagsLength - closeTagLength;
    const newIndex = match.index - currentTagsLength;
    if (tag == "b") {
      style.bold.push([newIndex, newIndex + textContent.characters.length]);
    }
    if (tag == "a") {
      style.link.push([newIndex, newIndex + textContent.characters.length]);
    }
    if (tag == "li") {
      if (parentTag == "ol") {
        style.orderedList.push([
          newIndex,
          newIndex + textContent.characters.length,
        ]);
      } else {
        style.unorderedList.push([
          newIndex,
          newIndex + textContent.characters.length,
        ]);
      }
    }
    // if (textContent.hasTags) {
    styleTypes.forEach((styleType) => {
      if (
        textContent.style &&
        styleType in textContent.style &&
        textContent.style[styleType]
      ) {
        const newStyle: StylePosition[] = textContent.style[styleType].map(
          (pos: StylePosition): StylePosition => [
            pos[0] + newIndex,
            pos[1] + newIndex,
          ]
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
    style: style,
  };
}
const testParsed = parseTagsInText(textCharacters);
console.log(JSON.stringify(testParsed));
console.log("TestLink1", testParsed.characters.indexOf("TestLink1"));
console.log("TestLink2", testParsed.characters.indexOf("TestLink2"));
console.log("TestBold1", testParsed.characters.indexOf("TestBold1"));
console.log("TestBold2", testParsed.characters.indexOf("TestBold2"));
export default parseTagsInText;
