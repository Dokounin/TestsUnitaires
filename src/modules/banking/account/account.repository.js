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
  // Si ids est un seul nombre ou une string, on le transforme en tableau
  const array = Array.isArray(ids) ? ids : [ids]

  // Conversion explicite en entiers
  const parsedIds = array.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id))

  // Important : 'int4' est correct pour PostgreSQL si 'id' est bien un INTEGER
  const accounts = await sql`
    SELECT * FROM accounts
    WHERE id = ANY(${sql.array(parsedIds, 'int4')})
  `

  return accounts
}