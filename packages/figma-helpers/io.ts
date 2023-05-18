interface Message extends Data {
  type: string;
}
type Data = { [key: string]: any };
type Handler = (data?: Omit<Message, "type">) => any | Promise<any>;
declare var figma: any;
export function createInterface(isFigma: boolean) {
  let instance = {
    listeners: {},
  };
  const getInstance = () => {
    return instance;
  };
  const receive = (msg: Message) => {
    if (msg && msg.type) {
      emit(msg.type, msg);
    }
  };
  if (isFigma) {
    figma.ui.onmessage = (msg: Message) => receive(msg);
  } else {
    window.onmessage = (msg: Message) => receive(msg.data.pluginMessage);
  }
  const send = (type: string, data: { [key: string]: any } = {}) => {
    const postData = {
      type,
      ...data,
    };
    if (isFigma) {
      figma.ui.postMessage(postData);
    } else {
      window.parent.postMessage({ pluginMessage: postData }, "*");
    }
  };
  const emit = async (type: string, data: { [key: string]: any }) => {
    if (type in instance.listeners) {
      const handlers: Function[] = instance.listeners[type];
      handlers.forEach(async (cb) => {
        const isAsync = cb.constructor.name === "AsyncFunction";
        if (isAsync) {
          await cb(data);
        } else {
          cb(data);
        }
      });
    }
  };
  const once = (type: string, handler: Handler) => {
    const cb = (data: any) => {
      if (handler.constructor.name === "AsyncFunction") {
        handler(data).then(() => {
          removeListener(type, cb);
        });
        return;
      } else {
        handler(data);
        removeListener(type, cb);
      }
    };
    addListener(type, cb);
  };
  const addListener = (type: string, handler: Handler) => {
    if (!(type in instance.listeners)) {
      instance.listeners[type] = [];
    }
    instance.listeners[type].push(handler);
  };
  const removeListener = (type: string, handler: Handler) => {
    if (type in instance.listeners) {
      const handlers: Function[] = instance.listeners[type];
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      } else {
        console.warn("Handler not found");
      }
    }
  };
  return {
    getInstance,
    emit,
    addListener,
    send,
    on: addListener,
    once,
  };
}
const io = createInterface(typeof figma !== "undefined");
export default io;
