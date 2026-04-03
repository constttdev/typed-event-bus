export interface COLOR {
  name: string;
  r: number;
  g: number;
  b: number;
}

const COLORS: COLOR[] = [
  { name: "green", r: 0, g: 255, b: 0 },
  { name: "red", r: 255, g: 0, b: 0 },
  { name: "yellow", r: 255, g: 255, b: 0 },
  { name: "blue", r: 0, g: 0, b: 255 },
  { name: "cyan", r: 0, g: 255, b: 255 },
  { name: "magenta", r: 255, g: 0, b: 255 },
  { name: "white", r: 255, g: 255, b: 255 },
  { name: "gray", r: 136, g: 136, b: 136 },
];

export type ColorName = (typeof COLORS)[number]["name"];

// Converts RGB to ANSI 24-bit color code
function rgbToAnsi({ r, g, b }: COLOR): string {
  return `\x1b[38;2;${r};${g};${b}m`;
}

// Reset code
const RESET = "\x1b[0m";

function sendMessage(message: string, color?: ColorName) {
  const c = color ? COLORS.find((col) => col.name === color) : undefined;
  const coloredMessage = c ? `${rgbToAnsi(c)}${message}${RESET}` : message;
  console.log(coloredMessage);
}

function sendNeutral(message: string) {
  sendMessage(message, "green");
}

function sendWarning(message: string) {
  sendMessage(message, "yellow");
}

function sendError(message: string) {
  sendMessage(message, "red");
}

function sendInfo(message: string) {
  sendMessage(message, "blue");
}

function sendSuccess(message: string) {
  sendMessage(message, "green");
}

function sendDefault(message: string) {
  console.log(message);
}

export {
  sendMessage,
  sendNeutral,
  sendWarning,
  sendError,
  sendSuccess,
  sendInfo,
  sendDefault,
  COLORS,
};
