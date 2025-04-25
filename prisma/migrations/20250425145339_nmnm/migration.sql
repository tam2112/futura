/*
  Warnings:

  - You are about to drop the column `quantityBatteryHealth` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `quantityBrand` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `quantityColor` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `quantityConnectivity` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `quantityCpu` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `quantityProduct` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `quantityRam` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `quantityScreenSize` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `quantitySimSlot` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `quantityStorage` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `quantityType` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `batteryHealthId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `brandId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `colorId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `connectivityId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `cpuId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `ramId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `screenSizeId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `simSlotId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `storageId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_batteryHealthId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_brandId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_colorId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_connectivityId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_cpuId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_ramId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_screenSizeId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_simSlotId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_storageId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_typeId_fkey";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "quantityBatteryHealth",
DROP COLUMN "quantityBrand",
DROP COLUMN "quantityColor",
DROP COLUMN "quantityConnectivity",
DROP COLUMN "quantityCpu",
DROP COLUMN "quantityProduct",
DROP COLUMN "quantityRam",
DROP COLUMN "quantityScreenSize",
DROP COLUMN "quantitySimSlot",
DROP COLUMN "quantityStorage",
DROP COLUMN "quantityType",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "batteryHealthId",
DROP COLUMN "brandId",
DROP COLUMN "colorId",
DROP COLUMN "connectivityId",
DROP COLUMN "cpuId",
DROP COLUMN "ramId",
DROP COLUMN "screenSizeId",
DROP COLUMN "simSlotId",
DROP COLUMN "storageId",
DROP COLUMN "typeId";

-- CreateTable
CREATE TABLE "_ProductStorages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductStorages_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductSimSlots" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductSimSlots_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductRams" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductRams_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductScreenSizes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductScreenSizes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductTypes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductBrands" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductBrands_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductColors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductColors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductConnectivities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductConnectivities_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductBatteryHealths" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductBatteryHealths_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductCpus" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductCpus_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductStorages_B_index" ON "_ProductStorages"("B");

-- CreateIndex
CREATE INDEX "_ProductSimSlots_B_index" ON "_ProductSimSlots"("B");

-- CreateIndex
CREATE INDEX "_ProductRams_B_index" ON "_ProductRams"("B");

-- CreateIndex
CREATE INDEX "_ProductScreenSizes_B_index" ON "_ProductScreenSizes"("B");

-- CreateIndex
CREATE INDEX "_ProductTypes_B_index" ON "_ProductTypes"("B");

-- CreateIndex
CREATE INDEX "_ProductBrands_B_index" ON "_ProductBrands"("B");

-- CreateIndex
CREATE INDEX "_ProductColors_B_index" ON "_ProductColors"("B");

-- CreateIndex
CREATE INDEX "_ProductConnectivities_B_index" ON "_ProductConnectivities"("B");

-- CreateIndex
CREATE INDEX "_ProductBatteryHealths_B_index" ON "_ProductBatteryHealths"("B");

-- CreateIndex
CREATE INDEX "_ProductCpus_B_index" ON "_ProductCpus"("B");

-- AddForeignKey
ALTER TABLE "_ProductStorages" ADD CONSTRAINT "_ProductStorages_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductStorages" ADD CONSTRAINT "_ProductStorages_B_fkey" FOREIGN KEY ("B") REFERENCES "Storage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSimSlots" ADD CONSTRAINT "_ProductSimSlots_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSimSlots" ADD CONSTRAINT "_ProductSimSlots_B_fkey" FOREIGN KEY ("B") REFERENCES "SimSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductRams" ADD CONSTRAINT "_ProductRams_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductRams" ADD CONSTRAINT "_ProductRams_B_fkey" FOREIGN KEY ("B") REFERENCES "Ram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductScreenSizes" ADD CONSTRAINT "_ProductScreenSizes_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductScreenSizes" ADD CONSTRAINT "_ProductScreenSizes_B_fkey" FOREIGN KEY ("B") REFERENCES "ScreenSize"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTypes" ADD CONSTRAINT "_ProductTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTypes" ADD CONSTRAINT "_ProductTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductBrands" ADD CONSTRAINT "_ProductBrands_A_fkey" FOREIGN KEY ("A") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductBrands" ADD CONSTRAINT "_ProductBrands_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductColors" ADD CONSTRAINT "_ProductColors_A_fkey" FOREIGN KEY ("A") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductColors" ADD CONSTRAINT "_ProductColors_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductConnectivities" ADD CONSTRAINT "_ProductConnectivities_A_fkey" FOREIGN KEY ("A") REFERENCES "Connectivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductConnectivities" ADD CONSTRAINT "_ProductConnectivities_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductBatteryHealths" ADD CONSTRAINT "_ProductBatteryHealths_A_fkey" FOREIGN KEY ("A") REFERENCES "BatteryHealth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductBatteryHealths" ADD CONSTRAINT "_ProductBatteryHealths_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCpus" ADD CONSTRAINT "_ProductCpus_A_fkey" FOREIGN KEY ("A") REFERENCES "Cpu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCpus" ADD CONSTRAINT "_ProductCpus_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
