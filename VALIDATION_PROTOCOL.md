# BrAIn browser validation protocol

Version: 1.0  
Status: protocol ready; independent multi-laboratory validation is not yet complete

## Purpose

This protocol separates two questions that must not be conflated:

1. **Implementation equivalence:** does the browser reproduce the released
   desktop pipeline on fixed reference inputs?
2. **External scientific validity:** how well do the workflows perform on new
   laboratories, microscopes, acquisition settings, organoid protocols and
   biological samples?

The reference examples in the application address the first question only.

## Supported test matrix

Record the following for every test set:

- contributing laboratory and institution;
- organoid or embryoid-body protocol and culture day;
- microscope, objective, camera and acquisition software;
- pixel size, image dimensions, bit depth and file format;
- preprocessing applied before BrAIn;
- whether images are independent from model development data;
- expert annotation method, number of annotators and disagreement resolution.

Test current Chrome, Edge, Firefox and Safari releases on macOS and Windows.
Include PNG, JPEG, BMP, WebP and single-page TIFF. For multi-page TIFF, verify
that BrAIn analyzes page 1 and records this choice in the JSON report.

## Implementation-equivalence acceptance checks

Use the released reference inputs and preserve the published preprocessing.

| Workflow | Required comparison |
| --- | --- |
| BO segmentation | Browser/desktop binary-mask Dice = 1.000000 and 0 disagreeing pixels |
| EB segmentation | Browser/desktop binary-mask Dice = 1.000000 and 0 disagreeing pixels |
| Classification | Exact class-decision match and recorded probability delta |
| Rosette detection | Exact detection-count match, matched-box minimum IoU >= 0.999 and recorded raw-output delta |
| TIFF decoding | Compare TIFF with a lossless PNG export pixel-for-pixel or document any decoder/bit-depth transformation |
| Batch processing | Each batch result must match the same file analyzed individually |

Record browser, operating system, BrAIn application version, model filename,
settings, source filename and exported JSON report for every run.

## External scientific-validation measures

- **BO/EB segmentation:** Dice, intersection over union, boundary distance,
  absolute and relative error for area/Feret/perimeter, and failure rate.
- **Abnormal/Budding classification:** confusion matrix, sensitivity,
  specificity, balanced accuracy, F1, ROC-AUC where appropriate, calibration
  and confidence intervals. Report performance separately by laboratory.
- **Rosette detection:** precision, recall, F1 and average precision at a
  predeclared IoU threshold; count error per image and localization IoU.
- **Robustness:** stratify by laboratory, microscope, protocol, culture day,
  image format, resolution and any quality warning.

Predeclare the scientific acceptance thresholds with the collaborating labs
before opening the external test labels. Do not select thresholds after seeing
test performance.

## Privacy and data transfer

Prefer de-identified or openly licensed images. The public web application
processes images on the user's device and does not upload them. If collaborators
send images to the authors for a formal study, use an institution-approved
transfer route and document consent, data-use conditions and retention.

## Result record

For each validation release, publish or archive:

- dataset description and inclusion/exclusion criteria;
- annotation protocol and annotator agreement;
- locked model/application version and settings;
- per-image results and aggregate confidence intervals;
- failed or excluded images with reasons;
- known limitations and distribution-shift findings;
- a completed sign-off table naming the scientific and software reviewers.

Passing the fixed browser references does not establish external validity, and
no such claim should be made until the external protocol has been completed.
