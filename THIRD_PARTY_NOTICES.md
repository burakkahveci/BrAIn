# Third-party notices

This file records the principal third-party components that require special
attention in the BrAIn web application. It is not a substitute for reviewing
the complete dependency tree in `package-lock.json`.

## ONNX Runtime Web

- Component: `onnxruntime-web` 1.23.2 and the browser runtime files under
  `public/ort/`
- Copyright: Microsoft Corporation
- License: MIT
- Source: <https://github.com/microsoft/onnxruntime>
- License copy: [`LICENSES/ONNXRUNTIME-MIT.txt`](LICENSES/ONNXRUNTIME-MIT.txt)

## Ultralytics YOLO-derived neural-rosette model

- Component: `public/models/rosette_fp32.onnx` and
  `public/models/rosette_fp32.weights-*.bin`
- Origin: custom neural-rosette detector trained/exported using an Ultralytics
  YOLOv8 workflow
- Upstream project: <https://github.com/ultralytics/ultralytics>
- Upstream licensing information: <https://www.ultralytics.com/license>
- Relevant open-source license: GNU AGPL-3.0

Ultralytics currently states that use of its YOLO code, architectures,
training pipelines, and trained or fine-tuned models requires either releasing
the complete project under AGPL-3.0 or obtaining an Ultralytics Enterprise
license. The present repository therefore uses AGPL-3.0 for its original web
application source code. Anyone planning a closed-source, proprietary, or
commercial deployment should obtain advice from the relevant rights holders
and must not assume that the Zenodo CC BY-SA 4.0 label overrides upstream terms.

## JavaScript dependencies

The application also depends on React, Next.js/vinext, Vite, Drizzle, Tailwind
CSS, Cloudflare development tooling, and their transitive packages. Each
package retains its own license. Exact resolved versions are listed in
`package-lock.json`; source distributions and package metadata should remain
available when redistributing the application.

## Scope boundary

This notice covers the browser prototype in this repository. The original
desktop archive published on Zenodo contains additional Python and desktop
dependencies that are not redistributed here and require their own
third-party-license inventory.
