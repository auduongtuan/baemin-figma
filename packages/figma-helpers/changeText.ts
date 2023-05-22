export function loadFonts(fontNames: FontName[], callback: Function = null) {
  Promise.allSettled(
    fontNames.map((fontName: FontName) => figma.loadFontAsync(fontName))
  ).then(() => {
    if (callback) callback();
  });
}
const changeText = (function () {
  let loadedFonts = new Set<FontName>();
  function loadFontsToSet(fontNames: FontName[], callback: Function = null) {
    loadFonts(fontNames, () => {
      fontNames.forEach((fontName) => loadedFonts.add(fontName));
      if (callback) callback();
    });
  }
  function change(
    text: TextNode,
    characters: string,
    callback = (Function = null)
  ) {
    if (typeof characters != "string") return;
    const fontNames = text.getRangeAllFontNames(0, text.characters.length);
    const unloadedFontNames = fontNames.filter(
      (fontName) => !loadedFonts.has(fontName)
    );
    if (unloadedFontNames.length) {
      loadFontsToSet(unloadedFontNames, () => {
        text.characters = characters;
        if (callback) callback();
      });
    } else {
      text.characters = characters;
    }
  }
  return Object.assign(change, {
    loadFonts: loadFontsToSet,
  });
})();

export default changeText;
