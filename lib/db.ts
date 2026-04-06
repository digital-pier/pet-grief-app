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
    const { prisma } = await import("./prisma");
    const row = await prisma.user.create({
      data: { name, email, passwordHash },
    });
    return toUser(row);
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const { prisma } = await import("./prisma");
    const row = await prisma.user.findUnique({ where: { email } });
    return row ? toUser(row) : undefined;
  },

  async findById(id: number): Promise<User | undefined> {
    const { prisma } = await import("./prisma");
    const row = await prisma.user.findUnique({ where: { id } });
    return row ? toUser(row) : undefined;
  },

  async setResetToken(email: string, token: string, expiry: Date): Promise<void> {
    const { prisma } = await import("./prisma");
    await prisma.user.update({
      where: { email },
      data: { passwordResetToken: token, passwordResetExpiry: expiry },
    });
  },

  async findByResetToken(token: string): Promise<User | undefined> {
    const { prisma } = await import("./prisma");
    const row = await prisma.user.findUnique({ where: { passwordResetToken: token } });
    return row ? toUser(row) : undefined;
  },

  async updatePassword(email: string, passwordHash: string): Promise<void> {
    const { prisma } = await import("./prisma");
    await prisma.user.update({
      where: { email },
      data: { passwordHash, passwordResetToken: null, passwordResetExpiry: null },
    });
  },
};

export const conversationsDb = {
  async getMessages(userId: number): Promise<Message[]> {
    const { prisma } = await import("./prisma");
    const row = await prisma.conversation.findUnique({ where: { userId } });
    return row ? JSON.parse(row.messages) : [];
  },

  async saveMessages(userId: number, messages: Message[]): Promise<void> {
    const { prisma } = await import("./prisma");
    await prisma.conversation.upsert({
      where: { userId },
      update: { messages: JSON.stringify(messages) },
      create: { userId, messages: JSON.stringify(messages) },
    });
  },
};
