import locale from "./locale";
import { loadFonts } from "figma-helpers/texts";
const dsFonts = [
  { family: "Roboto", style: "Regular" },
  { family: "Roboto", style: "Medium" },
  { family: "Roboto", style: "SemiBold" },
  { family: "Roboto", style: "Bold" },
  { family: "Roboto Mono", style: "Regular" },
  { family: "Roboto Mono", style: "Medium" },
  { family: "Roboto Mono", style: "SemiBold" },
  { family: "Roboto Mono", style: "Bold" },
];

const uiCommands = {
  locale: locale,
};

const nonuiCommands = {};

figma.ui.onmessage = (msg) => {
  Object.keys(uiCommands).forEach((key) => {
    if (figma.command == key) {
      if ("onMessage" in uiCommands[key]) uiCommands[key].onMessage(msg);
    }
  });
};

figma.on("selectionchange", async () => {
  Object.keys(uiCommands).forEach((key) => {
    if (figma.command == key) {
      if ("onSelectionChange" in uiCommands[key]) {
        uiCommands[key].onSelectionChange();
      }
    }
  });
});

figma.on("run", ({ command, parameters }: RunEvent) => {
  loadFonts(dsFonts, () => {
    Object.keys(uiCommands).forEach((key) => {
      if (command == key) {
        // console.log(value.run);
        if ("run" in uiCommands[key]) uiCommands[key].run();
      }
    });
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
