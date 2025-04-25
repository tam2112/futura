/*
  Warnings:

  - You are about to drop the `_ProductBrands` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductBrands" DROP CONSTRAINT "_ProductBrands_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductBrands" DROP CONSTRAINT "_ProductBrands_B_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brandId" TEXT;

-- DropTable
DROP TABLE "_ProductBrands";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
