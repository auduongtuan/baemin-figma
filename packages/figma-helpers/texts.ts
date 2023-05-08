export function loadFonts(fontNames: FontName[], callback: Function) {
  Promise.allSettled(
    fontNames.map((fontName: FontName) => figma.loadFontAsync(fontName))
  ).then(() => {
    callback();
  });
}
