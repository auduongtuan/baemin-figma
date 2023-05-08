import designSystem from "./designSystem";
const dsFonts = [
  // {family: "Inter", style: "Regular"},
  // {family: "Inter", style: "Medium"},
  // {family: "Inter", style: "Semi Bold"},
  // {family: "Inter", style: "Bold"},
  // { family: "JetBrains Mono", style: "Regular" },
  { family: "Roboto", style: "Regular" },
  { family: "Roboto", style: "Medium" },
  { family: "Roboto", style: "SemiBold" },
  { family: "Roboto", style: "Bold" },
  { family: "Roboto Mono", style: "Regular" },
];
figma.on("run", async ({ command, parameters }: RunEvent) => {
  await Promise.all(
    dsFonts.map((fontName: FontName) => figma.loadFontAsync(fontName))
  );
  if (command in designSystem) {
    await designSystem[command]();
    figma.closePlugin();
  }
  // _.forOwn(uiCommands, async (value, key) => {
  //   if (command == key) {
  //     // console.log(value.run);
  //     if ("run" in value) value.run();
  //   }
  // });
  // _.forOwn(nonuiCommands, async (value, key) => {
  //   if (command == key) {
  //     // await value();
  //     figma.closePlugin();
  //   }
  // });
});
