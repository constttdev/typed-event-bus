# Typed Event Bus

[![GNU License](https://img.shields.io/badge/license-%20%20GNU%20GPLv3%20-green?style=plastic)](https://choosealicense.com/licenses/gpl-3.0/)

A typed event bus that adds types, warnings and settings as a typed version of the already exsisting Event Bus from node.js

## Installation

Install typed-event-bus with npm

```bash
  npm install typed-event-bus
```

## Usage/Examples

### Create a new event bus

```javascript
import { createBus } from "typed-event-bus";

const bus = createBus();

bus.on("user:login", () => {
  console.log("A user logged in!");
});

bus.emit("user:login");
```

### Set a specific setting

```javascript
import { setSettingValue } from "typed-event-bus";

setSettingValue("setting_name_here", value_here);

// Example: setSettingValue("debug", true)
```

## Authors

- [@constttdev](https://www.github.com/constttdev)

## Support

For support, please either create an issue on the github repository or ask in #help on [my discord server](https://constt.de/r/discord)

## Feedback

If you have any feedback, please create a new post on [my discord server](https://constt.de/r/discord)
