import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), ".data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(path.join(DATA_DIR, "peternal.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS conversations (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    messages TEXT NOT NULL DEFAULT '[]',
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
`);

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export const usersDb = {
  create(name: string, email: string, passwordHash: string): User {
    const stmt = db.prepare(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)"
    );
    const result = stmt.run(name, email, passwordHash);
    return { id: result.lastInsertRowid as number, name, email, password_hash: passwordHash };
  },

  findByEmail(email: string): User | undefined {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined;
  },

  findById(id: number): User | undefined {
    return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
  },
};

export const conversationsDb = {
  getMessages(userId: number): Message[] {
    const row = db
      .prepare("SELECT messages FROM conversations WHERE user_id = ?")
      .get(userId) as { messages: string } | undefined;
    return row ? JSON.parse(row.messages) : [];
  },

  saveMessages(userId: number, messages: Message[]): void {
    db.prepare(`
      INSERT INTO conversations (user_id, messages, updated_at)
      VALUES (?, ?, unixepoch())
      ON CONFLICT(user_id) DO UPDATE SET messages = excluded.messages, updated_at = unixepoch()
    `).run(userId, JSON.stringify(messages));
  },
};
