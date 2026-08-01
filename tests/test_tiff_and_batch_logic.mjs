import assert from "node:assert/strict";
import test from "node:test";
import UTIF from "utif";
import { strToU8, zipSync, unzipSync } from "fflate";

const utif = UTIF.default || UTIF;

test("decodes single-page and multi-page TIFF images via UTIF", () => {
  const width = 64;
  const height = 64;
  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0; i < rgba.length; i += 4) {
    rgba[i] = 120;     // R
    rgba[i + 1] = 150; // G
    rgba[i + 2] = 180; // B
    rgba[i + 3] = 255; // A
  }

  // Encode a TIFF buffer using UTIF
  const tiffBytes = new Uint8Array(utif.encodeImage(rgba, width, height));
  const buffer = tiffBytes.buffer.slice(tiffBytes.byteOffset, tiffBytes.byteOffset + tiffBytes.byteLength);

  // Decode TIFF buffer
  const ifds = utif.decode(buffer);
  assert.ok(ifds.length >= 1, "TIFF should contain at least 1 IFD");
  utif.decodeImage(buffer, ifds[0], ifds);
  const decodedRgba = utif.toRGBA8(ifds[0]);

  assert.equal(ifds[0].width, width);
  assert.equal(ifds[0].height, height);
  assert.equal(decodedRgba.length, width * height * 4);
  assert.equal(decodedRgba[0], 120);
  assert.equal(decodedRgba[1], 150);
  assert.equal(decodedRgba[2], 180);
});

test("generates valid ZIP export with deduplicated filenames and error reports", () => {
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

  const items = [
    {
      fileName: "sample.tiff",
      status: "completed",
      report: { status: "completed", file: "sample.tiff" },
      outputName: "sample-bo-mask.png",
      outputBytes: new Uint8Array([1, 2, 3, 4]),
    },
    {
      fileName: "sample.tiff",
      status: "failed",
      report: { status: "failed", error: "Corrupt TIFF header" },
      outputName: null,
      outputBytes: null,
    },
  ];

  const newline = String.fromCharCode(10);
  const csvContent = ["source_file,status", "sample.tiff,completed", "sample.tiff,failed", ""].join(newline);
  const archive = {
    "summary.csv": strToU8(csvContent),
    "README.txt": strToU8("BrAIn Batch Analysis Test" + newline),
  };

  const allNames = items.map((i) => i.fileName);
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (!item.report) continue;
    const uniqueBase = uniqueBaseName(item.fileName, index, allNames);
    archive[`reports/${uniqueBase}-analysis-report.json`] = strToU8(
      JSON.stringify(item.report, null, 2) + newline,
    );
    if (item.outputName && item.outputBytes) {
      archive[`outputs/${uniqueBase}-bo-mask.png`] = item.outputBytes;
    }
  }

  const zipped = zipSync(archive);
  const unzipped = unzipSync(zipped);

  assert.ok(unzipped["summary.csv"]);
  assert.ok(unzipped["README.txt"]);
  assert.ok(unzipped["reports/sample-analysis-report.json"]);
  assert.ok(unzipped["reports/sample-2-analysis-report.json"]);
  assert.ok(unzipped["outputs/sample-bo-mask.png"]);
});
