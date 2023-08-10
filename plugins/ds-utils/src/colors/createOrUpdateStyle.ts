import { webRGBToFigmaRGB, webRGB, webRGBA } from "figma-helpers/colors";
import { isEqual } from "lodash-es";
import getTokenDescription from "./getTokenDescription";

function createOrUpdateStyle(
  paintStyles: PaintStyle[],
  prefix,
  name: string,
  value: webRGB | webRGBA
) {
  let alpha: number = 1;
  if (value[3]) {
    alpha = value[3];
    value.splice(0, -1);
  }
  let figmaRgb = webRGBToFigmaRGB(value as webRGB);
  if ("a" in figmaRgb) delete figmaRgb.a;
  if ("r" in figmaRgb && "g" in figmaRgb && "b" in figmaRgb) {
    const paint: SolidPaint = {
      type: "SOLID",
      color: figmaRgb,
      opacity: alpha,
    };
    // console.log(name, figmaRgb, alpha);
    const paintStyleFound = paintStyles.find(
      (paintStyle) => paintStyle.name == prefix + "/" + name
    );
    // const paintStyle = paintStyleFound || figma.createPaintStyle();
    // if(!paintStyleFound) {
    //   figma.notify(`Cannot found ${name} style, create new one`);
    //   return;
    // }
    const paintStyle = paintStyleFound || figma.createPaintStyle();
    paintStyle.name = prefix + "/" + name;
    const description = getTokenDescription(name);
    if (paintStyle.description != description)
      paintStyle.description = description;
    // update exists
    if (paintStyleFound) {
      if (!isEqual(paintStyle.paints, [paint])) {
        // console.log("Update ", paintStyle.name);
        paintStyle.paints = [paint];
      }
    }
    // create new
    else {
      // console.log("Create ", paintStyle.name);
      paintStyle.paints = [paint];
    }
  } else {
    // console.log("Loi ", name, value, figmaRgb);
  }
}
export default createOrUpdateStyle;
