export function removeVietnameseAccent(str) {
  // remove accents
  var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
      to   = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (var i=0, l=from.length ; i < l ; i++) {
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
      const area = document.createElement('textarea');
      document.body.appendChild(area);
      area.value = value;
      // area.focus();
      area.select();
      const result = document.execCommand('copy');
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