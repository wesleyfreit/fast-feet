/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryManId` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `recipientId` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Recipient` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Recipient` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `recipient_id` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Delivery" DROP CONSTRAINT "Delivery_deliveryManId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Delivery" DROP CONSTRAINT "Delivery_recipientId_fkey";

-- AlterTable
ALTER TABLE "public"."Delivery" DROP COLUMN "createdAt",
DROP COLUMN "deliveryManId",
DROP COLUMN "recipientId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "delivery_man_id" TEXT,
ADD COLUMN     "recipient_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Recipient" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "public"."Delivery" ADD CONSTRAINT "Delivery_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."Recipient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Delivery" ADD CONSTRAINT "Delivery_delivery_man_id_fkey" FOREIGN KEY ("delivery_man_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
