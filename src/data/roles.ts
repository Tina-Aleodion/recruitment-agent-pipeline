import { RoleMetadata, Stage } from "../types";

export const ROLE_META: Record<string, RoleMetadata> = {
  "Senior Data Engineer": {
    hm: "James Okafor",
    technical: true,
    stages: ["Applied", "Phone Screen", "First Interview", "Final Interview", "Offer", "Hired", "Rejected", "Withdrawn"]
  },
  "Product Manager": {
    hm: "Adaeze Okonkwo",
    technical: false,
    stages: ["Applied", "Phone Screen", "Assessment", "First Interview", "Final Interview", "Offer", "Hired", "Rejected", "Withdrawn"]
  },
  "Customer Success Lead": {
    hm: "Chidi Nwosu",
    technical: false,
    stages: ["Applied", "Phone Screen", "Assessment", "First Interview", "Final Interview", "Offer", "Hired", "Rejected", "Withdrawn"]
  },
  "Finance Analyst": {
    hm: "Sola Adeyemi",
    technical: false,
    stages: ["Applied", "Phone Screen", "Assessment", "First Interview", "Final Interview", "Offer", "Hired", "Rejected", "Withdrawn"]
  }
};

export const ROLES = Object.keys(ROLE_META);

export const ACTIVE_STAGES: Stage[] = ["Applied", "Phone Screen", "Assessment", "First Interview", "Final Interview", "Offer"];

export const STAGE_COLORS: Record<Stage, { bg: string; tx: string }> = {
  "Applied": { bg: "hsl(45, 20%, 93%)", tx: "hsl(45, 10%, 25%)" },
  "Phone Screen": { bg: "hsl(245, 40%, 96%)", tx: "hsl(245, 50%, 40%)" },
  "Assessment": { bg: "hsl(35, 100%, 95%)", tx: "hsl(35, 100%, 25%)" },
  "First Interview": { bg: "hsl(210, 80%, 96%)", tx: "hsl(210, 80%, 25%)" },
  "Final Interview": { bg: "hsl(160, 50%, 94%)", tx: "hsl(160, 60%, 20%)" },
  "Offer": { bg: "hsl(90, 40%, 91%)", tx: "hsl(90, 60%, 20%)" },
  "Hired": { bg: "hsl(160, 50%, 94%)", tx: "hsl(160, 60%, 20%)" },
  "Rejected": { bg: "hsl(0, 70%, 96%)", tx: "hsl(0, 60%, 30%)" },
  "Withdrawn": { bg: "hsl(45, 10%, 93%)", tx: "hsl(45, 5%, 40%)" }
};
