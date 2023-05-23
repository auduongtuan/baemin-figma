declare var figma: any;
const configs = (function (isFigma: boolean) {
  let configs = {};
  function set<T = unknown>(name: string, value: T) {
    configs[name] = value;
  }
  function getAll<T extends {}>() {
    return { ...configs } as T;
  }

  function get<T = unknown>(name: string, defaultValue: T = null) {
    return name in configs ? configs[name] : defaultValue;
  }
  function setAll(configValues: { [key: string]: any }) {
    configs = { ...configValues };
  }
  if (isFigma) {
    async function save() {
      return await figma.clientStorage.setAsync("configs", configs).then(() => {
        return true;
      });
    }
    async function fetch(defaultValues: { [key: string]: any } = {}) {
      return figma.clientStorage.getAsync("configs").then((data) => {
        configs = { ...defaultValues, ...data };
        const promise = new Promise((resolve, reject) => {
          resolve(configs);
        });
        return promise;
      });
    }
    return {
      configs,
      setAll,
      save,
      fetch,
      get,
      getAll,
      set,
    };
  }

  return {
    configs,
    setAll,
    get,
    getAll,
    set,
  };
})(typeof figma !== "undefined");
export default configs;
