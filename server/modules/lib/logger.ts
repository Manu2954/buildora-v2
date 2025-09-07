import { randomUUID } from "node:crypto";

export function requestIdGen() {
  return randomUUID();
}

