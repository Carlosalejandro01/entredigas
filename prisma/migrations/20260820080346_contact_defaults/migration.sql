-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "pricePerNight" REAL NOT NULL DEFAULT 75,
    "cleaningFee" REAL NOT NULL DEFAULT 35,
    "minNights" INTEGER NOT NULL DEFAULT 2,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "contactEmail" TEXT NOT NULL DEFAULT 'entrevigasapartamentosdm@gmail.com',
    "contactPhone" TEXT NOT NULL DEFAULT '+34 634 218 140',
    "icalExportToken" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Settings" ("cleaningFee", "contactEmail", "contactPhone", "currency", "icalExportToken", "id", "minNights", "pricePerNight", "updatedAt") SELECT "cleaningFee", "contactEmail", "contactPhone", "currency", "icalExportToken", "id", "minNights", "pricePerNight", "updatedAt" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
