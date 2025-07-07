import { sql } from "../../../infrastructure/db";

export async function createUserInRepository({ name, birthday }) {
  const users = await sql`
    INSERT INTO users (name, birthday)
    VALUES (${name}, ${birthday})
    RETURNING *
    `;

  return users[0];
}
