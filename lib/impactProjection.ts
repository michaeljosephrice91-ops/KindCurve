export interface ProjectionPoint {
  year: number;
  kindCurve: number;
  irregular: number;
}

export function generateProjectionData(): ProjectionPoint[] {
  const volatility = [0, 12, 8, 15, 10, 11, 9, 14, 12, 13, 10];
  return Array.from({ length: 11 }, (_, y) => ({
    year: y,
    kindCurve: Math.round(100 * Math.pow(1.145, y)),
    irregular: Math.round(100 + y * 5 + volatility[y]),
  }));
}

export function generateSparklineData() {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i,
    value: +(15 + Math.sin(i * 0.8) * 3 + 1).toFixed(1),
  }));
}
