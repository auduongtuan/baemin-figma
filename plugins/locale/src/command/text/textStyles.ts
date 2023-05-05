import { hexToFigmaRGB } from "figma-helpers/colors";
import parseTagsInText, { ParsedText } from "./parseTagsInText";
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export const styleSegmentFields = [
  "fontSize",
  "fontName",
  // "fontWeight",
  "textDecoration",
  "textCase",
  "lineHeight",
  "letterSpacing",
  "fills",
  "textStyleId",
  "fillStyleId",
  "hyperlink",
  "listOptions",
] as (
  | "fontSize"
  | "fontName"
  | "textDecoration"
  | "textCase"
  | "lineHeight"
  | "letterSpacing"
  | "fills"
  | "textStyleId"
  | "fillStyleId"
  | "hyperlink"
  | "listOptions"
  | "fontWeight"
  | "indentation"
)[];
export const settings = {
  bold: {
    fontNameStyle: "Bold",
  },
  link: {
    fontNameStyle: "Medium",
    paint: {
      type: "SOLID",
      color: hexToFigmaRGB("#25AFB6"),
      opacity: 1,
    } as SolidPaint,
  },
};
export function setRangeBulkFields(
  textNode: TextNode,
  segment: Partial<StyledTextSegment>,
  start: number,
  end: number
) {
  styleSegmentFields.forEach((field) => {
    const functionName = "setRange" + capitalizeFirstLetter(field);
    if (field in segment && functionName in textNode && segment[field]) {
      textNode[functionName](start, end, segment[field]);
    }
  });
}
/**
 * Set styles
 */
export function setStyles(
  textNode: TextNode,
  parsedText: ParsedText,
  oldStyles: TextStyles
) {
  if (parsedText.stylePositions.unorderedList.length > 0) {
    parsedText.stylePositions.unorderedList.forEach((listPos) => {
      textNode.setRangeListOptions(listPos.start, listPos.end, {
        type: "UNORDERED",
      });
    });
  }
  if (parsedText.stylePositions.orderedList.length > 0) {
    parsedText.stylePositions.orderedList.forEach((listPos) => {
      textNode.setRangeListOptions(listPos.start, listPos.end, {
        type: "ORDERED",
      });
    });
  }
  const fontName = textNode.getRangeFontName(0, 1) as FontName;

  // default bold style
  if (parsedText.stylePositions.bold.length > 0) {
    // get first font
    const boldFontName = {
      family: fontName.family,
      style: settings.bold.fontNameStyle,
    };
    parsedText.stylePositions.bold.forEach((boldPos, i) => {
      // console.log("bold pos", boldPos.start, boldPos.end);
      if (oldStyles.bold[i] && Object.keys(oldStyles.bold[i]).length > 0) {
        setRangeBulkFields(
          textNode,
          oldStyles.bold[i],
          boldPos.start,
          boldPos.end
        );
      } else {
        textNode.setRangeFontName(boldPos.start, boldPos.end, boldFontName);
      }
    });
  }
  // default link style
  if (parsedText.stylePositions.link.length > 0) {
    // get first font
    const linkFontName = {
      family: fontName.family,
      style: settings.link.fontNameStyle,
    };
    parsedText.stylePositions.link.forEach((linkPos, i) => {
      if ("href" in linkPos) {
        textNode.setRangeHyperlink(linkPos.start, linkPos.end, {
          type: "URL",
          value: linkPos.href,
        });
      }
      if (oldStyles.link[i] && Object.keys(oldStyles.link[i]).length > 0) {
        setRangeBulkFields(
          textNode,
          oldStyles.link[i],
          linkPos.start,
          linkPos.end
        );
      } else {
        textNode.setRangeFontName(linkPos.start, linkPos.end, linkFontName);
        textNode.setRangeFills(linkPos.start, linkPos.end, [
          settings.link.paint,
        ]);
      }
    });
  }
}
export interface TextStyles {
  bold?: Partial<StyledTextSegment>[];
  link?: Partial<StyledTextSegment>[];
}
/**
 * Get styles
 */
export function getStyles(
  textNode: TextNode,
  textCharactersWithTags: string
): TextStyles {
  const currentSegments = textNode.getStyledTextSegments(
    styleSegmentFields.filter((field) => field != "listOptions")
  );
  const defaultValue = { bold: [], link: [] };
  if (currentSegments.length == 1) return defaultValue;
  const parsedStyleCharacters = parseTagsInText(textCharactersWithTags);
  if (parsedStyleCharacters.hasTags == false) {
    return defaultValue;
  }
  const oldStyles = {
    bold: parsedStyleCharacters.stylePositions.bold.map((pos) => {
      const mappedSegment = currentSegments.find(
        (segment) => segment.start == pos.start
      );
      if (mappedSegment) {
        const { characters, start, end, ...styles } = mappedSegment;
        return styles;
      }
      return {};
    }),
    link: parsedStyleCharacters.stylePositions.link.map((pos) => {
      const mappedSegment = currentSegments.find(
        (segment) => segment.start == pos.start
      );
      if (mappedSegment) return mappedSegment;
      return {};
    }),
  };
  return oldStyles;
}
