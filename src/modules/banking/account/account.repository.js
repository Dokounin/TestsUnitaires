import { sql } from "../../../infrastructure/db";


export async function createAccountInRepository(userId, amount) {
  const accounts = await sql`
    INSERT INTO accounts (userId, amount)
    VALUES (${userId}, ${amount})
    RETURNING *
  `;
  return accounts[0];
}


export async function getAccountsFromRepository(userId) {
  const accounts = await sql`
    SELECT * FROM accounts
    WHERE userId = ${userId}
  `;
  return accounts;
}


export async function deleteAccountFromRepository(userId, accountId) {
  const result = await sql`
    DELETE FROM accounts
    WHERE id = ${accountId} AND userId = ${userId}
    RETURNING *
  `;
  return result.length > 0;
}

export async function patchAccountInRepository(accountId, newAmount) {
  const result = await sql`
    UPDATE accounts
    SET amount = ${newAmount}
    WHERE id = ${accountId}
    RETURNING *
  `;
  return result[0];
}


export async function getAccountsFromRepositoryByIds(ids) {
  const array = Array.isArray(ids) ? ids : [ids];

  const parsedIds = array
    .map((id) => parseInt(id, 10))
    .filter((id) => Number.isInteger(id));

  if (parsedIds.length === 0) {
    throw new Error("Aucun ID valide fourni");
  }

  const accounts = await sql`
    SELECT * FROM accounts
    WHERE id = ANY(${parsedIds})
  `;

  return accounts;
}

