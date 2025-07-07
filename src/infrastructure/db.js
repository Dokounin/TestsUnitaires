const postgres = require("postgres");

export const sql = postgres({ db: "mydb", user: "user", password: "password" });
