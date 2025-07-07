import { HttpBadRequest, HttpNotFound } from "@httpx/exception";
import {
  createTransferInRepository,
  getTransfersFromRepository,
} from "./transfer.repository.js";
import {getAccountsFromRepositoryByIds, patchAccountInRepository } from "../account/account.repository.js";
import { sql } from "../../../infrastructure/db.js"


export async function createTransfer(sourceAccountId, destAccountId, amount) {
  if (!sourceAccountId || !destAccountId || typeof amount !== "number") {
    throw new HttpBadRequest("Paramètres invalides");
  }

  if (amount <= 0) {
    throw new HttpBadRequest("Le montant doit être positif");
  }

  const [source] = await getAccountsFromRepositoryByIds([sourceAccountId]);
  const [dest] = await getAccountsFromRepositoryByIds([destAccountId]);

  if (!source || !dest) {
    throw new HttpNotFound("Compte source ou destination introuvable");
  }

  if (source.amount < amount) {
    throw new HttpBadRequest("Solde insuffisant");
  }

  // Mise à jour des montants
  await patchAccountInRepository(sourceAccountId, source.amount - amount);
  await patchAccountInRepository(destAccountId, dest.amount + amount);

  return await createTransferInRepository(sourceAccountId, destAccountId, amount);
}

export async function getTransfers(userId) {
  return await getTransfersFromRepository(userId);
}

