export const postData = (data: { [key: string]: any }) => {
  parent.postMessage({ pluginMessage: data }, "*");
};

export const runCommand = (type, data: { [key: string]: any } = {}) => {
  parent.postMessage({ pluginMessage: {
    type: type,
    ...data
  } }, "*");
}
