export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  emailVerified: Date | null;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

function toUser(row: {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  emailVerified: Date | null;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
}): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password_hash: row.passwordHash,
    emailVerified: row.emailVerified,
    failedLoginAttempts: row.failedLoginAttempts,
    lockedUntil: row.lockedUntil,
  };
}

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export const usersDb = {
  async create(
    name: string,
    email: string,
    passwordHash: string,
    selectedTier: string = "free",
  ): Promise<User> {
    const { prisma } = await import("./prisma");
    const row = await prisma.user.create({
      data: { name, email, passwordHash, selectedTier },
    });
    return toUser(row);
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const { prisma } = await import("./prisma");
    const row = await prisma.user.findFirst({ where: { email, deletedAt: null } });
    return row ? toUser(row) : undefined;
  },

  async findDeletedByEmail(email: string): Promise<User | undefined> {
    const { prisma } = await import("./prisma");
    const row = await prisma.user.findFirst({ where: { email, deletedAt: { not: null } } });
    return row ? toUser(row) : undefined;
  },

  // Re-register a previously soft-deleted account: reuse the existing row
  // (satisfies the unique-email constraint) and reset it to a fresh state.
  // The user's Conversation is intentionally left intact so they resume
  // where they left off.
  async revive(
    userId: number,
    name: string,
    passwordHash: string,
    selectedTier: string = "free",
  ): Promise<User> {
    const { prisma } = await import("./prisma");
    const row = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        passwordHash,
        selectedTier,
        deletedAt: null,
        createdAt: new Date(),
        emailVerified: null,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
        passwordResetToken: null,
        passwordResetExpiry: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
        monthlyChatsUsed: 0,
        monthlyChatsResetAt: null,
        subscriptionStatus: "free",
        planTier: "free",
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        stripeCustomerId: null,
        crisisSignal: false,
        crisisSignalAt: null,
        crisisSignalExcerpt: null,
        crisisSignalKeyword: null,
      },
    });
    return toUser(row);
  },

  async findById(id: number): Promise<User | undefined> {
    const { prisma } = await import("./prisma");
    const row = await prisma.user.findFirst({ where: { id, deletedAt: null } });
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

  async setEmailVerificationToken(userId: number, token: string, expiry: Date): Promise<void> {
    const { prisma } = await import("./prisma");
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerificationToken: token, emailVerificationExpiry: expiry },
    });
  },

  async findByEmailVerificationToken(token: string): Promise<User | undefined> {
    const { prisma } = await import("./prisma");
    const row = await prisma.user.findUnique({ where: { emailVerificationToken: token } });
    return row ? toUser(row) : undefined;
  },

  async markEmailVerified(userId: number): Promise<void> {
    const { prisma } = await import("./prisma");
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date(), emailVerificationToken: null, emailVerificationExpiry: null },
    });
  },

  async recordFailedLogin(userId: number): Promise<void> {
    const { prisma } = await import("./prisma");
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { failedLoginAttempts: { increment: 1 } },
      select: { failedLoginAttempts: true },
    });
    if (updated.failedLoginAttempts >= LOCKOUT_THRESHOLD) {
      await prisma.user.update({
        where: { id: userId },
        data: { lockedUntil: new Date(Date.now() + LOCKOUT_DURATION_MS) },
      });
    }
  },

  async clearFailedLogin(userId: number): Promise<void> {
    const { prisma } = await import("./prisma");
    await prisma.user.update({
      where: { id: userId },
      data: { failedLoginAttempts: 0, lockedUntil: null },
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
