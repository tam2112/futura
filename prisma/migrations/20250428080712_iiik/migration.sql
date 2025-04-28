/*
  Warnings:

  - The `startHours` column on the `Promotion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `endHours` column on the `Promotion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `statusId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "statusId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "endMinutes" INTEGER,
ADD COLUMN     "endSeconds" INTEGER,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "startMinutes" INTEGER,
ADD COLUMN     "startSeconds" INTEGER,
ADD COLUMN     "statusId" TEXT NOT NULL,
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL,
DROP COLUMN "startHours",
ADD COLUMN     "startHours" INTEGER,
DROP COLUMN "endHours",
ADD COLUMN     "endHours" INTEGER;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
