-- CreateTable
CREATE TABLE "ExternalCalendar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icalUrl" TEXT NOT NULL,
    "lastSyncedAt" DATETIME,
    "lastSyncError" TEXT,
    "lastSyncCount" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlockedRange" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "reason" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_BlockedRange" ("createdAt", "end", "id", "reason", "start") SELECT "createdAt", "end", "id", "reason", "start" FROM "BlockedRange";
DROP TABLE "BlockedRange";
ALTER TABLE "new_BlockedRange" RENAME TO "BlockedRange";
CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "pricePerNight" REAL NOT NULL DEFAULT 75,
    "cleaningFee" REAL NOT NULL DEFAULT 35,
    "minNights" INTEGER NOT NULL DEFAULT 2,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "contactEmail" TEXT NOT NULL DEFAULT '',
    "contactPhone" TEXT NOT NULL DEFAULT '',
    "icalExportToken" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Settings" ("cleaningFee", "contactEmail", "contactPhone", "currency", "id", "minNights", "pricePerNight", "updatedAt") SELECT "cleaningFee", "contactEmail", "contactPhone", "currency", "id", "minNights", "pricePerNight", "updatedAt" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
