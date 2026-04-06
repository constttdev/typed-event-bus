import { EventEmitter } from "events";
import { performance } from "perf_hooks";
import { createBus } from "../index.js"; // adjust path to your bus
import Table from "cli-table3";
import Chart from "ascii-chart";
import chalk from "chalk";

const ITERATIONS = 100_000;

interface Result {
  name: string;
  time: number;
  calls: number;
}

const results: Result[] = [];

function logResult(name: string, time: number, calls: number) {
  results.push({ name, time, calls });
}

// ----------------------
// Sync benchmark
// ----------------------
function benchmarkSync() {
  const bus = createBus();
  const emitter = new EventEmitter();

  let callsBus = 0;
  let callsNative = 0;

  bus.on("tick", () => callsBus++);
  emitter.on("tick", () => callsNative++);

  let t0 = performance.now();
  for (let i = 0; i < ITERATIONS; i++) bus.emit("tick");
  let t1 = performance.now();
  logResult("TypedEventBus sync", t1 - t0, callsBus);

  t0 = performance.now();
  for (let i = 0; i < ITERATIONS; i++) emitter.emit("tick");
  t1 = performance.now();
  logResult("Native EventEmitter sync", t1 - t0, callsNative);
}

// ----------------------
// Async benchmark
// ----------------------
async function benchmarkAsync() {
  const bus = createBus();
  const emitter = new EventEmitter();

  let callsBus = 0;
  let callsNative = 0;

  bus.on("tick", async () => {
    await Promise.resolve();
    callsBus++;
  });
  emitter.on("tick", async () => {
    await Promise.resolve();
    callsNative++;
  });

  let t0 = performance.now();
  for (let i = 0; i < ITERATIONS; i++) await bus.emit("tick");
  let t1 = performance.now();
  logResult("TypedEventBus async", t1 - t0, callsBus);

  t0 = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    await new Promise<void>((res) => {
      emitter.emit("tick");
      setImmediate(res);
    });
  }
  t1 = performance.now();
  logResult("Native EventEmitter async", t1 - t0, callsNative);
}

// ----------------------
// Multiple listeners benchmark
// ----------------------
function benchmarkMultiListeners() {
  const bus = createBus();
  const emitter = new EventEmitter();

  let callsBus = 0;
  let callsNative = 0;

  for (let i = 0; i < 10; i++) {
    bus.on("multi", () => callsBus++);
    emitter.on("multi", () => callsNative++);
  }

  let t0 = performance.now();
  for (let i = 0; i < ITERATIONS; i++) bus.emit("multi");
  let t1 = performance.now();
  logResult("TypedEventBus multi-listeners", t1 - t0, callsBus);

  t0 = performance.now();
  for (let i = 0; i < ITERATIONS; i++) emitter.emit("multi");
  t1 = performance.now();
  logResult("Native EventEmitter multi-listeners", t1 - t0, callsNative);
}

// ----------------------
// Fail-Fast benchmark
// ----------------------
async function benchmarkFailFast() {
  const bus = createBus();
  let callsBus = 0;

  bus.on("boom", () => {
    throw new Error("boom");
  });
  bus.on("boom", () => callsBus++);

  const ITER = 1000;

  let t0 = performance.now();
  for (let i = 0; i < ITER; i++) {
    try {
      await bus.emit("boom");
    } catch {}
  }
  let t1 = performance.now();
  logResult("TypedEventBus fail-fast", t1 - t0, callsBus);
}

// ----------------------
// Print results
// ----------------------
function printResults() {
  // Table
  const table = new Table({
    head: ["Benchmark", "Time (ms)", "Calls"],
    colWidths: [35, 15, 10],
  });
  results.forEach((r) => table.push([r.name, r.time.toFixed(2), r.calls]));
  console.log("\nBenchmark Results:");
  console.log(table.toString());

  // Bar chart
  const times = results.map((r) => r.time);
  const maxTime = Math.max(...times);

  const scaled = times.map((t) => Math.round((t / maxTime) * 50)); // scale to 50 chars
  console.log("\nBenchmark Diagram (longer = slower):");
  scaled.forEach((val, i) => {
    const faster = results[i].time < maxTime / 2;
    const bar = chalk[faster ? "green" : "red"]("█".repeat(val));
    console.log(`${bar} ${results[i].name} (${results[i].time.toFixed(2)} ms)`);
  });
}

// ----------------------
// Run everything
// ----------------------
async function run() {
  console.log("--- Sync Benchmark ---");
  benchmarkSync();

  console.log("\n--- Async Benchmark ---");
  await benchmarkAsync();

  console.log("\n--- Multiple Listeners Benchmark ---");
  benchmarkMultiListeners();

  console.log("\n--- Fail-Fast Benchmark ---");
  await benchmarkFailFast();

  printResults();
}

run();
