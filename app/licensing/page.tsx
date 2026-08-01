import type { Metadata } from "next";
import { ProjectInformationPage } from "../project-information-page";

export const metadata: Metadata = {
  title: "Access & Licensing | BrAIn",
  description:
    "Research-use, citation, redistribution and licensing guidance for the BrAIn organoid morphology analysis tool.",
};

export default function LicensingPage() {
  return (
    <ProjectInformationPage
      activeSection="licensing"
      kicker="Access & licensing"
      title="Use BrAIn with clarity."
      introduction="Practical guidance for academic use, citation, adaptation, redistribution and formal permission requests."
    >
      <section className="accessSummaryGrid" aria-label="BrAIn use summary">
        <article>
          <span>01</span>
          <h2>Academic use</h2>
          <p>
            BrAIn may be used for academic research, teaching and scientific
            publications. Please cite the paper and the Zenodo release.
          </p>
        </article>
        <article>
          <span>02</span>
          <h2>Sharing and adaptation</h2>
          <p>
            The Zenodo release is marked CC BY-SA 4.0. Covered materials may be
            shared and adapted, including commercially, when the license terms are
            followed.
          </p>
        </article>
        <article>
          <span>03</span>
          <h2>Research only</h2>
          <p>
            BrAIn is a research morphology-analysis tool. It is not presented as a
            medical device and should not be used for diagnosis or clinical decisions.
          </p>
        </article>
      </section>

      <section className="licensingDetailGrid">
        <article className="licensePanel">
          <p className="cardKicker">Zenodo software and data release</p>
          <div className="licensePanelHeading">
            <h2>CC BY-SA 4.0</h2>
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noreferrer"
            >
              Read the license ↗
            </a>
          </div>
          <p className="licenseIntro">
            The BrAIn Zenodo record is open access and identifies Creative Commons
            Attribution-ShareAlike 4.0 as its license.
          </p>
          <ul className="permissionList">
            <li>
              <strong>Give appropriate credit.</strong>
              <span>Cite the authors, paper and Zenodo record.</span>
            </li>
            <li>
              <strong>Link to the license.</strong>
              <span>Keep the CC BY-SA 4.0 notice with shared copies.</span>
            </li>
            <li>
              <strong>Describe modifications.</strong>
              <span>Clearly state when the software, models or materials were changed.</span>
            </li>
            <li>
              <strong>Share adaptations alike.</strong>
              <span>Distribute adapted covered material under the same license.</span>
            </li>
          </ul>
          <div className="licenseSourceLinks">
            <a href="https://zenodo.org/records/15513127" target="_blank" rel="noreferrer">
              Zenodo release
            </a>
            <a href="https://doi.org/10.1002/btm2.70123" target="_blank" rel="noreferrer">
              Published paper
            </a>
          </div>
        </article>

        <aside className="componentNotice">
          <p className="cardKicker">Third-party components</p>
          <h2>Check the deployment context.</h2>
          <p>
            The neural-rosette workflow was developed with Ultralytics YOLOv8.
            Ultralytics states that its code and trained models are AGPL-3.0 by default,
            with separate terms for proprietary, private or commercial deployment.
          </p>
          <p>
            The Zenodo license does not replace licenses attached to third-party
            software. Institutions planning redistribution, a hosted service or
            closed-source integration should review the relevant component terms.
          </p>
          <a href="https://www.ultralytics.com/license" target="_blank" rel="noreferrer">
            Review Ultralytics licensing ↗
          </a>
        </aside>
      </section>

      <section className="citationContactGrid">
        <article className="citationPanel">
          <p className="cardKicker">How to cite</p>
          <h2>Please cite both records.</h2>
          <div>
            <strong>Paper</strong>
            <p>
              Kahveci B, Polatli E, Evranos AE, Güner H, Karakülah G, Bastanlar Y,
              Güven S. BrAIn: A comprehensive artificial intelligence-based morphology
              analysis system for brain organoids and neuroscience. Bioengineering &amp;
              Translational Medicine. 2026;11:e70123.
              https://doi.org/10.1002/btm2.70123
            </p>
          </div>
          <div>
            <strong>Software and data</strong>
            <p>
              Kahveci B. BrAIn: A comprehensive artificial intelligence-based morphology
              analysis system for brain organoids and neuroscience. Zenodo. 2025.
              https://doi.org/10.5281/zenodo.15513127
            </p>
          </div>
        </article>

        <aside className="permissionContact">
          <p className="cardKicker">Formal permission</p>
          <h2>Need a written answer?</h2>
          <p>
            Contact the corresponding author when your institution requires a formal
            permission statement, or when your planned redistribution, commercial use
            or software integration is not clearly covered above.
          </p>
          <a
            href="mailto:sinan.guven@deu.edu.tr?subject=BrAIn%20use%20and%20licensing%20inquiry"
          >
            Email the corresponding author
          </a>
          <span>sinan.guven@deu.edu.tr</span>
        </aside>
      </section>

      <p className="licensingDisclaimer">
        This page provides practical guidance, not legal advice. The applicable license
        texts and third-party terms control if there is any conflict.
      </p>
    </ProjectInformationPage>
  );
}
