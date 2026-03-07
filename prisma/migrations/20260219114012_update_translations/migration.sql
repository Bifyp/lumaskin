/*
  Warnings:

  - You are about to drop the column `locale` on the `Translation` table. All the data in the column will be lost.
  - You are about to drop the column `namespace` on the `Translation` table. All the data in the column will be lost.
  - Added the required column `lang` to the `Translation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section` to the `Translation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Translation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lang" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Translation" ("id", "key", "value") SELECT "id", "key", "value" FROM "Translation";
DROP TABLE "Translation";
ALTER TABLE "new_Translation" RENAME TO "Translation";
CREATE INDEX "Translation_lang_idx" ON "Translation"("lang");
CREATE INDEX "Translation_section_idx" ON "Translation"("section");
CREATE UNIQUE INDEX "Translation_lang_section_key_key" ON "Translation"("lang", "section", "key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
