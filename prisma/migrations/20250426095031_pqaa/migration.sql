/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Promotion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Promotion" DROP CONSTRAINT "Promotion_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Promotion" DROP CONSTRAINT "Promotion_productId_fkey";

-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "categoryId",
DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "_ProductPromotions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductPromotions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CategoryPromotions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryPromotions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductPromotions_B_index" ON "_ProductPromotions"("B");

-- CreateIndex
CREATE INDEX "_CategoryPromotions_B_index" ON "_CategoryPromotions"("B");

-- AddForeignKey
ALTER TABLE "_ProductPromotions" ADD CONSTRAINT "_ProductPromotions_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductPromotions" ADD CONSTRAINT "_ProductPromotions_B_fkey" FOREIGN KEY ("B") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryPromotions" ADD CONSTRAINT "_CategoryPromotions_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryPromotions" ADD CONSTRAINT "_CategoryPromotions_B_fkey" FOREIGN KEY ("B") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
