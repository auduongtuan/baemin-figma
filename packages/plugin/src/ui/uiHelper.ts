import { Command } from "../lib/localeData";
export const postData = (data: { [key: string]: any }) => {
  parent.postMessage({ pluginMessage: data }, "*");
};

export const runCommand = (type: Command, data: { [key: string]: any } = {}) => {
  parent.postMessage({ pluginMessage: {
    type: type,
    ...data
  } }, "*");
}
