import samLImg from "../../../Assets/about/samLImg.png";
import shannonRImg from "../../../Assets/about/ShannonRImg.png";
import jackHImg from "../../../Assets/about/JackHImg.png";
import rogerCImg from "../../../Assets/about/RogerCImg.png";

export type TeamMember = {
  name: string;
  role: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const teamMembers: TeamMember[] = [
  {
    name: "Sam Lahlah",
    role: "Founder & Software Engineer",
    description:
      "Focused on building scalable web platforms, clean frontend architecture, and business-ready digital systems.",
    image: samLImg,
    imageAlt: "Sam Lahlah",
  },
  {
    name: "Shannon R",
    role: "UI/UX Designer",
    description:
      "Designs clean, user-focused interfaces that balance usability, accessibility, and visual consistency.",
    image: shannonRImg,
    imageAlt: "Shannon R",
  },
  {
    name: "Jack H",
    role: "Frontend Engineer",
    description:
      "Builds responsive interfaces, reusable components, and polished user experiences across modern web projects.",
    image: jackHImg,
    imageAlt: "Jack H",
  },
  {
    name: "Roger C",
    role: "Backend Engineer",
    description:
      "Works on APIs, data structures, integrations, and reliable backend systems that support long-term growth.",
    image: rogerCImg,
    imageAlt: "Roger C",
  },
];
