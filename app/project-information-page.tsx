import type { ReactNode } from "react";
import Link from "next/link";

type ProjectSection = "about" | "paper" | "licensing" | "team";

type ProjectInformationPageProps = {
  activeSection: ProjectSection;
  kicker: string;
  title: string;
  introduction: string;
  children: ReactNode;
};

export function ProjectInformationPage({
  activeSection,
  kicker,
  title,
  introduction,
  children,
}: ProjectInformationPageProps) {
  return (
    <main>
      <header className="topbar" id="top">
        <div className="brandCluster">
          <Link className="brand" href="/" aria-label="Open the BrAIn analysis tool">
            <strong>BrAIn</strong>
            <span>AI-Based Morphology Analysis Tool for Organoids</span>
          </Link>
          <nav className="siteNav" aria-label="Project information">
            <Link href="/">BrAIn</Link>
            <Link className={activeSection === "about" ? "active" : ""} href="/about">
              About
            </Link>
            <Link className={activeSection === "paper" ? "active" : ""} href="/paper">
              Paper
            </Link>
            <Link
              className={activeSection === "licensing" ? "active" : ""}
              href="/licensing"
            >
              Licensing
            </Link>
            <Link className={activeSection === "team" ? "active" : ""} href="/team">
              Team
            </Link>
          </nav>
        </div>
        <Link className="privacyBadge projectReturn" href="/">
          Open analysis tool
        </Link>
      </header>

      <section className="projectPage">
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        <p className="projectLead">{introduction}</p>
        <div className="projectPageBody">{children}</div>
      </section>

      <footer>
        <span>BrAIn project information</span>
        <Link href="/">Return to analysis workspace</Link>
      </footer>
    </main>
  );
}
