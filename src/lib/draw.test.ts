import { describe, expect, it } from "vitest";
import { drawAssignments, type Assignment, type Exclusion } from "./draw";

function expectValid(
  ids: string[],
  result: Assignment | null,
  exclusions: Exclusion[] = [],
) {
  expect(result).not.toBeNull();
  const assignment = result!;
  expect(assignment.size).toBe(ids.length);
  // Todos regalan y todos reciben exactamente una vez.
  expect(new Set(assignment.keys())).toEqual(new Set(ids));
  expect(new Set(assignment.values())).toEqual(new Set(ids));
  for (const [giver, receiver] of assignment) {
    expect(giver).not.toBe(receiver);
  }
  for (const { giverId, receiverId } of exclusions) {
    expect(assignment.get(giverId)).not.toBe(receiverId);
  }
}

const people = (n: number) => Array.from({ length: n }, (_, i) => `p${i}`);

describe("drawAssignments", () => {
  it("nadie se regala a sí mismo y todos reciben un regalo", () => {
    for (let n = 2; n <= 30; n++) {
      for (let k = 0; k < 20; k++) {
        const ids = people(n);
        expectValid(ids, drawAssignments(ids));
      }
    }
  });

  it("respeta las exclusiones", () => {
    const ids = ["ana", "pedro", "luis", "sofia", "marta"];
    const exclusions: Exclusion[] = [
      { giverId: "ana", receiverId: "pedro" },
      { giverId: "pedro", receiverId: "ana" },
      { giverId: "luis", receiverId: "sofia" },
      { giverId: "sofia", receiverId: "luis" },
    ];
    for (let k = 0; k < 200; k++) {
      expectValid(ids, drawAssignments(ids, exclusions), exclusions);
    }
  });

  it("encuentra la única solución posible con muchas restricciones", () => {
    // Solo se permite el ciclo a → b → c → d → a.
    const ids = ["a", "b", "c", "d"];
    const next: Record<string, string> = { a: "b", b: "c", c: "d", d: "a" };
    const exclusions: Exclusion[] = [];
    for (const g of ids) {
      for (const r of ids) {
        if (g !== r && next[g] !== r) exclusions.push({ giverId: g, receiverId: r });
      }
    }
    const result = drawAssignments(ids, exclusions);
    expectValid(ids, result, exclusions);
    expect(Object.fromEntries(result!)).toEqual(next);
  });

  it("devuelve null cuando es imposible", () => {
    // "a" no puede regalarle a nadie.
    const ids = ["a", "b", "c"];
    const exclusions: Exclusion[] = [
      { giverId: "a", receiverId: "b" },
      { giverId: "a", receiverId: "c" },
    ];
    expect(drawAssignments(ids, exclusions)).toBeNull();
    expect(drawAssignments(["solo"])).toBeNull();
    expect(drawAssignments([])).toBeNull();
  });

  it("rechaza participantes repetidos", () => {
    expect(() => drawAssignments(["a", "a", "b"])).toThrow();
  });

  it("produce resultados variados", () => {
    const ids = people(5);
    const seen = new Set<string>();
    for (let k = 0; k < 200; k++) {
      seen.add(JSON.stringify([...drawAssignments(ids)!]));
    }
    // Hay 44 desarreglos de 5 elementos; deberíamos ver bastantes.
    expect(seen.size).toBeGreaterThan(20);
  });
});
