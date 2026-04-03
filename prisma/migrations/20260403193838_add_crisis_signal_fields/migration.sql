-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripe_customer_id" TEXT,
    "subscription_status" TEXT NOT NULL DEFAULT 'free',
    "plan_tier" TEXT NOT NULL DEFAULT 'free',
    "current_period_start" DATETIME,
    "current_period_end" DATETIME,
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "monthly_chats_used" INTEGER NOT NULL DEFAULT 0,
    "monthly_chats_reset_at" DATETIME,
    "crisis_signal" BOOLEAN NOT NULL DEFAULT false,
    "crisis_signal_at" DATETIME
);
INSERT INTO "new_users" ("cancel_at_period_end", "created_at", "current_period_end", "current_period_start", "email", "id", "monthly_chats_reset_at", "monthly_chats_used", "name", "password_hash", "plan_tier", "stripe_customer_id", "subscription_status") SELECT "cancel_at_period_end", "created_at", "current_period_end", "current_period_start", "email", "id", "monthly_chats_reset_at", "monthly_chats_used", "name", "password_hash", "plan_tier", "stripe_customer_id", "subscription_status" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
