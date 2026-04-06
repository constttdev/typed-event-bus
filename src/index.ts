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

    const count = listeners[event].length;
    const max = getSetting("maxEventWarning")?.value ?? 32;

    if (count > max) {
      sendWarning(
        `WARNING: MAX EVENTS REACHED | CURRENT NUMBER OF EVENT: ${count} (TO INCREASE THE VALUE OF THE WARNING PLEASE EDIT THE "maxEventWarning" SETTING)`,
      );
    }
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

    for (let i = 0; i < normal.length; i++) normal[i](data); // Cannot invoke an object which is possibly 'undefined'.
    for (let i = 0; i < wildcard.length; i++) wildcard[i](data); // Cannot invoke an object which is possibly 'undefined'.

    if (getSetting("debug")?.value == true) {
      if (getSetting("colordDebugMessages")?.value == true) {
        sendSuccess(`DEBUG: EMITTED EVENT | ${event}`);
      } else {
        sendDefault(`DEBUG: EMITTED EVENT | ${event}`);
      }
    }
  }

  function once(event: string, fn: (data?: any) => void | Promise<void>) {
    const wrapper = async (data?: any) => {
      await fn(data); // run original listener
      off(event, wrapper); // remove wrapper after first call
    };
    on(event, wrapper);

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
