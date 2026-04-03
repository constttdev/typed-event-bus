export function test(
  name: string,
  fn: (done?: (err?: Error) => void) => void | Promise<void>,
) {
  try {
    const maybePromise = fn((err?: Error) => {
      if (err) {
        console.error(`X | ${name} (callback)`);
        console.error(err);
      } else {
        console.log(`✓ | ${name} (callback)`);
      }
    });

    if (maybePromise && typeof maybePromise.then === "function") {
      maybePromise
        .then(() => console.log(`✓ | ${name} (async)`))
        .catch((err: any) => {
          console.error(`X | ${name} (async)`);
          console.error(err);
        });
    } else if (fn.length === 0) {
      console.log(`✓ | ${name} (sync)`);
    }
  } catch (err: any) {
    console.error(`X | ${name} (sync)`);
    console.error(err);
  }
}
