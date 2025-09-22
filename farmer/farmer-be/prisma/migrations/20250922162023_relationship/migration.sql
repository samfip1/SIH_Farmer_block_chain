/*
  Warnings:

  - A unique constraint covering the columns `[fromUserId,toUserId]` on the table `distributor_requests` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."distributor_requests" ALTER COLUMN "productName" DROP NOT NULL,
ALTER COLUMN "quantity" DROP NOT NULL,
ALTER COLUMN "unit" DROP NOT NULL,
ALTER COLUMN "priceOffered" DROP NOT NULL,
ALTER COLUMN "qualityRequired" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "distributor_requests_fromUserId_toUserId_key" ON "public"."distributor_requests"("fromUserId", "toUserId");
