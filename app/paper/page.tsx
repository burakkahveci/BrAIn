import type { Metadata } from "next";
import { ProjectInformationPage } from "../project-information-page";

export const metadata: Metadata = {
  title: "Paper | BrAIn",
  description: "Publication and citation information for the BrAIn organoid analysis tool.",
};

export default function PaperPage() {
  return (
    <ProjectInformationPage
      activeSection="paper"
      kicker="BrAIn publication"
      title="The paper behind the analysis platform."
      introduction="Published in Bioengineering & Translational Medicine in 2026, the study presents BrAIn as an accessible deep-learning system for monitoring and quantifying brain-organoid development."
    >
      <article className="publicationPanel">
        <span>Published work</span>
        <h2>
          BrAIn: A comprehensive artificial intelligence-based morphology analysis
          system for brain organoids and neuroscience.
        </h2>
        <p>
          BrAIn follows development from embryoid bodies to brain organoids and
          quantifies area, Feret diameter, perimeter, roundness and circularity. It also
          classifies budding and abnormal 3D-organoid morphologies and detects neural
          rosettes. In the reported application, orbital-shaker cultures produced the
          largest organoids, while microfluidic-chip cultures showed more homogeneous
          growth; both conditions produced greater morphological complexity than static
          culture.
        </p>
        <div className="publicationLinks">
          <a href="https://doi.org/10.1002/btm2.70123" target="_blank" rel="noreferrer">
            Read the paper
          </a>
          <a href="https://zenodo.org/records/15513127" target="_blank" rel="noreferrer">
            Open the Zenodo record
          </a>
        </div>
      </article>
    </ProjectInformationPage>
  );
}
