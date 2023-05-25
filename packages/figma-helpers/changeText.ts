export function loadFonts(fontNames: FontName[]) {
  return Promise.allSettled(
    fontNames.map((fontName: FontName) => figma.loadFontAsync(fontName))
  );
}
const changeText = (function () {
  let loadedFonts = new Set<FontName>();
  function loadFontsToSet(fontNames: FontName[]) {
    return new Promise((resolve) => {
      loadFonts(fontNames).then(() => {
        fontNames.forEach((fontName) => loadedFonts.add(fontName));
        resolve(true);
      });
    });
  }
  function change(text: TextNode, characters: string) {
    if (typeof characters != "string") return;
    const fontNames = text.getRangeAllFontNames(0, text.characters.length);
    const unloadedFontNames = fontNames.filter(
      (fontName) => !loadedFonts.has(fontName)
    );
    return new Promise((resolve) => {
      if (unloadedFontNames.length) {
        loadFontsToSet(unloadedFontNames).then(() => {
          text.characters = characters;
        });
      } else {
        text.characters = characters;
      }
      resolve(true);
    });
  }
  return Object.assign(change, {
    loadFonts: loadFontsToSet,
  });
})();

export default changeText;
