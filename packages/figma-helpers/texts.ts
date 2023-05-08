export function loadFonts(fontNames: FontName[], callback: Function) {
  Promise.all(
    fontNames.map((fontName: FontName) => figma.loadFontAsync(fontName))
  ).then(() => {
    callback();
  });
}
