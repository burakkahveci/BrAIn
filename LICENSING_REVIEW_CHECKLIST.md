# BrAIn release and licensing review checklist

Status: working checklist; not legal advice

Complete this checklist before a tagged public release, institutional mirror,
commercial deployment or redistribution of model files.

## Rights and attribution

- [ ] Confirm the authors/institutions authorized publication of the web source.
- [ ] Confirm which Zenodo files are covered by CC BY-SA 4.0 and preserve the
  creator, title, DOI, license and modification notice.
- [ ] Confirm that publication-derived crops are reused under the article's
  stated CC BY 4.0 terms, with citation and modification notice.
- [ ] Keep team portraits outside the software/data license grants unless each
  person provides explicit reuse permission.
- [ ] Include `CITATION.cff`, `LICENSE_SCOPE.md` and `THIRD_PARTY_NOTICES.md` in
  every source distribution.

## Source and models

- [ ] Publish the corresponding web source for the deployed AGPL-3.0 service.
- [ ] Preserve ONNX Runtime's MIT notice.
- [ ] Preserve UTIF and fflate MIT notices and package metadata.
- [ ] Confirm the provenance and redistribution rights for every ONNX model and
  external weight file.
- [ ] Review the Ultralytics terms applicable to the YOLOv8-derived rosette
  model and workflow.
- [ ] Obtain separate advice/licensing before any closed-source, proprietary or
  commercial deployment involving the Ultralytics-derived model.
- [ ] Do not assume the Zenodo CC BY-SA label overrides third-party terms.

## Research, privacy and public wording

- [ ] Retain the research-use-only and non-medical-device statements.
- [ ] State accurately that browser analysis is device-local and images are not
  uploaded by the static application.
- [ ] Do not claim independent or clinical validation until the validation
  protocol has been completed and documented.
- [ ] Provide a working corresponding-author contact route for permission and
  collaboration questions.
- [ ] Confirm that analytics, error-reporting or future hosting changes do not
  introduce image uploads without a new privacy review and clear consent.

## Release sign-off

| Review | Name | Date | Decision / notes |
| --- | --- | --- | --- |
| Scientific scope |  |  |  |
| Model/data provenance |  |  |  |
| Software dependency inventory |  |  |  |
| Institutional/IP review |  |  |  |
| Privacy review |  |  |  |
| Final release authorization |  |  |  |

For a material commercial, institutional or cross-jurisdictional release,
obtain advice from the relevant institution or qualified counsel.
