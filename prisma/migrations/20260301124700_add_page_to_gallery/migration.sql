/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Gallery` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Gallery_publicId_key" ON "Gallery"("publicId");

-- CreateIndex
CREATE INDEX "Gallery_page_idx" ON "Gallery"("page");
