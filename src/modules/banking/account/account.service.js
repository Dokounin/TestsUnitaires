import { HttpBadRequest, HttpNotFound } from "@httpx/exception";
import {
  createAccountInRepository,
  getAccountsFromRepository,
  deleteAccountFromRepository,
} from "./account.repository.js";

export async function createAccount(userId, amount) {
  if (!userId || typeof amount !== "number" || amount < 0) {
    throw new HttpBadRequest("Paramètres invalides pour la création de compte.");
  }

  return await createAccountInRepository(userId, amount);
}

export async function getAccounts(userId) {
  return await getAccountsFromRepository(userId);
}

export async function deleteAccount(userId, accountId) {
  const success = await deleteAccountFromRepository(userId, accountId);

  if (!success) {
    throw new HttpNotFound("Le compte spécifié est introuvable.");
  }

  return true;
}
