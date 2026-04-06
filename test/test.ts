import assert from "assert";
import { createBus } from "../src/index.js";
import { test } from "../src/utils/testHelper.js";
import { setSettingValue } from "../src/utils/settingsUtils.js";

setSettingValue("debug", false);
setSettingValue("colordDebugMessages", false);
setSettingValue("maxEventWarning", 32); // 32 IS ALREADY DEFAULT VALUE

// synchronous test
test("emit calls listener", (t) => {
  const bus = createBus();
  let called = false;

  bus.on("login", () => {
    called = true;
  });
  bus.emit("login");

  assert.strictEqual(called, true);
});

// asynchronous test
test("async listener works", async () => {
  const bus = createBus();
  let result = 0;

  bus.on("add", async (n: number) => {
    await new Promise((res) => setTimeout(res, 10));
    result = n + 1;
  });

  await bus.emit("add", 5);
  assert.strictEqual(result, 6);
});

// callback-style test
test("off removes listener", (done) => {
  if (!done) throw new Error("done callback missing");

  const bus = createBus();
  let called = false;

  function handler() {
    called = true;
  }

  bus.on("logout", handler);
  bus.off("logout", handler);
  bus.emit("logout");

  try {
    assert.strictEqual(called, false);
    done();
  } catch (err) {
    done(err as Error);
  }
});

// max event warning test
test("max event warning displays", async () => {
  const bus = createBus();
  let calls = 0;

  for (let i = 0; i < 33; i++) {
    bus.on("add", async () => {
      await new Promise((res) => setTimeout(res, 10));
      calls++;
    });
  }

  await bus.emit("add");

  assert.strictEqual(calls, 33);
});

// add on one event crash, crash everything test
