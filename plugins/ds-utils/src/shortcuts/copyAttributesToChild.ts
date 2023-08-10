import { selection, isFrame, isInstance, isComponent } from "figma-helpers";
const copyAttributesToChild = () => {
  selection().forEach((node) => {
    if (isFrame(node) || isInstance(node) || isComponent(node)) {
      const child = node.children[0];
      let {
        layoutMode,
        primaryAxisSizingMode,
        counterAxisSizingMode,
        primaryAxisAlignItems,
        counterAxisAlignItems,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
        itemSpacing,
        clipsContent,
        fillStyleId,
        strokeStyleId,
        strokeWeight,
        strokeJoin,
        strokeAlign,
        cornerRadius,
      } = node;
      let oldAttributes = {
        layoutMode,
        primaryAxisSizingMode,
        counterAxisSizingMode,
        primaryAxisAlignItems,
        counterAxisAlignItems,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
        itemSpacing,
        clipsContent,
        fillStyleId,
        strokeStyleId,
        strokeWeight,
        strokeJoin,
        strokeAlign,
        cornerRadius,
      };
      let width = node.width;
      let height = node.height;
      if (isFrame(child) || isInstance(child)) {
        for (const key in oldAttributes) {
          child[key] = oldAttributes[key];
        }
        child.resize(width, height);
      }
    }
  });
};
export default copyAttributesToChild;
