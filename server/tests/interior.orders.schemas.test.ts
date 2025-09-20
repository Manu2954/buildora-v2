import { describe, it, expect } from "vitest";
import { AddItemSchema, SubmitOrderSchema } from "../features/interior/orders.schemas";

describe("interior orders schemas", () => {
  it("parses add item", () => {
    const a = AddItemSchema.parse({ designId: "d1", quantity: 2, selectedOptions: { material: "Premium" } });
    expect(a.designId).toBe("d1");
    expect(a.quantity).toBe(2);
  });
  it("parses submit", () => {
    const s = SubmitOrderSchema.parse({ consultationRequested: true });
    expect(s.consultationRequested).toBe(true);
  });
});

