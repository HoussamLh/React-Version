import cloudArchitectImg from "../../../Assets/projects/cloudarchitect-pro.png";
import veloFitImg from "../../../Assets/projects/velofit-ios.png";
import fluxAnalyticsImg from "../../../Assets/projects/fluxanalytics.png";
import omniHomeImg from "../../../Assets/projects/omnihome-hub.png";
import devSyncImg from "../../../Assets/projects/devsync-api.png";
import collabLayerImg from "../../../Assets/projects/collablayer.png";

export type ProjectAccent =
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "yellow"
  | "cyan";

export type ProjectMediaType = "image" | "video";

export type Project = {
  id?: string;
  slug?: string;
  title: string;
  text: string;
  image?: string | null;
  videoUrl?: string | null;
  videoPosterUrl?: string | null;
  mediaType?: ProjectMediaType;
  tags: string[];
  span: string;
  imageHeight: string;
  hoverAccent: ProjectAccent;
};

export const projects: Project[] = [
  {
    title: "CloudArchitect Pro",
    text: "Enterprise infrastructure management tool with real-time topology mapping and automated scaling policies.",
    image: cloudArchitectImg,
    mediaType: "image",
    tags: ["React", "Go", "Cloud"],
    span: "span 8",
    imageHeight: "320px",
    hoverAccent: "blue",
  },
  {
    title: "VeloFit iOS",
    text: "Precision biometric tracking and workout optimization for professional athletes.",
    image: veloFitImg,
    mediaType: "image",
    tags: ["Swift", "iOS", "Health"],
    span: "span 4",
    imageHeight: "320px",
    hoverAccent: "green",
  },
  {
    title: "FluxAnalytics",
    text: "Full-stack data pipeline and visualization engine for e-commerce growth.",
    image: fluxAnalyticsImg,
    mediaType: "image",
    tags: ["Next.js", "Python", "Data"],
    span: "span 4",
    imageHeight: "320px",
    hoverAccent: "purple",
  },
  {
    title: "OmniHome Hub",
    text: "Unified smart device controller with edge-computing logic and zero-latency local control.",
    image: omniHomeImg,
    mediaType: "image",
    tags: ["Flutter", "Rust", "IoT"],
    span: "span 8",
    imageHeight: "320px",
    hoverAccent: "pink",
  },
  {
    title: "DevSync API",
    text: "Automated documentation engine that generates real-time sandboxes from OpenAPI specs.",
    image: devSyncImg,
    mediaType: "image",
    tags: ["Node.js", "TypeScript", "API"],
    span: "span 6",
    imageHeight: "280px",
    hoverAccent: "yellow",
  },
  {
    title: "CollabLayer",
    text: "Real-time collaborative project workspace with integrated Git-flow visualization.",
    image: collabLayerImg,
    mediaType: "image",
    tags: ["Vue.js", "Firebase", "Realtime"],
    span: "span 6",
    imageHeight: "280px",
    hoverAccent: "cyan",
  },
];
