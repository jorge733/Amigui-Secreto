import { randomBytes, randomUUID } from "node:crypto";

export const newId = () => randomUUID();

/** Token aleatorio, seguro para URL. 18 bytes ≈ 144 bits de entropía. */
export const newToken = (bytes = 18) => randomBytes(bytes).toString("base64url");
