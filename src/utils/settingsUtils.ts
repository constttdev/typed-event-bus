const SETTINGS = [
  {
    name: "debug",
    defaultValue: false,
    description: "Will log extra info while using this library",
  },
  {
    name: "colordDebugMessages",
    defaultValue: true,
    description: "Will make debugging messages colored",
  },
  {
    name: "verbose",
    defaultValue: true,
    description: "Enables verbose logging",
  },
  {
    name: "maxEventWarning",
    defaultValue: 32,
    description: "Displays an warning when having too many registered events",
  },
] as const;

type SettingName = (typeof SETTINGS)[number]["name"];

type SETTING = {
  name: SettingName;
  value?: any;
  defaultValue: any;
  description: string;
};

const runtimeSettings: SETTING[] = SETTINGS.map((s) => ({ ...s }));

function getSetting(setting: SettingName): SETTING | undefined {
  const s = runtimeSettings.find((s) => s.name === setting);
  if (s && s.value === undefined) s.value = s.defaultValue;
  return s;
}

function setSettingValue(setting: SettingName, value: any) {
  const s = runtimeSettings.find((s) => s.name === setting);
  if (s) s.value = value;
  else {
    if (getSetting("debug")?.value) {
      throw new Error(
        `Setting "${setting}" not found | VALUE: ${value} | Available: ${SETTINGS.map((s) => s.name).join(", ")}`,
      );
    } else {
      throw new Error(`Setting "${setting}" not found`);
    }
  }
}

function getSettingValue(setting: SettingName): any {
  const s = getSetting(setting);
  return s ? s.value : undefined;
}

export { getSetting, getSettingValue, setSettingValue };
