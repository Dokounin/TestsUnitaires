import { sql } from "../../../infrastructure/db";

export async function createTransferInRepository(sourceAccountId, destAccountId, amount) {
  const transfers = await sql`
    INSERT INTO transfers (sourceAccountId, destAccountId, amount)
    VALUES (${sourceAccountId}, ${destAccountId}, ${amount})
    RETURNING *
  `;
  return transfers[0];
}


export async function getTransfersFromRepository(userId) {
  const transfers = await sql`
    SELECT t.*
    FROM transfers t
    JOIN accounts sa ON sa.id = t.sourceAccountId
    WHERE sa.userId = ${userId}
  `;
  return transfers;
}
