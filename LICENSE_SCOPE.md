# BrAIn licensing scope

BrAIn combines original web application code, released scientific models and
data, publication-derived figures, personal photographs, and third-party
software. Those materials do not all share one license.

## Web application source code

Unless a file states otherwise, the source code in `app/`, `build/`, `db/`,
`drizzle/`, `examples/`, `tests/`, and `worker/`, together with the repository
configuration files, is licensed under the GNU Affero General Public License
version 3.0 only (`AGPL-3.0-only`). The full text is in [`LICENSE`](LICENSE).

This compliance-first choice reflects that the current application distributes
and runs an Ultralytics YOLO-derived neural-rosette model. Ultralytics states
that its trained YOLO models are covered by AGPL-3.0 by default and that a
closed-source or proprietary deployment requires separate Enterprise terms.
See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

## BrAIn models, data, and reference materials

The BrAIn-authored model, dataset, and reference materials corresponding to the
published Zenodo release are provided under Creative Commons
Attribution-ShareAlike 4.0 International (`CC BY-SA 4.0`), to the extent that
the BrAIn authors hold the relevant rights. The Zenodo record is:

- Burak Kahveci. *BrAIn: A comprehensive artificial intelligence-based
  morphology analysis system for brain organoids and neuroscience*. Zenodo
  (2025). <https://doi.org/10.5281/zenodo.15513127>

The license text is in [`LICENSES/CC-BY-SA-4.0.txt`](LICENSES/CC-BY-SA-4.0.txt).
Attribution, a license link, a change notice, and ShareAlike are required.

Third-party terms remain applicable. In particular, the neural-rosette model
in `public/models/rosette_fp32.onnx` and its external weight files were derived
from an Ultralytics YOLOv8 training workflow. Reuse or deployment must satisfy
both the rights granted by the BrAIn authors and any applicable Ultralytics
license obligations. This notice does not replace the actual license terms.

## Publication-derived images

The files under `public/samples/eb/` whose names begin with `paper-eb-` are
adapted crops from the open-access paper. The paper is licensed under Creative
Commons Attribution 4.0 International (`CC BY 4.0`):

- Kahveci B, Polatlı E, Evranos AE, Güner H, Karakülah G, Baştanlar Y, Güven S.
  *BrAIn: A comprehensive artificial intelligence-based morphology analysis
  system for brain organoids and neuroscience*. Bioengineering & Translational
  Medicine. 2026;11:e70123. <https://doi.org/10.1002/btm2.70123>

The license text is in [`LICENSES/CC-BY-4.0.txt`](LICENSES/CC-BY-4.0.txt).
The web application identifies these files as modified publication crops and
does not present them as an independent validation set or ground truth.

## Team portraits

The personal photographs in `public/team/` are excluded from the AGPL and
Creative Commons grants above. All rights are reserved by their respective
rights holders. They may be displayed by this BrAIn website but may not be
copied, redistributed, or repurposed without permission from the relevant
person or rights holder.

## Third-party software and generated files

Third-party packages, vendored runtime files, generated files, and starter
assets retain their own licenses. The bundled ONNX Runtime Web files under
`public/ort/` are MIT-licensed; a copy is in
[`LICENSES/ONNXRUNTIME-MIT.txt`](LICENSES/ONNXRUNTIME-MIT.txt). The dependency
inventory and versions are recorded in `package-lock.json`.

## No warranty and no legal or clinical advice

The software is provided without warranty under the applicable licenses. It is
for research use and is not a medical device or a substitute for clinical
judgment. This document is a repository notice based on the published Zenodo
metadata and identified component licenses; it is not legal advice. Before a
public release, the authors and their institution should confirm that they have
authority to apply these terms to every included model, dataset, image, and
source file.
