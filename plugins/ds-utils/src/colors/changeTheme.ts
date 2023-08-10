import * as h from "figma-helpers";
import paintStyles from "../constant/paintStyles";

const changeTheme = async () => {
  const importedIds = {};
  const promises: Promise<BaseStyle>[] = [];
  // for (const paintStyleName in paintStyles) {
  //   promises.push(figma.importStyleByKeyAsync(paintStyles[paintStyleName]));
  // }
  // await Promise.all(promises).then((paintStyles) => {
  //   paintStyles.forEach((paintStyle) => {
  //     importedIds[paintStyle.name] = paintStyle.id;
  //   });
  // });
  // function getReversedStyleId(styleId): string | null {
  //   const oPaintStyle = figma.getStyleById(styleId);
  //   if(oPaintStyle) {
  //     if (oPaintStyle.name.startsWith("light")) {
  //       const darkStyleName = oPaintStyle.name.replace("light", "dark");
  //       if (darkStyleName in importedIds) {
  //         return importedIds[darkStyleName];
  //       }
  //       else {
  //         console.log(darkStyleName + ' not found');
  //       }
  //     }
  //     if (oPaintStyle.name.startsWith("dark")) {
  //       const lightStyleName = oPaintStyle.name.replace("dark", "light");
  //       if (lightStyleName in importedIds) {
  //         return importedIds[lightStyleName];
  //       } else {
  //         console.log(lightStyleName + ' not found');

  //       }
  //     }
  //   } else {
  //     console.log('Paint style not found '+styleId);
  //   }
  //   return null;
  // }
  async function getReversedStyleId(styleId: string): Promise<string | null> {
    const originalPaintStyle = figma.getStyleById(styleId);
    if (originalPaintStyle) {
      if (originalPaintStyle.name.startsWith("light")) {
        const darkStyleName = originalPaintStyle.name.replace("light", "dark");
        if (darkStyleName in importedIds) {
          return importedIds[darkStyleName];
        } else {
          if (darkStyleName in paintStyles) {
            console.log("import " + darkStyleName);
            const paintStyle = await figma.importStyleByKeyAsync(
              paintStyles[darkStyleName]
            );
            importedIds[darkStyleName] = paintStyle.id;
            return paintStyle.id;
          }
        }
      }
      if (originalPaintStyle.name.startsWith("dark")) {
        const lightStyleName = originalPaintStyle.name.replace("dark", "light");
        if (lightStyleName in importedIds) {
          return importedIds[lightStyleName];
        } else {
          if (lightStyleName in paintStyles) {
            console.log("import " + lightStyleName);
            const paintStyle = await figma.importStyleByKeyAsync(
              paintStyles[lightStyleName]
            );
            importedIds[lightStyleName] = paintStyle.id;
            return paintStyle.id;
          }
        }
      }
    } else {
      console.log("Paint style not found " + styleId);
    }
    return null;
  }
  async function replaceStyle(
    node: SceneNode,
    styleType: "fillStyleId" | "strokeStyleId"
  ) {
    if (styleType in node && typeof node[styleType] == "string") {
      if (node.type == "TEXT" && styleType == "fillStyleId") {
        const segments = node.getStyledTextSegments(["fillStyleId"]);
        for (const segment of segments) {
          if (segment.fillStyleId) {
            const reversedStyleId = await getReversedStyleId(
              segment.fillStyleId
            );
            if (reversedStyleId)
              node.setRangeFillStyleId(
                segment.start,
                segment.end,
                reversedStyleId
              );
          }
        }
      } else {
        console.log(styleType, node[styleType]);
        if (node[styleType]) {
          const reversedStyleId = await getReversedStyleId(node[styleType]);
          if (reversedStyleId) {
            node[styleType] = reversedStyleId;
          }
        }
      }
    }
  }
  async function recursiveChangeTheme(node: BaseNode) {
    if (h.isInstance(node)) {
      const swapped = h.swapVariant(node, { Dark: "True" });
      if (!swapped) {
        await replaceStyle(node, "fillStyleId");
        await replaceStyle(node, "strokeStyleId");
        for (const childNode of node.children) {
          await recursiveChangeTheme(childNode);
        }
      }
    } else if (h.isContainer(node)) {
      await replaceStyle(node, "fillStyleId");
      await replaceStyle(node, "strokeStyleId");
      for (const childNode of node.children) {
        await recursiveChangeTheme(childNode);
      }
    } else {
      if (
        // node.type == "COMPONENT_SET" ||
        node.type == "ELLIPSE" ||
        node.type == "HIGHLIGHT" ||
        node.type == "LINE" ||
        node.type == "POLYGON" ||
        node.type == "RECTANGLE" ||
        node.type == "SECTION" ||
        node.type == "STAMP" ||
        node.type == "STAR" ||
        node.type == "STICKY" ||
        node.type == "TEXT" ||
        node.type == "VECTOR"
      ) {
        await replaceStyle(node, "fillStyleId");
        await replaceStyle(node, "strokeStyleId");
      }
    }
  }
  for (const selection of h.selection()) {
    // replaceStyle(selection, "fillStyleId");
    // replaceStyle(selection, "strokeStyleId");
    // if (h.isContainer(selection)) {
    //   const layers = selection.findAll();
    //   for (const node of layers) {
    //     if (
    //       node.type == "COMPONENT" ||
    //       node.type == "COMPONENT_SET" ||
    //       node.type == "ELLIPSE" ||
    //       node.type == "FRAME" ||
    //       node.type == "HIGHLIGHT" ||
    //       node.type == "INSTANCE" ||
    //       node.type == "LINE" ||
    //       node.type == "POLYGON" ||
    //       node.type == "RECTANGLE" ||
    //       node.type == "SECTION" ||
    //       node.type == "STAMP" ||
    //       node.type == "STAR" ||
    //       node.type == "STICKY" ||
    //       node.type == "TEXT" ||
    //       node.type == "VECTOR"
    //     ) {
    //       replaceStyle(node, "fillStyleId");
    //       replaceStyle(node, "strokeStyleId");
    //     }
    //   }
    // }
    await recursiveChangeTheme(selection);
  }
};

export default changeTheme;
