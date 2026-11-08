export type Exclusion = { giverId: string; receiverId: string };

/** Asignación: quién regala (clave) → a quién le regala (valor). */
export type Assignment = Map<string, string>;

export const MIN_PARTICIPANTS = 3;

type Rng = () => number;

function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildForbidden(exclusions: readonly Exclusion[]) {
  const forbidden = new Map<string, Set<string>>();
  for (const { giverId, receiverId } of exclusions) {
    if (!forbidden.has(giverId)) forbidden.set(giverId, new Set());
    forbidden.get(giverId)!.add(receiverId);
  }
  return forbidden;
}

/**
 * Realiza el sorteo del amigo secreto.
 *
 * Reglas: nadie se regala a sí mismo, se respetan las exclusiones y
 * cada persona da y recibe exactamente un regalo.
 *
 * Primero intenta muestreo por rechazo (resultado uniforme entre todas
 * las combinaciones válidas); si no encuentra una combinación, usa
 * búsqueda con retroceso, que garantiza encontrar una si existe.
 *
 * Devuelve `null` si no existe ninguna combinación posible.
 */
export function drawAssignments(
  ids: readonly string[],
  exclusions: readonly Exclusion[] = [],
  rng: Rng = Math.random,
): Assignment | null {
  if (new Set(ids).size !== ids.length) {
    throw new Error("Los participantes no pueden repetirse");
  }
  if (ids.length < 2) return null;

  const forbidden = buildForbidden(exclusions);
  const allowed = (giver: string, receiver: string) =>
    giver !== receiver && !forbidden.get(giver)?.has(receiver);

  // 1) Muestreo por rechazo.
  for (let attempt = 0; attempt < 2000; attempt++) {
    const receivers = shuffle(ids, rng);
    if (ids.every((giver, i) => allowed(giver, receivers[i]))) {
      return new Map(ids.map((giver, i) => [giver, receivers[i]]));
    }
  }

  // 2) Retroceso (backtracking), empezando por quien tiene menos opciones.
  const options = new Map(
    ids.map((giver) => [giver, ids.filter((r) => allowed(giver, r))]),
  );
  const givers = shuffle(ids, rng).sort(
    (a, b) => options.get(a)!.length - options.get(b)!.length,
  );
  const taken = new Set<string>();
  const result: Assignment = new Map();

  const solve = (index: number): boolean => {
    if (index === givers.length) return true;
    const giver = givers[index];
    for (const receiver of shuffle(options.get(giver)!, rng)) {
      if (taken.has(receiver)) continue;
      taken.add(receiver);
      result.set(giver, receiver);
      if (solve(index + 1)) return true;
      taken.delete(receiver);
      result.delete(giver);
    }
    return false;
  };

  return solve(0) ? result : null;
}
