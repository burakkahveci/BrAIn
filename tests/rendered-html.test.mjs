import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the BrAIn analysis platform", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>BrAIn \| AI-Based Morphology Analysis Tool for Organoids<\/title>/i,
  );
  assert.match(html, /Images stay on this device/);
  assert.match(html, /Classification/);
  assert.match(html, /Segmentation/);
  assert.match(html, /Rosette detection/);
  assert.match(html, /AI-Based Morphology Analysis Tool for Organoids/);
  assert.match(html, /href="\/about"/);
  assert.match(html, /href="\/paper"/);
  assert.match(html, /href="\/licensing"/);
  assert.match(html, /href="\/team"/);
  assert.doesNotMatch(html, /The desktop model|Local AI analysis|Move between classification/);
  assert.match(html, /BO \+ EB \+ 2 classifiers \+ rosette detection/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("serves project information as separate pages", async () => {
  const routes = [
    ["/about", "About | BrAIn", "Accessible organoid morphology analysis"],
    ["/paper", "Paper | BrAIn", "The paper behind the analysis platform"],
    ["/licensing", "Access & Licensing | BrAIn", "Use BrAIn with clarity"],
    ["/team", "Team | BrAIn", "The people behind BrAIn"],
  ];

  for (const [pathname, title, heading] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    const encodedTitle = title.replaceAll("&", "&amp;").replace("|", "\\|");
    assert.match(html, new RegExp(`<title>${encodedTitle}<\\/title>`, "i"));
    assert.match(html, new RegExp(heading, "i"));
    assert.match(html, /Open analysis tool/);
    assert.match(html, /href="\/"/);
  }
});

test("publishes clear use, licensing, citation and contact guidance", async () => {
  const response = await render("/licensing");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Academic use/);
  assert.match(html, /CC BY-SA 4\.0/);
  assert.match(html, /including commercially/);
  assert.match(html, /Share adaptations alike/);
  assert.match(html, /not presented as a medical device/i);
  assert.match(html, /Ultralytics YOLOv8/);
  assert.match(html, /AGPL-3\.0/);
  assert.match(html, /10\.1002\/btm2\.70123/);
  assert.match(html, /10\.5281\/zenodo\.15513127/);
  assert.match(html, /mailto:sinan\.guven@deu\.edu\.tr/);
  assert.match(html, /not legal advice/i);
});

test("renders About examples, paper summary and ordered team groups", async () => {
  const aboutResponse = await render("/about");
  const about = await aboutResponse.text();
  assert.match(about, /no-code, AI-based platform/i);
  assert.match(about, /\/samples\/eb\/paper-eb-01\.png/);
  assert.match(about, /\/samples\/eb\/paper-eb-01\.desktop-mask\.png/);
  assert.match(about, /\/samples\/eb\/paper-eb-02\.png/);
  assert.match(about, /\/samples\/eb\/paper-eb-02\.desktop-mask\.png/);

  const paperResponse = await render("/paper");
  const paper = await paperResponse.text();
  assert.match(paper, /https:\/\/doi\.org\/10\.1002\/btm2\.70123/);
  assert.match(paper, /Feret diameter, perimeter, roundness and circularity/);
  assert.match(paper, /orbital-shaker cultures produced the largest organoids/i);

  const teamResponse = await render("/team");
  const team = await teamResponse.text();
  const researchers = [
    "Burak Kahveci",
    "Elifsu Polatlı",
    "Ali Eren Evranos",
    "Hüseyin Güner",
  ];
  const supervisors = ["Sinan Güven", "Yalın Baştanlar", "Gökhan Karakülah"];
  let priorIndex = team.indexOf("Researchers");
  for (const name of researchers) {
    const index = team.indexOf(name);
    assert.ok(index > priorIndex, `${name} should follow the prior researcher`);
    priorIndex = index;
  }
  priorIndex = team.indexOf("Supervisors", priorIndex);
  for (const name of supervisors) {
    const index = team.indexOf(name, priorIndex);
    assert.ok(index > priorIndex, `${name} should follow the prior supervisor`);
    priorIndex = index;
  }

  const portraits = [
    "burak-kahveci.jpeg",
    "elifsu-polatli.jpg",
    "ali-eren-evranos.jpeg",
    "huseyin-guner.jpeg",
    "sinan-guven.jpeg",
    "yalin-bastanlar.jpeg",
    "gokhan-karakulah.jpeg",
  ];
  for (const portrait of portraits) {
    assert.match(team, new RegExp(`/team/${portrait.replace(".", "\\.")}`));
    const file = await stat(new URL(`../public/team/${portrait}`, import.meta.url));
    assert.ok(file.size > 1_000, `${portrait} should contain a real portrait`);
  }

  assert.match(team, /linkedin\.com\/in\/kahveciburak/);
  assert.match(team, /linkedin\.com\/in\/ali-eren-evranos/);
  assert.match(team, /linkedin\.com\/in\/huseyin-guner-b4a36b8/);
  assert.match(team, /linkedin\.com\/in\/yalin-bastanlar-51472a96/);
  assert.match(team, /Find on LinkedIn/);
});

test("keeps the rosette model and validation references wired into the UI", async () => {
  const [page, layout, graph, chunk0, chunk1, reference, expected] =
    await Promise.all([
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
      stat(new URL("../public/models/rosette_fp32.onnx", import.meta.url)),
      stat(
        new URL("../public/models/rosette_fp32.weights-0.bin", import.meta.url),
      ),
      stat(
        new URL("../public/models/rosette_fp32.weights-1.bin", import.meta.url),
      ),
      stat(
        new URL(
          "../public/samples/rosette/0119d840-Snap-242.jpg",
          import.meta.url,
        ),
      ),
      stat(
        new URL(
          "../public/samples/rosette/0119d840-Snap-242.expected.float32.bin",
          import.meta.url,
        ),
      ),
    ]);

  assert.ok(graph.size > 100_000);
  assert.ok(chunk0.size > 80_000_000);
  assert.ok(chunk1.size > 10_000_000);
  assert.ok(reference.size > 1_000);
  assert.ok(expected.size > 100_000);
  assert.match(page, /rosette_fp32\.weights-0\.bin/);
  assert.match(page, /rosette_fp32\.weights-1\.bin/);
  assert.match(page, /Run reference test/);
  assert.match(page, /Download annotated PNG/);
  assert.match(page, /Download detections CSV/);
  assert.match(
    layout,
    /title:\s*"BrAIn \| AI-Based Morphology Analysis Tool for Organoids"/,
  );
});

test("supports device-local uploads and downloadable results across every workflow", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /Choose your BO image/);
  assert.match(page, /selectBoImage/);
  assert.match(page, /runBoAnalysis/);
  assert.match(page, /analyzeSegmentationMask/);
  assert.match(page, /Download mask PNG/);
  assert.match(page, /Download measurements CSV/);
  assert.match(page, /Download classification CSV/);
  assert.match(page, /Download detections CSV/);
  assert.match(page, /without being uploaded/);
  assert.doesNotMatch(page, /Live measurements for uploaded images are the next step/);
});
