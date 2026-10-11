const path = require("path");

// pdfjs-dist ships as an ES module, so it is loaded with a dynamic import and cached.
let pdfjsPromise;
const loadPdfjs = () => (pdfjsPromise ??= import("pdfjs-dist/legacy/build/pdf.mjs"));

// Font and character-map data pdf.js needs to decode standard PDF fonts.
const PDFJS_ROOT = path.dirname(require.resolve("pdfjs-dist/package.json"));
const FONT_OPTIONS = {
  standardFontDataUrl: path.join(PDFJS_ROOT, "standard_fonts") + "/",
  cMapUrl: path.join(PDFJS_ROOT, "cmaps") + "/",
  cMapPacked: true,
};

// Returns the plain text of a PDF buffer, or an empty string if it has none.
async function extractText(buffer) {
  const pdfjs = await loadPdfjs();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer), ...FONT_OPTIONS });
  const doc = await loadingTask.promise;

  try {
    const pages = [];
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => item.str ?? "").join(" "));
    }
    return pages.join("\n").trim();
  } finally {
    await loadingTask.destroy();
  }
}

module.exports = { extractText };
