import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const output = path.join(root, "out");

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    }),
  );
  return nested.flat();
}

test("exports every BrAIn route for GitHub Pages", async () => {
  const routes = ["index.html", "about/index.html", "paper/index.html", "licensing/index.html", "team/index.html"];

  for (const route of routes) {
    const routeStat = await stat(path.join(output, route));
    assert.ok(routeStat.isFile(), `${route} should be a static HTML file`);
  }
});

test("prefixes navigation and browser assets with the repository path", async () => {
  const htmlFiles = (await listFiles(output)).filter((file) => file.endsWith(".html"));
  const html = (await Promise.all(htmlFiles.map((file) => readFile(file, "utf8")))).join("\n");

  assert.match(html, /\/BrAIn\/_next\//);
  assert.match(html, /href="\/BrAIn\/about\/"/);
  assert.match(html, /src="\/BrAIn\/team\/burak-kahveci\.jpeg"/);
  assert.doesNotMatch(html, /(?:href|src)="\/(?:_next|models|ort|samples|team)\//);

  const javascriptFiles = (await listFiles(path.join(output, "_next"))).filter((file) =>
    file.endsWith(".js"),
  );
  const javascript = (
    await Promise.all(javascriptFiles.map((file) => readFile(file, "utf8")))
  ).join("\n");

  assert.match(javascript, /["']\/BrAIn["']/);
  assert.match(javascript, /\/models\/bo_fp32\.onnx/);
  assert.match(javascript, /\/ort\/ort-wasm-simd-threaded\.wasm/);
});

test("copies complete model and ONNX Runtime files", async () => {
  const assets = [
    "models/bo_fp32.weights-0.bin",
    "models/eb_fp32.weights-0.bin",
    "models/budding_normal_fp32.onnx",
    "models/rosette_fp32.weights-0.bin",
    "ort/ort-wasm-simd-threaded.wasm",
  ];

  for (const asset of assets) {
    const sourceStat = await stat(path.join(root, "public", asset));
    const outputStat = await stat(path.join(output, asset));
    assert.equal(outputStat.size, sourceStat.size, `${asset} should be copied without truncation`);
  }
});
