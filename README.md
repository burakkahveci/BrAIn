# BrAIn

**AI-Based Morphology Analysis Tool for Organoids**

BrAIn is a no-code research application for organoid morphology analysis. This
repository contains the browser version of the published desktop tool, with
classification, segmentation, morphology measurement, and neural-rosette
detection running locally in the user's browser.

Live application: <https://burakkahveci.github.io/BrAIn/>

## Available workflows

- Abnormal–Normal organoid classification
- Budding–Normal organoid classification
- Brain organoid segmentation
- Embryoid body segmentation
- Area, maximum Feret diameter, perimeter, roundness, and circularity outputs
- Neural-rosette detection with annotated-image and CSV export
- Selectable reference images for every released workflow
- User-supplied image analysis for both classifiers, BO/EB segmentation, and
  neural-rosette detection
- Downloadable BO/EB masks, morphology tables, classification results, and
  rosette detections
- Batch analysis of up to 50 images with a combined CSV and complete ZIP export
- PNG, JPEG, BMP, WebP and TIFF input (first page for multi-page TIFF)
- Advisory image-quality warnings for resolution, exposure, contrast and focus
- Versioned JSON analysis reports containing the model, settings and outputs

## Privacy and intended use

Selected images and AI inference remain on the user's device. The application
does not upload research images to a server. BrAIn is intended for research use
only; it is not a medical device and must not be used for clinical diagnosis or
decision-making.

## Scientific reference

Kahveci B, Polatlı E, Evranos AE, Güner H, Karakülah G, Baştanlar Y, Güven S.
*BrAIn: A comprehensive artificial intelligence-based morphology analysis
system for brain organoids and neuroscience*. Bioengineering & Translational
Medicine. 2026;11:e70123.

- Paper: <https://doi.org/10.1002/btm2.70123>
- Software and data release: <https://doi.org/10.5281/zenodo.15513127>
- Machine-readable citation: [`CITATION.cff`](CITATION.cff)

## Run locally

Requirements: Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

Validation commands:

```bash
npm run lint
npm test
```

## Model and validation boundary

The browser models were converted to ONNX and checked against fixed desktop
reference outputs. The included examples support implementation equivalence
testing; they do not establish performance on new laboratories, imaging
systems, organoid protocols, or clinical samples. Users should perform
application-specific validation before drawing scientific conclusions.

The independent evaluation plan is documented in
[`VALIDATION_PROTOCOL.md`](VALIDATION_PROTOCOL.md). The protocol is ready, but
multi-laboratory external validation has not yet been completed.

## Licensing

This repository contains materials with different license scopes:

- Original web application source: AGPL-3.0-only
- BrAIn materials corresponding to the Zenodo release: CC BY-SA 4.0 where the
  authors hold the relevant rights
- Publication-derived image crops: CC BY 4.0
- Team portraits: excluded from the open-license grants
- Third-party software and models: their respective upstream terms

Read [`LICENSE_SCOPE.md`](LICENSE_SCOPE.md) and
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) before reuse or
redistribution. The Ultralytics YOLO-derived neural-rosette workflow requires
particular attention to AGPL-3.0 or separate Ultralytics licensing terms.
Use [`LICENSING_REVIEW_CHECKLIST.md`](LICENSING_REVIEW_CHECKLIST.md) before a
tagged, institutional, commercial or redistributed release.

## Contact and permissions

For formal reuse, collaboration, or permission questions, contact the
corresponding author through the details provided in the paper. When using
BrAIn in research, cite both the peer-reviewed article and the Zenodo release.
