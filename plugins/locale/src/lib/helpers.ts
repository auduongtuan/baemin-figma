import { get } from "lodash-es";
import { format, compareDesc, compareAsc } from "date-fns";
export function removeVietnameseAccent(str: string) {
  // remove accents
  var from =
      "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
    to =
      "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }
  return str;
}
export function copyToClipboard(value: string) {
  try {
    // @ts-ignore
    if (window.copy) {
      // @ts-ignore
      window.copy(value);
    } else {
      const area = document.createElement("textarea");
      document.body.appendChild(area);
      area.value = value;
      // area.focus();
      area.select();
      const result = document.execCommand("copy");
      document.body.removeChild(area);
      if (!result) {
        throw new Error();
      }
    }
  } catch (e) {
    console.error(`Unable to copy the value: ${value}`);
    return false;
  }
  return true;
}
export function clipWithSelection(text) {
  const node = document.createTextNode(text),
    selection = window.getSelection(),
    range = document.createRange();
  let clone = null;

  if (selection.rangeCount > 0) {
    clone = selection.getRangeAt(selection.rangeCount - 1).cloneRange();
  }

  document.body.appendChild(node);
  selection.removeAllRanges();
  range.selectNodeContents(node);
  selection.addRange(range);
  document.execCommand("copy");

  selection.removeAllRanges();
  document.body.removeChild(node);

  if (clone !== null) {
    selection.addRange(clone);
  }
}

export function copyToClipboardAsync(value: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(value);
  }
  return Promise.reject(`Clipboard API is NOT supported in the browser`);
}

/*
 * Replaces placeholders with real content
 * Requires get() - https://vanillajstoolkit.com/helpers/get/
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param {String} template The template string
 * @param {String} local    A local placeholder to use, if any
 */
export const placeholders = function (
  template: (() => string) | string,
  data: Object
): string {
  "use strict";

  // Check if the template is a string or a function
  let _template: string =
    typeof template === "function" ? template() : template;
  if (["string", "number"].indexOf(typeof template) === -1)
    throw "PlaceholdersJS: please provide a valid template";

  // If no data, return template as-is
  if (!data) return _template;

  // Replace our curly braces with data
  _template = _template.replace(/\{\{([^}]+)\}\}/g, function (match) {
    // Remove the wrapping curly braces
    match = match.slice(2, -2);

    // Get the value
    var val = get(data, match.trim());

    // Replace
    if (val === undefined || val === null) return "{{" + match + "}}";
    return val;
  });

  return _template;
};

export function findMatches(regex: RegExp, str: string, matches = []) {
  const res = regex.exec(str);
  res && matches.push(res) && findMatches(regex, str, matches);
  return matches;
}

export function matchAll(re: RegExp, str: string) {
  re = new RegExp(re, "g");
  let match: RegExpExecArray;
  let matches: RegExpExecArray[] = [];
  while ((match = re.exec(str))) matches.push(match);
  return matches;
}

export const flat = (object: Object) => {
  let res = {};
  const recurse = (obj: Object, current) => {
    for (const key in obj) {
      let value = obj[key];
      let newKey = current ? current + "." + key : key;
      if (value && typeof value === "object") {
        recurse(value, newKey);
      } else {
        res[newKey] = value;
      }
    }
  };
  recurse(object, "");
  return res;
};

export const compareTimeDesc = (a: string, b: string) => {
  return compareDesc(new Date(a), new Date(b));
};
export const compareTimeAsc = (a: string, b: string) => {
  return compareAsc(new Date(a), new Date(b));
};
export function defaultDateTimeFormat(dateString?: Date | string) {
  const date = dateString ? new Date(dateString) : new Date();
  return format(date, "yyyy/MM/dd HH:mm:ss");
}

export function stripTags(str: string) {
  return str.replace(/(<([^>]+)>)/gi, "");
}
export function isNumeric(str: string | number) {
  if (typeof str === "number") return true;
  if (typeof str !== "string") return false;
  return /^\d+$/.test(str);
}
export function formatNumber(
  number: number | string,
  decimalSep = ".",
  thousandSep = ","
) {
  return number
    .toString()
    .replace(".", "$")
    .replace(/(\d)(?=(\d{3})+(?:\$\d+)?$)/g, `$1${thousandSep}`)
    .replace("$", decimalSep);
}
