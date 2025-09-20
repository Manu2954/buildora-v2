import { describe, it, expect } from "vitest";
import { DesignsListQuerySchema, DesignCreateSchema } from "../features/designs/designs.schemas";

describe("designs schemas", () => {
  it("parses list query", () => {
    const q = DesignsListQuerySchema.parse({ page: "1", pageSize: "10", budget: "PREMIUM" });
    expect(q.page).toBe(1);
    expect(q.pageSize).toBe(10);
    expect(q.budget).toBe("PREMIUM");
  });

  it("validates create payload", () => {
    const d = DesignCreateSchema.parse({ title: "Desk", basePriceCents: 20000, images: ["https://example.com/x.jpg"] });
    expect(d.title).toBe("Desk");
  });
});

