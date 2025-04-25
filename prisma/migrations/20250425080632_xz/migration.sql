-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "quantityProduct" INTEGER NOT NULL DEFAULT 0,
    "quantityStorage" INTEGER NOT NULL DEFAULT 0,
    "quantityBrand" INTEGER NOT NULL DEFAULT 0,
    "quantityColor" INTEGER NOT NULL DEFAULT 0,
    "quantityConnectivity" INTEGER NOT NULL DEFAULT 0,
    "quantitySimSlot" INTEGER NOT NULL DEFAULT 0,
    "quantityBatteryHealth" INTEGER NOT NULL DEFAULT 0,
    "quantityRam" INTEGER NOT NULL DEFAULT 0,
    "quantityCpu" INTEGER NOT NULL DEFAULT 0,
    "quantityScreenSize" INTEGER NOT NULL DEFAULT 0,
    "quantityType" INTEGER NOT NULL DEFAULT 0,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,
    "brandId" TEXT,
    "colorId" TEXT,
    "storageId" TEXT,
    "connectivityId" TEXT,
    "simSlotId" TEXT,
    "batteryHealthId" TEXT,
    "ramId" TEXT,
    "cpuId" TEXT,
    "screenSizeId" TEXT,
    "typeId" TEXT,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "Storage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_connectivityId_fkey" FOREIGN KEY ("connectivityId") REFERENCES "Connectivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_simSlotId_fkey" FOREIGN KEY ("simSlotId") REFERENCES "SimSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_batteryHealthId_fkey" FOREIGN KEY ("batteryHealthId") REFERENCES "BatteryHealth"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_ramId_fkey" FOREIGN KEY ("ramId") REFERENCES "Ram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_cpuId_fkey" FOREIGN KEY ("cpuId") REFERENCES "Cpu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_screenSizeId_fkey" FOREIGN KEY ("screenSizeId") REFERENCES "ScreenSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE SET NULL ON UPDATE CASCADE;
