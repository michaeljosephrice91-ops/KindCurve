export interface CharityData {
  name: string;
  themes: string[];
  scope: "local" | "global" | "both";
  description?: string;
}

export const CHARITY_DATABASE: CharityData[] = [
  // Climate & Environment
  { name: "Cool Earth", themes: ["climate"], scope: "global" },
  { name: "Rainforest Trust", themes: ["climate"], scope: "global" },
  { name: "ClientEarth", themes: ["climate"], scope: "both" },
  { name: "The Woodland Trust", themes: ["climate"], scope: "local" },
  { name: "Friends of the Earth", themes: ["climate"], scope: "both" },
  { name: "Surfers Against Sewage", themes: ["climate"], scope: "local" },

  // Mental Health
  { name: "Mind", themes: ["mental"], scope: "local" },
  { name: "Samaritans", themes: ["mental"], scope: "local" },
  { name: "Young Minds", themes: ["mental"], scope: "local" },
  { name: "Mental Health Foundation", themes: ["mental"], scope: "both" },
  { name: "Rethink Mental Illness", themes: ["mental"], scope: "local" },

  // Poverty & Basic Needs
  { name: "Shelter", themes: ["poverty"], scope: "local" },
  { name: "Crisis", themes: ["poverty"], scope: "local" },
  { name: "Centrepoint", themes: ["poverty"], scope: "local" },
  { name: "The Trussell Trust", themes: ["poverty"], scope: "local" },
  { name: "Action Against Hunger", themes: ["poverty"], scope: "global" },
  { name: "WaterAid", themes: ["poverty"], scope: "global" },

  // Children & Education
  { name: "Barnardo's", themes: ["children"], scope: "local" },
  { name: "NSPCC", themes: ["children"], scope: "local" },
  { name: "Save the Children", themes: ["children"], scope: "global" },
  { name: "UNICEF UK", themes: ["children"], scope: "global" },
  { name: "Malala Fund", themes: ["children"], scope: "global" },
  { name: "The Children's Society", themes: ["children"], scope: "local" },

  // Animals & Nature
  { name: "RSPCA", themes: ["animals"], scope: "local" },
  { name: "Dogs Trust", themes: ["animals"], scope: "local" },
  { name: "WWF", themes: ["animals", "climate"], scope: "global" },
  { name: "The Wildlife Trusts", themes: ["animals"], scope: "local" },
  { name: "Born Free Foundation", themes: ["animals"], scope: "global" },
  { name: "Battersea Dogs & Cats Home", themes: ["animals"], scope: "local" },

  // Multi-theme charities for fallback
  { name: "Oxfam", themes: ["poverty", "children"], scope: "global" },
  { name: "British Red Cross", themes: ["poverty", "children"], scope: "both" },
  { name: "Comic Relief", themes: ["poverty", "children", "mental"], scope: "both" },
];

export type ThemeKey = "climate" | "mental" | "poverty" | "children" | "animals";
export type ScopeFilter = "local" | "global" | "mix";
