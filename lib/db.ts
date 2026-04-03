import { prisma } from "./prisma";

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

function toUser(row: { id: number; name: string; email: string; passwordHash: string }): User {
  return { id: row.id, name: row.name, email: row.email, password_hash: row.passwordHash };
}

export const usersDb = {
  async create(name: string, email: string, passwordHash: string): Promise<User> {
    const row = await prisma.user.create({
      data: { name, email, passwordHash },
    });
    return toUser(row);
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const row = await prisma.user.findUnique({ where: { email } });
    return row ? toUser(row) : undefined;
  },

  async findById(id: number): Promise<User | undefined> {
    const row = await prisma.user.findUnique({ where: { id } });
    return row ? toUser(row) : undefined;
  },
};

export const conversationsDb = {
  async getMessages(userId: number): Promise<Message[]> {
    const row = await prisma.conversation.findUnique({ where: { userId } });
    return row ? JSON.parse(row.messages) : [];
  },

  async saveMessages(userId: number, messages: Message[]): Promise<void> {
    await prisma.conversation.upsert({
      where: { userId },
      update: { messages: JSON.stringify(messages) },
      create: { userId, messages: JSON.stringify(messages) },
    });
  },
};
