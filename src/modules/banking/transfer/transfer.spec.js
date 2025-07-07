import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { sql } from '../../../infrastructure/db.js'
import { createTransfer } from './transfer.service.js'

let userId, account1, account2

describe('Integration: createTransfer', () => {
  beforeAll(async () => {
    // Nettoyage
    await sql`DELETE FROM transfers`
    await sql`DELETE FROM accounts`
    await sql`DELETE FROM users`

    // Insertion d'un utilisateur
    const [{ id }] = await sql`
      INSERT INTO users (name, birthday)
      VALUES ('User1', NOW())
      RETURNING id
    `
    userId = id

    // Insertion de deux comptes
    const accounts = await sql`
      INSERT INTO accounts (userId, amount)
      VALUES (${userId}, 1000), (${userId}, 500)
      RETURNING id
    `
    account1 = accounts[0].id
    account2 = accounts[1].id
  })

  it('should transfer amount between accounts and update balances', async () => {
    await createTransfer(account1, account2, 200)

    const [updated1] = await sql`SELECT amount FROM accounts WHERE id = ${account1}`
    const [updated2] = await sql`SELECT amount FROM accounts WHERE id = ${account2}`
    const [transfer] = await sql`SELECT * FROM transfers WHERE sourceAccountId = ${account1} AND destAccountId = ${account2}`

    expect(updated1.amount).toBe(800)
    expect(updated2.amount).toBe(700)
    expect(transfer).toBeDefined()
    expect(transfer.amount).toBe(200)
  })

  afterAll(async () => {
    await sql.end()
  })
})
