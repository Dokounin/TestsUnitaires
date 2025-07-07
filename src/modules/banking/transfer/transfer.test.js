import { afterEach, assert, describe, it, vi, expect } from "vitest";
import { createTransfer, getTransfers } from "./transfer.service";
import {
  getAccountsFromRepositoryByIds,
  patchAccountInRepository,
  getAccountsFromRepositoryByIds
} from "../account/account.repository";

vi.mock("./transfer.repository", async (importOriginal) => ({
  ...(await importOriginal()),
  createTransferInRepository: vi.fn((sourceId, destId, amount) => ({
    id: 1,
    sourceAccountId: sourceId,
    destAccountId: destId,
    amount,
  })),
  getTransfersFromRepository: vi.fn(() => [
    { id: 1, sourceAccountId: 1, destAccountId: 2, amount: 100 },
  ]),
}));

vi.mock("../account/account.repository", async (importOriginal) => ({
  ...(await importOriginal()),
  getAccountsFromRepositoryByIds: vi.fn((ids) =>
    ids.map((id) => ({ id, amount: 500 }))
  ),
  patchAccountInRepository: vi.fn(),
}));

describe("Transfer Service", () => {
  afterEach(() => vi.clearAllMocks());

  it(" should create transfer", async () => {
    const transfer = await createTransfer(1, 2, 100);
    expect(transfer).toBeDefined();
    expect(transfer.amount).toBe(100);
    expect(patchAccountInRepository).toHaveBeenCalledTimes(2);
  });

  it(" should fail on invalid params", async () => {
    try {
      await createTransfer(null, 2, 100);
      assert.fail("Should have thrown");
    } catch (e) {
      expect(e.name).toBe("HttpBadRequest");
    }
  });

  it(" should fail if amount too high", async () => {
    getAccountsFromRepositoryByIds.mockResolvedValueOnce([
      { id: 1, amount: 50 },
      { id: 2, amount: 0 },
    ]);

    try {
      await createTransfer(1, 2, 100);
      assert.fail("Should have thrown");
    } catch (e) {
      expect(e.name).toBe("HttpBadRequest");
    }
  });

  it(" should fail with negative amount", async () => {
    try {
      await createTransfer(1, 2, -10);
      assert.fail("Should have thrown");
    } catch (e) {
      expect(e.name).toBe("HttpBadRequest");
    }
  });

  it(" should get all transfers for user", async () => {
    const transfers = await getTransfers(1);
    expect(transfers).toHaveLength(1);
    expect(transfers[0]).toHaveProperty("id");
    expect(transfers[0]).toHaveProperty("sourceAccountId");
  });
});
