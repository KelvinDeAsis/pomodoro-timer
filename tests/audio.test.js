import test from 'node:test';
import assert from 'node:assert/strict';
import AudioEngine from '../src/services/audio.js';

function fakeAudio() {
  const nodes = [];
  const context = {
    state: 'running', currentTime: 0, destination: {},
    createOscillator() { const node = { frequency: {}, starts: [], stops: [], connect() { return this; }, disconnect() {}, start(t) { this.starts.push(t); }, stop(t) { this.stops.push(t); } }; nodes.push(node); return node; },
    createGain() { return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime() {} }, connect() { return this; }, disconnect() {} }; },
  };
  const engine = new AudioEngine(); engine.context = context;
  return { engine, nodes };
}
function clock(run) {
  const original = { now: Date.now, timeout: globalThis.setTimeout, interval: globalThis.setInterval, clearTimeout: globalThis.clearTimeout, clearInterval: globalThis.clearInterval };
  let now = 100000; let id = 0; const jobs = new Map();
  Date.now = () => now;
  globalThis.setTimeout = (fn, delay) => { jobs.set(++id, { fn, at: now + delay, repeat: 0 }); return id; };
  globalThis.setInterval = (fn, delay) => { jobs.set(++id, { fn, at: now + delay, repeat: delay }); return id; };
  globalThis.clearInterval = globalThis.clearTimeout = id => jobs.delete(id);
  const advance = ms => {
    const end = now + ms;
    while (true) { const next = [...jobs].filter(([, job]) => job.at <= end).sort((a, b) => a[1].at - b[1].at)[0]; if (!next) break; const [key, job] = next; now = job.at; if (job.repeat) job.at += job.repeat; else jobs.delete(key); job.fn(); }
    now = end;
  };
  try { run({ advance, jobs }); }
  finally { Date.now = original.now; globalThis.setTimeout = original.timeout; globalThis.setInterval = original.interval; globalThis.clearTimeout = original.clearTimeout; globalThis.clearInterval = original.clearInterval; }
}

test('alert repeats then stops after exactly its 60-second window', () => clock(({ advance, jobs }) => {
  const { engine, nodes } = fakeAudio(); engine.startAlert(Date.now() + 60000);
  assert.equal(nodes.length, 3); assert.equal(engine.ducked, true);
  advance(59000); assert.equal(nodes.length, 60); assert.equal(engine.ducked, true);
  advance(1000); assert.equal(engine.ducked, false); assert.equal(jobs.size, 0);
  const count = nodes.length; advance(60000); assert.equal(nodes.length, count);
}));
test('Stop alert cancels scheduled nodes and restores mixer immediately', () => clock(({ advance, jobs }) => {
  const { engine, nodes } = fakeAudio(); engine.startAlert(Date.now() + 60000); engine.stopAlert();
  assert.equal(jobs.size, 0); assert.equal(engine.ducked, false); assert.ok(nodes.every(node => node.stops.at(-1) === undefined));
  advance(60000); assert.equal(nodes.length, 3);
}));
test('new alert cancels old scheduling rather than overlapping', () => clock(({ jobs }) => {
  const { engine, nodes } = fakeAudio(); engine.startAlert(Date.now() + 60000); engine.startAlert(Date.now() + 60000);
  assert.equal(jobs.size, 2); assert.ok(nodes.slice(0, 3).every(node => node.stops.at(-1) === undefined)); engine.stopAlert();
}));
test('expired or blocked alerts do not schedule audio', () => clock(({ jobs }) => {
  const { engine, nodes } = fakeAudio(); engine.startAlert(Date.now() - 1); assert.equal(jobs.size, 0); assert.equal(nodes.length, 0);
  engine.context.state = 'suspended'; engine.chime(Date.now() + 60000); assert.equal(nodes.length, 0);
}));
test('independent volume buses duck and restore without changing saved volumes', () => {
  const { engine } = fakeAudio(); const values = { jazz: [], brown: [] };
  for (const key of ['jazz', 'brown']) engine[key] = { gain: { gain: { setTargetAtTime: value => values[key].push(value) } } };
  engine.enabled = { jazz: true, brown: true }; engine.setVolumes({ jazzVolume: 40, brownVolume: 20, alertVolume: 50 });
  assert.equal(values.jazz.at(-1), .4); assert.equal(values.brown.at(-1), .2);
  engine.ducked = true; engine.mix(); assert.ok(Math.abs(values.jazz.at(-1) - .08) < 1e-9);
  engine.stopAlert(); assert.equal(values.jazz.at(-1), .4); assert.equal(values.brown.at(-1), .2);
});
