export function safeFileBase(fileName) {
  return (
    fileName
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "brain-analysis"
  );
}

export function uniqueBaseName(fileName, index, allNames) {
  const base = safeFileBase(fileName);
  const previousCount = allNames
    .slice(0, index)
    .filter((name) => safeFileBase(name) === base).length;
  return previousCount > 0 ? `${base}-${previousCount + 1}` : base;
}

export function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function tiffDecodeNotes(pageCount) {
  const notes = ["TIFF decoded locally in the browser."];
  if (pageCount > 1) {
    notes.push(`Multi-page TIFF: page 1 of ${pageCount} was analyzed.`);
  }
  return notes;
}
