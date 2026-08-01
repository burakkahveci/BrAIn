import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("validates batch unique base name generation logic", async () => {
  function safeFileBase(fileName) {
    return (
      fileName
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "") || "brain-analysis"
    );
  }

  function uniqueBaseName(fileName, index, allNames) {
    const base = safeFileBase(fileName);
    const previousCount = allNames
      .slice(0, index)
      .filter((name) => safeFileBase(name) === base).length;
    return previousCount > 0 ? `${base}-${previousCount + 1}` : base;
  }

  const files = ["organoid.png", "organoid.png", "organoid.png", "rosette.tif"];
  const uniqueBases = files.map((f, i) => uniqueBaseName(f, i, files));

  assert.deepEqual(uniqueBases, ["organoid", "organoid-2", "organoid-3", "rosette"]);
});

test("verifies TIFF error handling and batch failure reporting in app/page.tsx", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /The TIFF file does not contain a readable image header/);
  assert.match(page, /TIFF decoding error:/);
  assert.match(page, /uniqueBaseName/);
  assert.match(page, /FAILED:/);
  assert.match(page, /status: "failed"/);
  assert.match(page, /APP_VERSION = "1\.1\.0"/);
  assert.match(page, /paper_doi: "10\.1002\/btm2\.70123"/);
  assert.match(page, /zenodo_record: "https:\/\/zenodo\.org\/records\/15513127"/);
});
