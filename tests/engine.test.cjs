// Source-level regression tests for the 3D engine and page fixes.
// The engine needs WebGL to run, so these assert the structure of the shipped
// code directly; `npm run build` covers type/compile correctness.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..', 'src');
const engine = fs.readFileSync(path.join(SRC, 'lib', 'ThreeEngine.ts'), 'utf8');
const page = fs.readFileSync(path.join(SRC, 'app', 'page.tsx'), 'utf8');

const sliceBetween = (src, from, to) => {
  const a = src.indexOf(from);
  const b = src.indexOf(to, a + from.length);
  assert.ok(a >= 0 && b > a, `markers not found: ${from} .. ${to}`);
  return src.slice(a, b);
};

test('lights are created once in the constructor, not on every room teleport', () => {
  const buildRoom = sliceBetween(engine, 'private buildRoom', 'private addDoor');
  assert.ok(!buildRoom.includes('AmbientLight') && !buildRoom.includes('DirectionalLight'),
    'buildRoom must not add lights - they accumulated with every teleport, overexposing the scene');
  const ctor = sliceBetween(engine, 'constructor(canvas', 'private onLockChange');
  assert.ok(ctor.includes('AmbientLight') && ctor.includes('DirectionalLight'),
    'lights should be created once when the engine starts');
});

test('room rebuild disposes geometries, materials and textures', () => {
  const buildRoom = sliceBetween(engine, 'private buildRoom', 'private addDoor');
  assert.ok(buildRoom.includes('this.disposeObject('), 'room teardown must dispose GPU resources');
  const helper = sliceBetween(engine, 'private disposeObject', 'private buildRoom');
  assert.ok(helper.includes('.geometry.dispose()'), 'geometries must be disposed');
  assert.ok(helper.includes('.map.dispose()') || helper.includes('map?.dispose()'), 'textures must be disposed');
  assert.ok(helper.includes('m.dispose()'), 'materials must be disposed');
});

test('contact room shows real contact details, not placeholders', () => {
  assert.ok(!engine.includes('email@example.com'), 'placeholder email still present');
  assert.ok(!engine.includes("'@username'"), 'placeholder handle still present');
  assert.ok(!engine.includes('github.com/user'), 'placeholder GitHub link still present');
  assert.ok(engine.includes('github.com/sourav-bwn'), 'real GitHub profile missing');
  assert.ok(engine.includes('souravgarai.bwn@gmail.com'), 'current email missing');
  assert.ok(!engine.includes('sg5517419@gmail.com'), 'stale pre-rename email must not be published');
  const contact = sliceBetween(engine, 'private buildContact', '// Bench');
  const m = contact.match(/makeLabel\(c\.text, 0, c\.y, -5\.4, ([\d.]+)\)/);
  assert.ok(m, 'contact card label call not found');
  assert.ok(parseFloat(m[1]) >= 0.3, `card labels too small to read (size ${m[1]}); text must fill the card`);
});

test('label text is fitted to its canvas instead of overflowing', () => {
  const label = sliceBetween(engine, 'function makeLabel', 'export class ThreeEngine');
  assert.ok(label.includes('measureText'), 'makeLabel must measure and shrink long text to fit the canvas');
});

test('project modal never renders a dead "Open Project" link', () => {
  assert.ok(!page.includes("selectedProject.projectUrl || '#'"), 'dead fallback href="#" still rendered');
  assert.ok(page.includes("selectedProject.projectUrl !== '#'"), 'link must be hidden when no real URL exists');
});

test('pointer lock is requested in exactly one place (the engine)', () => {
  assert.ok(!page.includes('requestPointerLock'), 'page must not request pointer lock directly');
  assert.ok(engine.includes('this.controls.lock()'), 'engine must still lock on canvas click');
});
