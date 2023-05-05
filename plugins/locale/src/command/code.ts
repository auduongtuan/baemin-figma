import * as _ from "lodash";
import locale from "./locale";
const dsFonts = [
  { family: "Roboto", style: "Regular" },
  { family: "Roboto", style: "Medium" },
  { family: "Roboto", style: "SemiBold" },
  { family: "Roboto", style: "Bold" },
  { family: "Roboto Mono", style: "Regular" },
];

const uiCommands = {
  locale: locale,
};

const nonuiCommands = {};

figma.ui.onmessage = (msg) => {
  _.forOwn(uiCommands, (value, key) => {
    if (figma.command == key) {
      if ("onMessage" in value) value.onMessage(msg);
    }
  });
};

figma.on("selectionchange", async () => {
  _.forOwn(uiCommands, (value, key) => {
    if (figma.command == key) {
      if ("onSelectionChange" in value) {
        value.onSelectionChange();
      }
    }
  });
});

figma.on("run", async ({ command, parameters }: RunEvent) => {
  await Promise.all(
    dsFonts.map((fontName: FontName) => figma.loadFontAsync(fontName))
  );

  _.forOwn(uiCommands, async (value, key) => {
    if (command == key) {
      // console.log(value.run);
      if ("run" in value) value.run();
    }
  });
  // _.forOwn(nonuiCommands, async (value, key) => {
  //   if (command == key) {
  //     await value();
  //     figma.closePlugin();
  //   }
  // });
});

// // figma.parameters.on('input', ({ parameters, key, query, result }: ParameterInputEvent) => {
// //   switch (key) {
// //     case 'truncate_type':
// //       const truncateTypes = ['end', 'middle']
// //       result.setSuggestions(truncateTypes.filter(s => s.includes(query)))
// //       break

// //     default:
// //       return
// //   }
// // })
