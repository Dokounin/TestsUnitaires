import { afterEach, assert, describe, it, vi, expect } from "vitest";
import { createAccount, getAccounts, deleteAccount } from "./account.service";
import { createAccountInRepository, getAccountsFromRepository, deleteAccountFromRepository } from "./account.repository";

vi.mock("./account.repository", async (importOriginal) => ({
  ...(await importOriginal()),
  createAccountInRepository: vi.fn((userId, amount) => {
    return {
      id: 1,
      userId,
      amount,
    };
  }),
  getAccountsFromRepository: vi.fn((userId) => {
    return [
      { id: 1, userId, amount: 100 },
      { id: 2, userId, amount: 250 },
    ];
  }),
  deleteAccountFromRepository: vi.fn((userId, accountId) => {
    if (accountId === 999) return false; 
    return true;
  }),
}));

describe("Account Service", () => {
  afterEach(() => vi.clearAllMocks());

  it(" should create an account", async () => {
    const account = await createAccount(1, 100);
    expect(account).toBeDefined();
    expect(account.id).toBeDefined();
    expect(account.userId).toBe(1);
    expect(account.amount).toBe(100);
    expect(createAccountInRepository).toBeCalledTimes(1);
    expect(createAccountInRepository).toBeCalledWith(1, 100);
  });

  it(" should fail to create an account with invalid params", async () => {
    try {
      await createAccount(null, -50);
      assert.fail("createAccount should trigger an error.");
    } catch (e) {
      expect(e.name).toBe("HttpBadRequest");
    }
  });

  it(" should get all accounts for a user", async () => {
    const accounts = await getAccounts(1);
    expect(accounts).toHaveLength(2);
    expect(accounts[0]).toHaveProperty("id");
    expect(accounts[0]).toHaveProperty("userId", 1);
    expect(accounts[0]).toHaveProperty("amount");
    expect(getAccountsFromRepository).toBeCalledTimes(1);
    expect(getAccountsFromRepository).toBeCalledWith(1);
  });

  it(" should delete an account successfully", async () => {
    const result = await deleteAccount(1, 2);
    expect(result).toBe(true);
    expect(deleteAccountFromRepository).toBeCalledWith(1, 2);
  });

  it(" should throw if account to delete doesn't exist", async () => {
    try {
      await deleteAccount(1, 999); 
      assert.fail("deleteAccount should trigger an error.");
    } catch (e) {
      expect(e.name).toBe("HttpNotFound");
    }
  });
});
