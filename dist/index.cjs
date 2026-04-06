"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createBus: () => createBus
});
module.exports = __toCommonJS(index_exports);

// src/utils/consoleUtils.ts
var COLORS = [
  { name: "green", r: 0, g: 255, b: 0 },
  { name: "red", r: 255, g: 0, b: 0 },
  { name: "yellow", r: 255, g: 255, b: 0 },
  { name: "blue", r: 0, g: 0, b: 255 },
  { name: "cyan", r: 0, g: 255, b: 255 },
  { name: "magenta", r: 255, g: 0, b: 255 },
  { name: "white", r: 255, g: 255, b: 255 },
  { name: "gray", r: 136, g: 136, b: 136 }
];
function rgbToAnsi({ r, g, b }) {
  return `\x1B[38;2;${r};${g};${b}m`;
}
var RESET = "\x1B[0m";
function sendMessage(message, color) {
  const c = color ? COLORS.find((col) => col.name === color) : void 0;
  const coloredMessage = c ? `${rgbToAnsi(c)}${message}${RESET}` : message;
  console.log(coloredMessage);
}
function sendWarning(message) {
  sendMessage(message, "yellow");
}
function sendSuccess(message) {
  sendMessage(message, "green");
}
function sendDefault(message) {
  console.log(message);
}

// src/utils/settingsUtils.ts
var SETTINGS = [
  {
    name: "debug",
    defaultValue: false,
    description: "Will log extra info while using this library"
  },
  {
    name: "colordDebugMessages",
    defaultValue: true,
    description: "Will make debugging messages colored"
  },
  {
    name: "verbose",
    defaultValue: true,
    description: "Enables verbose logging"
  },
  {
    name: "maxEventWarning",
    defaultValue: 32,
    description: "Displays an warning when having too many registered events"
  }
];
var runtimeSettings = SETTINGS.map((s) => ({ ...s }));
function getSetting(setting) {
  const s = runtimeSettings.find((s2) => s2.name === setting);
  if (s && s.value === void 0) s.value = s.defaultValue;
  return s;
}

// src/index.ts
function createBus() {
  const listeners = {};
  function on(event, fn) {
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
        `WARNING: MAX EVENTS REACHED | CURRENT NUMBER OF EVENT: ${count} (TO INCREASE THE VALUE OF THE WARNING PLEASE EDIT THE "maxEventWarning" SETTING)`
      );
    }
  }
  function off(event, fn) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter((f) => f !== fn);
    if (getSetting("debug")?.value == true) {
      if (getSetting("colordDebugMessages")?.value == true) {
        sendSuccess(`DEBUG: REMOVED EVENT | ${event} = ${fn}`);
      } else {
        sendDefault(`DEBUG: REMOVED EVENT | ${event} = ${fn}`);
      }
    }
  }
  async function emit(event, data) {
    const normal = listeners[event] ?? [];
    const wildcard = listeners["*"] ?? [];
    for (let i = 0; i < normal.length; i++) normal[i](data);
    for (let i = 0; i < wildcard.length; i++) wildcard[i](data);
    if (getSetting("debug")?.value) {
      if (getSetting("colordDebugMessages")?.value) {
        sendSuccess(`DEBUG: EMITTED EVENT | ${event}`);
      } else {
        sendDefault(`DEBUG: EMITTED EVENT | ${event}`);
      }
    }
  }
  function once(event, fn) {
    const wrapper = async (data) => {
      await fn(data);
      off(event, wrapper);
    };
    on(event, wrapper);
    if (getSetting("debug")?.value == true) {
      if (getSetting("colordDebugMessages")?.value == true) {
        sendSuccess(`DEBUG: ONCE TRIGGERED | ${event} = ${fn}`);
      } else {
        sendDefault(`DEBUG: ONCE TRIGGERED | ${event} = ${fn}`);
      }
    }
  }
  return { on, off, emit, once };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createBus
});
