const configs = (function () {
  let configs = {};

  function set(name: string, value: any) {
    configs[name] = value;
    figma.clientStorage.setAsync("configs", configs);
  }
  function getAll() {
    return { ...configs };
  }
  function get(name: string) {
    return configs[name];
  }
  function init(configValues: { [key: string]: any }) {
    configs = { ...configValues };
    figma.clientStorage.setAsync("configs", configs);
  }
  return {
    configs,
    init,
    get,
    getAll,
    set,
  };
})();
export default configs;
