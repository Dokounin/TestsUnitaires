import { describe, it, vi, expect, afterEach } from "vitest";
import { createExport } from "./export.service.js";


vi.mock("fs", async () => {
  return {
    default: {
      writeFileSync: vi.fn()
    }
  };
});


vi.mock("node-xlsx", async () => {
  return {
    default: {
      build: vi.fn(() => Buffer.from("fake-xlsx-content"))
    }
  };
});


vi.mock("../banking/transfer/transfer.repository.js", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    getTransfersFromRepository: vi.fn(() => [
      { id: 1, sourceAccountId: 10, destAccountId: 20, amount: 100 },
      { id: 2, sourceAccountId: 10, destAccountId: 30, amount: 200 }
    ])
  };
});

describe("Export Service", () => {
  afterEach(() => vi.clearAllMocks());

  it("should build and write an Excel file for account transfers", async () => {
    const result = await createExport(10);

    const { default: xlsx } = await import("node-xlsx");
    const { default: fs } = await import("fs");

    expect(xlsx.build).toHaveBeenCalledTimes(1);
    expect(xlsx.build).toHaveBeenCalledWith([
      {
        name: "Transferts",
        data: [
          ["ID", "Source", "Destination", "Montant"],
          [1, 10, 20, 100],
          [2, 10, 30, 200]
        ]
      }
    ]);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(result).toMatch(/transfers_10\.xlsx$/);
  });

  it("should throw if accountId is missing", async () => {
    await expect(() => createExport(null)).rejects.toThrow("accountId est requis");
  });
});
