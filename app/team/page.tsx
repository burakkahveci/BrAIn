import type { Metadata } from "next";
import { ProjectInformationPage } from "../project-information-page";

export const metadata: Metadata = {
  title: "Team | BrAIn",
  description: "The research and development team behind BrAIn.",
};

type TeamMember = {
  name: string;
  image: string;
  linkedin: string;
  linkLabel?: string;
};

const researchers: TeamMember[] = [
  {
    name: "Burak Kahveci",
    image: "/team/burak-kahveci.jpeg",
    linkedin: "https://www.linkedin.com/in/kahveciburak",
  },
  {
    name: "Elifsu Polatlı",
    image: "/team/elifsu-polatli.jpg",
    linkedin:
      "https://www.linkedin.com/search/results/people/?keywords=Elifsu%20Polatl%C4%B1",
    linkLabel: "Find on LinkedIn",
  },
  {
    name: "Ali Eren Evranos",
    image: "/team/ali-eren-evranos.jpeg",
    linkedin: "https://www.linkedin.com/in/ali-eren-evranos",
  },
  {
    name: "Hüseyin Güner",
    image: "/team/huseyin-guner.jpeg",
    linkedin: "https://www.linkedin.com/in/huseyin-guner-b4a36b8",
  },
];

const supervisors: TeamMember[] = [
  {
    name: "Sinan Güven",
    image: "/team/sinan-guven.jpeg",
    linkedin: "https://www.linkedin.com/in/sinan-g%C3%BCven-a458734",
  },
  {
    name: "Yalın Baştanlar",
    image: "/team/yalin-bastanlar.jpeg",
    linkedin: "https://www.linkedin.com/in/yalin-bastanlar-51472a96",
  },
  {
    name: "Gökhan Karakülah",
    image: "/team/gokhan-karakulah.jpeg",
    linkedin:
      "https://www.linkedin.com/in/g%C3%B6khan-karak%C3%BClah-b650b0229",
  },
];

function PersonCard({ member }: { member: TeamMember }) {
  return (
    <article className="personCard">
      <img src={member.image} alt={`${member.name} portrait`} />
      <div className="personCardBody">
        <h3>{member.name}</h3>
        <a href={member.linkedin} target="_blank" rel="noreferrer">
          <span aria-hidden="true">in</span>
          {member.linkLabel ?? "LinkedIn profile"}
          <b aria-hidden="true">↗</b>
        </a>
      </div>
    </article>
  );
}

export default function TeamPage() {
  return (
    <ProjectInformationPage
      activeSection="team"
      kicker="BrAIn team"
      title="The people behind BrAIn."
      introduction="Meet the researchers and supervisors who contributed to the BrAIn morphology analysis platform."
    >
      <section className="teamSection" aria-labelledby="researchers-heading">
        <div className="teamSectionHeader">
          <p className="cardKicker">Project contributors</p>
          <h2 id="researchers-heading">Researchers</h2>
        </div>
        <div className="peopleGrid researchersGrid">
          {researchers.map((member) => (
            <PersonCard member={member} key={member.name} />
          ))}
        </div>
      </section>

      <section className="teamSection" aria-labelledby="supervisors-heading">
        <div className="teamSectionHeader">
          <p className="cardKicker">Project guidance</p>
          <h2 id="supervisors-heading">Supervisors</h2>
        </div>
        <div className="peopleGrid supervisorsGrid">
          {supervisors.map((member) => (
            <PersonCard member={member} key={member.name} />
          ))}
        </div>
      </section>
    </ProjectInformationPage>
  );
}
