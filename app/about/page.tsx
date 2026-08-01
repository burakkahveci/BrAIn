import type { Metadata } from "next";
import { ProjectInformationPage } from "../project-information-page";

export const metadata: Metadata = {
  title: "About | BrAIn",
  description: "About the BrAIn AI-based morphology analysis tool for organoids.",
};

export default function AboutPage() {
  return (
    <ProjectInformationPage
      activeSection="about"
      kicker="About BrAIn"
      title="Accessible organoid morphology analysis."
      introduction="BrAIn is a no-code, AI-based platform that combines classification, segmentation, quantitative morphology analysis and neural-rosette detection for organoid workflows. The browser version keeps image processing on the user's device and provides reference examples for each released analysis path."
    >
      <div className="projectFeatureGrid">
        <article>
          <span>01</span>
          <h2>One workspace</h2>
          <p>Classification, segmentation, morphology measurement and neural-rosette detection.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Device-local</h2>
          <p>Images are processed on the user&apos;s device rather than uploaded for server inference.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Publication-linked</h2>
          <p>Reference examples and outputs remain connected to the released BrAIn workflows.</p>
        </article>
      </div>

      <section className="segmentationExamples" aria-labelledby="segmentation-examples-heading">
        <div className="projectSectionHeader">
          <p className="cardKicker">Example outputs</p>
          <h2 id="segmentation-examples-heading">Original and segmented images</h2>
          <p>
            Two published-figure EB references processed with the released segmentation
            workflow. These examples demonstrate the interface output rather than an
            independent validation set.
          </p>
        </div>

        <div className="segmentationExampleGrid">
          <article>
            <div className="segmentationPair">
              <figure>
                <img src="/samples/eb/paper-eb-01.png" alt="Original embryoid body example 1" />
                <figcaption>Original</figcaption>
              </figure>
              <figure>
                <img
                  src="/samples/eb/paper-eb-01.desktop-mask.png"
                  alt="Segmented embryoid body mask example 1"
                />
                <figcaption>Segmented mask</figcaption>
              </figure>
            </div>
            <h3>EB example 01</h3>
          </article>

          <article>
            <div className="segmentationPair">
              <figure>
                <img src="/samples/eb/paper-eb-02.png" alt="Original embryoid body example 2" />
                <figcaption>Original</figcaption>
              </figure>
              <figure>
                <img
                  src="/samples/eb/paper-eb-02.desktop-mask.png"
                  alt="Segmented embryoid body mask example 2"
                />
                <figcaption>Segmented mask</figcaption>
              </figure>
            </div>
            <h3>EB example 02</h3>
          </article>
        </div>
      </section>
    </ProjectInformationPage>
  );
}
