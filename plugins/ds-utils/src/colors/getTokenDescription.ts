function getTokenDescription(name: string) {
  const parts = name.split(".");
  const type = parts[0];
  const labels = {
    fg: "texts and icons",
    border: "border",
    bg: "background",
  };
  let role = parts[1];
  const roleAlt = {
    error: ["negative"],
    success: ["positive"],
    primary: ["brand"],
    warning: ["attentive"],
    new: ["updated"],
    subtle: ["weak"],
    // "weakest": ["placeholder"]
  };
  if (role in roleAlt) {
    role = [role, ...roleAlt[role]].join(", ");
    if (role == "onColor") {
      role = "on-color-background";
    }
  }
  const suffixs = {
    "bg.emphasis": " like tooltips",
    "bg.backdrop": " like dialog backdrop",
    "bg.overlay": " like image/video overlay",
    "fg.strong": ", and headings",
    "fg.secondary": " like help texts, subtexts, subheadings, and subtitles",
    "fg.tertiary": " like labels, and control icons",
    "fg.subtle": " like placeholder texts",
    "border.action": " like inputs or buttons",
    "border.modal": " like popups (popover), dialogs, dropdown menus",
    "border.default": " like containers/boxes",
  };
  function getSuffix(name: string): string {
    if (name in suffixs) {
      return suffixs[name];
    } else {
      for (const key in suffixs) {
        if (key.includes(name)) {
          return suffixs[key];
        }
      }
    }
    return "";
  }
  const interaction = parts.length >= 1 ? parts.slice(-1)[0] : "";
  const states = {
    default: " in rest state",
    hover: " in hover state",
    disabled: " in disabled state",
    pressed: " in pressed, active state",
  };
  let description = "";
  if (role && (type == "fg" || type == "bg" || type == "border")) {
    description =
      ["Used for", role, labels[type]].join(" ") +
      getSuffix(name) +
      (interaction in states && parts.length > 2 ? states[interaction] : "") +
      ".";
  }
  return description;
}
export default getTokenDescription;
