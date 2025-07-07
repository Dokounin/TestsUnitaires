CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  birthday TIMESTAMP
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  userId INT REFERENCES users(id),
  amount FLOAT
);

CREATE TABLE transfers (
  id SERIAL PRIMARY KEY,
  sourceAccountId INT REFERENCES accounts(id),
  destAccountId INT REFERENCES accounts(id),
  amount FLOAT
);

INSERT INTO users (name, birthday)
VALUES
  ('Valentin M', 'Wed Apr 03 2024 15:53:47'),
  ('Arthur R', 'Wed Apr 03 2024 15:53:47')