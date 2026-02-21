/**
 * Deterministic portfolio generator — V1
 *
 * Rules from spec:
 * - 1 theme → 4 charities (25% each)
 * - 2 themes → 3 per theme (50% per theme → split evenly)
 * - 3 themes → 2 per theme (~33% per theme → split evenly)
 * - Max 8 slices, always sum to 100%
 * - LOCAL: UK_LOCAL + UK_NATIONAL only
 * - GLOBAL: Include GLOBAL pool charities
 * - MIX: 50% UK, 50% global
 */

export interface DBCharity {
  id: string;
  name: string;
  theme_id: string;
  geo: string;
  url: string;
}

export interface PortfolioAllocation {
  charity_id: string;
  charity_name: string;
  allocation_pct: number;
}

export function generatePortfolioFromDB(
  selectedThemes: string[],
  scope: "local" | "global" | "mix",
  allCharities: DBCharity[]
): PortfolioAllocation[] {
  if (selectedThemes.length === 0) return [];

  // Split charities by type
  const ukCharities = allCharities.filter(
    (c) => c.geo === "UK_LOCAL" || c.geo === "UK_NATIONAL"
  );
  const globalCharities = allCharities.filter((c) => c.geo === "GLOBAL");

  // Determine how many charities per theme
  const themeCount = selectedThemes.length;
  const charitiesPerTheme = themeCount === 1 ? 4 : themeCount === 2 ? 3 : 2;

  const selected: DBCharity[] = [];

  // For each theme, pick charities based on scope
  selectedThemes.forEach((themeId) => {
    let pool: DBCharity[];

    if (scope === "local") {
      pool = ukCharities.filter((c) => c.theme_id === themeId);
    } else if (scope === "global") {
      // Use UK national + global charities for the theme
      const themeUK = allCharities.filter(
        (c) => c.theme_id === themeId && c.geo === "UK_NATIONAL"
      );
      const themeGlobal = globalCharities;
      pool = [...themeUK, ...themeGlobal];
    } else {
      // MIX: all charities for the theme
      pool = allCharities.filter((c) => c.theme_id === themeId);
      // Add some global pool charities too
      const globals = globalCharities.filter(
        (c) => !pool.find((p) => p.id === c.id)
      );
      pool = [...pool, ...globals];
    }

    // Remove already selected
    pool = pool.filter((c) => !selected.find((s) => s.id === c.id));

    // Pick deterministically (first N from the filtered list)
    const picks = pool.slice(0, charitiesPerTheme);
    selected.push(...picks);
  });

  // If we have fewer than needed, fill from remaining charities
  if (selected.length < themeCount * charitiesPerTheme) {
    const remaining = allCharities.filter(
      (c) => !selected.find((s) => s.id === c.id)
    );
    const needed = Math.min(
      themeCount * charitiesPerTheme - selected.length,
      remaining.length
    );
    selected.push(...remaining.slice(0, needed));
  }

  // Cap at 8
  const final = selected.slice(0, 8);

  if (final.length === 0) return [];

  // Calculate equal allocation
  const basePct = Math.floor(10000 / final.length) / 100;
  const remainder = +(100 - basePct * final.length).toFixed(2);

  return final.map((charity, i) => ({
    charity_id: charity.id,
    charity_name: charity.name,
    allocation_pct: i === 0 ? +(basePct + remainder).toFixed(2) : basePct,
  }));
}
