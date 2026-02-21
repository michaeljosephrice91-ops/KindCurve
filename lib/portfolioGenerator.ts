import { CHARITY_DATABASE, type CharityData, type ThemeKey, type ScopeFilter } from "./charityDatabase";

export interface CharityAllocation {
  name: string;
  allocation: number;
}

export interface GeneratedPortfolio {
  charities: CharityAllocation[];
  isRecommended: boolean;
}

function matchesScope(
  charityScope: "local" | "global" | "both",
  filter: ScopeFilter
): boolean {
  if (filter === "mix") return true;
  if (charityScope === "both") return true;
  return charityScope === filter;
}

/**
 * Deterministic portfolio generator.
 * Guarantees 5–8 charities for ANY combination of inputs.
 * Same input → same output.
 */
export function generatePortfolio(
  selectedThemes: ThemeKey[],
  scopeFilter: ScopeFilter
): GeneratedPortfolio {
  if (selectedThemes.length === 0) {
    return {
      charities: [
        { name: "Mind", allocation: 16.67 },
        { name: "Shelter", allocation: 16.67 },
        { name: "Cool Earth", allocation: 16.67 },
        { name: "RSPCA", allocation: 16.67 },
        { name: "Save the Children", allocation: 16.67 },
        { name: "British Red Cross", allocation: 16.65 },
      ],
      isRecommended: false,
    };
  }

  const themeCharities: CharityData[] = [];

  selectedThemes.forEach((theme) => {
    let matching = CHARITY_DATABASE.filter(
      (c) => c.themes.includes(theme) && matchesScope(c.scope, scopeFilter)
    );
    if (matching.length === 0) {
      matching = CHARITY_DATABASE.filter(
        (c) => c.themes.includes(theme) && c.scope === "both"
      );
    }
    if (matching.length === 0) {
      matching = CHARITY_DATABASE.filter((c) => c.themes.includes(theme));
    }
    const toAdd = matching.slice(0, 2);
    toAdd.forEach((charity) => {
      if (!themeCharities.find((c) => c.name === charity.name)) {
        themeCharities.push(charity);
      }
    });
  });

  // Fill to minimum 5
  if (themeCharities.length < 5) {
    const recommended = CHARITY_DATABASE.filter(
      (c) =>
        matchesScope(c.scope, scopeFilter) &&
        !themeCharities.find((tc) => tc.name === c.name) &&
        c.themes.some((t) => selectedThemes.includes(t as ThemeKey))
    );
    recommended
      .slice(0, 5 - themeCharities.length)
      .forEach((c) => themeCharities.push(c));
  }

  // Final fallback
  if (themeCharities.length < 5) {
    const fallback = CHARITY_DATABASE.filter(
      (c) => !themeCharities.find((tc) => tc.name === c.name)
    );
    fallback
      .slice(0, 5 - themeCharities.length)
      .forEach((c) => themeCharities.push(c));
  }

  const finalCharities = themeCharities.slice(0, 8);
  const baseAllocation = Math.floor(10000 / finalCharities.length) / 100;
  const remainder = +(100 - baseAllocation * finalCharities.length).toFixed(2);

  const portfolio = finalCharities.map((charity, idx) => ({
    name: charity.name,
    allocation: idx === 0 ? +(baseAllocation + remainder).toFixed(2) : baseAllocation,
  }));

  return { charities: portfolio, isRecommended: true };
}
