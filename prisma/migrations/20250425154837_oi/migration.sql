/*
  Warnings:

  - You are about to drop the column `quantity` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the `_ProductBatteryHealths` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductColors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductConnectivities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductCpus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductRams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductScreenSizes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductSimSlots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductStorages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductTypes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductBatteryHealths" DROP CONSTRAINT "_ProductBatteryHealths_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductBatteryHealths" DROP CONSTRAINT "_ProductBatteryHealths_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductColors" DROP CONSTRAINT "_ProductColors_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductColors" DROP CONSTRAINT "_ProductColors_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductConnectivities" DROP CONSTRAINT "_ProductConnectivities_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductConnectivities" DROP CONSTRAINT "_ProductConnectivities_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductCpus" DROP CONSTRAINT "_ProductCpus_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductCpus" DROP CONSTRAINT "_ProductCpus_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductRams" DROP CONSTRAINT "_ProductRams_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductRams" DROP CONSTRAINT "_ProductRams_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductScreenSizes" DROP CONSTRAINT "_ProductScreenSizes_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductScreenSizes" DROP CONSTRAINT "_ProductScreenSizes_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductSimSlots" DROP CONSTRAINT "_ProductSimSlots_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductSimSlots" DROP CONSTRAINT "_ProductSimSlots_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductStorages" DROP CONSTRAINT "_ProductStorages_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductStorages" DROP CONSTRAINT "_ProductStorages_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductTypes" DROP CONSTRAINT "_ProductTypes_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductTypes" DROP CONSTRAINT "_ProductTypes_B_fkey";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "quantity",
ADD COLUMN     "quantityBatteryHealth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantityBrand" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantityColor" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantityConnectivity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantityCpu" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantityProduct" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantityRam" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantityScreenSize" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantitySimSlot" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantityStorage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantityType" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "batteryHealthId" TEXT,
ADD COLUMN     "colorId" TEXT,
ADD COLUMN     "connectivityId" TEXT,
ADD COLUMN     "cpuId" TEXT,
ADD COLUMN     "ramId" TEXT,
ADD COLUMN     "screenSizeId" TEXT,
ADD COLUMN     "simSlotId" TEXT,
ADD COLUMN     "storageId" TEXT,
ADD COLUMN     "typeId" TEXT;

-- DropTable
DROP TABLE "_ProductBatteryHealths";

-- DropTable
DROP TABLE "_ProductColors";

-- DropTable
DROP TABLE "_ProductConnectivities";

-- DropTable
DROP TABLE "_ProductCpus";

-- DropTable
DROP TABLE "_ProductRams";

-- DropTable
DROP TABLE "_ProductScreenSizes";

-- DropTable
DROP TABLE "_ProductSimSlots";

-- DropTable
DROP TABLE "_ProductStorages";

-- DropTable
DROP TABLE "_ProductTypes";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "Storage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_connectivityId_fkey" FOREIGN KEY ("connectivityId") REFERENCES "Connectivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_simSlotId_fkey" FOREIGN KEY ("simSlotId") REFERENCES "SimSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_batteryHealthId_fkey" FOREIGN KEY ("batteryHealthId") REFERENCES "BatteryHealth"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_ramId_fkey" FOREIGN KEY ("ramId") REFERENCES "Ram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_cpuId_fkey" FOREIGN KEY ("cpuId") REFERENCES "Cpu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_screenSizeId_fkey" FOREIGN KEY ("screenSizeId") REFERENCES "ScreenSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE SET NULL ON UPDATE CASCADE;
