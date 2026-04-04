import { sendDefault, sendSuccess, sendWarning } from "./utils/consoleUtils.js";
import { getSetting } from "./utils/settingsUtils.js";

export function createBus() {
  const listeners: Record<
    string,
    Array<(data?: any) => void | Promise<void>>
  > = {}; // Listeners

  function on(event: string, fn: (data?: any) => void | Promise<void>) {
    if (!listeners[event]) listeners[event] = [];

    if (getSetting("debug")?.value == true) {
      if (getSetting("colordDebugMessages")?.value == true) {
        sendSuccess(`DEBUG: ADDED EVENT | ${event} = ${fn}`);
      } else {
        sendDefault(`DEBUG: ADDED EVENT | ${event} = ${fn}`);
      }
    }

    listeners[event].push(fn);
  } // on event function

  function off(event: string, fn: (data?: any) => void | Promise<void>) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter((f) => f !== fn);

    if (getSetting("debug")?.value == true) {
      if (getSetting("colordDebugMessages")?.value == true) {
        sendSuccess(`DEBUG: REMOVED EVENT | ${event} = ${fn}`);
      } else {
        sendDefault(`DEBUG: REMOVED EVENT | ${event} = ${fn}`);
      }
    }
  } // off event function

  async function emit(event: string, data?: any) {
    const normal = listeners[event] || [];
    const wildcard = listeners["*"] || [];

    if (!listeners[event]) return;
    // use Promise.all to wait for all listeners
    await Promise.all(listeners[event].map((fn) => fn(data)));

    await Promise.all(wildcard.map((fn) => fn(data)));

    if (getSetting("debug")?.value == true) {
      if (getSetting("colordDebugMessages")?.value == true) {
        sendSuccess(`DEBUG: EMITTED EVENT | ${event}`);
      } else {
        sendDefault(`DEBUG: EMITTED EVENT | ${event}`);
      }
    }
  } // emit an event

  function once(event: string, fn: (data?: any) => void | Promise<void>) {
    const wrapper = async (data?: any) => {
      await fn(data); // run original listener
      off(event, wrapper); // remove wrapper after first call
    };
    on(event, wrapper);

    // max event waring
    const count = listeners[event]?.length || 0;

    if (count > getSetting("maxEventWarning")?.value) {
      sendWarning(
        `WARNING: MAX EVENTS REACHED | CURRENT NUMBER OF EVENT: ${listeners.lenght} (TO INCREASE THE VALUE OF THE WARNING PLEASE EDIT THE "maxEventWarning" SETTING)`,
      );
    }

    if (getSetting("debug")?.value == true) {
      if (getSetting("colordDebugMessages")?.value == true) {
        sendSuccess(`DEBUG: ONCE TRIGGERED | ${event} = ${fn}`);
      } else {
        sendDefault(`DEBUG: ONCE TRIGGERED | ${event} = ${fn}`);
      }
    }
  } // once event function
  return { on, off, emit, once }; // return all values
}
