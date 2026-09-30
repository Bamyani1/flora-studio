import { describe, expect, it } from "vitest";
import { balanceColumns, justifyRows } from "@/lib/album-layout";

const P = 2 / 3;
const L = 3 / 2;
const DESKTOP = { targetHeight: 0.48, maxHeight: 0.55, maxPerRow: 4 };
const PHONE = { targetHeight: 0.72, maxHeight: 1.25, maxPerRow: 3 };

const sizes = (rows: { start: number; end: number }[]) => rows.map((r) => r.end - r.start);

describe("justifyRows", () => {
  it("returns no rows for no photos", () => {
    expect(justifyRows([], DESKTOP)).toEqual([]);
  });

  it("puts portraits three to a row on desktop", () => {
    expect(sizes(justifyRows(Array(6).fill(P), DESKTOP))).toEqual([3, 3]);
  });

  it("pairs landscapes on desktop instead of running them full width", () => {
    expect(sizes(justifyRows(Array(4).fill(L), DESKTOP))).toEqual([2, 2]);
  });

  it("keeps portraits two-up on phones and never strands a single one", () => {
    const rows = sizes(justifyRows(Array(5).fill(P), PHONE));
    expect(rows.reduce((a, b) => a + b, 0)).toBe(5);
    expect(rows).not.toContain(1);
    expect(Math.max(...rows)).toBeLessThanOrEqual(3);
  });

  it("gives landscapes their own row on phones", () => {
    expect(sizes(justifyRows([P, P, L, P, P], PHONE))).toEqual([2, 1, 2]);
  });

  it("covers every photo exactly once, in order", () => {
    const ratios = [P, L, P, P, L, L, P, P, P, L, P];
    const rows = justifyRows(ratios, DESKTOP);
    expect(rows[0].start).toBe(0);
    expect(rows.at(-1)?.end).toBe(ratios.length);
    rows.slice(1).forEach((row, i) => expect(row.start).toBe(rows[i].end));
    rows.forEach((row) => expect(row.end - row.start).toBeLessThanOrEqual(4));
  });

  it("centres an under-filled row with spacers instead of blowing it up", () => {
    const [row] = justifyRows([P], DESKTOP);
    expect(row.spacer).toBeCloseTo((1 / 0.55 - P) / 2);
    // Rendered height = 1 / (sum + 2 * spacer) = maxHeight
    expect(1 / (P + 2 * row.spacer)).toBeCloseTo(0.55);
  });

  it("adds no spacer to a full row", () => {
    expect(justifyRows([P, P, P], DESKTOP)[0].spacer).toBe(0);
  });
});

describe("balanceColumns", () => {
  it("keeps a lone album in the first column", () => {
    expect(balanceColumns([1.4], 0.3)).toBe(1);
    expect(balanceColumns([], 0.3)).toBe(0);
  });

  it("splits equal cards so the offset column is not the taller one by much", () => {
    // 11 equal cards, right column starts 0.3 lower: 6 left, 5 right
    expect(balanceColumns(Array(11).fill(1.5), 0.3)).toBe(6);
  });

  it("moves the split to balance tall and short cards", () => {
    // One tall card then six short ones: 3 left (3.3) vs 4 right (0.3 + 3.6)
    expect(balanceColumns([1.5, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9], 0.3)).toBe(3);
  });
});
