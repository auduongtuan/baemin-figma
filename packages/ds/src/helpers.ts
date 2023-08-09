/**
 * Unsecured fallback for copying text to clipboard
 * @param text - The text to be copied to the clipboard
 */
function unsecuredCopyToClipboard(text: string) {
  // // Create a textarea element
  // const textArea = document.createElement("textarea");
  // textArea.value = text;
  // document.body.appendChild(textArea);

  // // Focus and select the textarea content
  // const previousActiveElement = document.activeElement as HTMLElement;
  // textArea.focus();
  // textArea.select();

  // // Attempt to copy the text to the clipboard
  // try {
  //   document.execCommand("copy");
  // } catch (e) {
  //   console.error("Unable to copy content to clipboard!", e);
  // }
  // console.log(previousActiveElement);
  // previousActiveElement.focus();
  // // Remove the textarea element from the DOM
  // document.body.removeChild(textArea);

  function listener(e: ClipboardEvent) {
    e.clipboardData.setData("text/html", text);
    e.clipboardData.setData("text/plain", text);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  try {
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
    return true;
  } catch (err) {
    document.removeEventListener("copy", listener);
    return false;
  }
}

/**
 * Copies the text passed as param to the system clipboard
 * Check if using HTTPS and navigator.clipboard is available
 * Then uses standard clipboard API, otherwise uses fallback
 *
 * Inspired by: https://stackoverflow.com/questions/71873824/copy-text-to-clipboard-cannot-read-properties-of-undefined-reading-writetext
 * and https://forum.figma.com/t/write-to-clipboard-from-custom-plugin/11860/12
 *
 * @param content - The content to be copied to the clipboard
 */
export function copyToClipboard(content: string) {
  // If the context is secure and clipboard API is available, use it
  if (
    window.isSecureContext &&
    typeof navigator?.clipboard?.writeText === "function"
  ) {
    navigator.clipboard.writeText(content);
  }
  // Otherwise, use the unsecured fallback
  else {
    unsecuredCopyToClipboard(content);
  }
}
