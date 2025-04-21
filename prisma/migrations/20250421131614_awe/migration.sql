/*
  Warnings:

  - You are about to drop the column `categoryId` on the `BatteryHealth` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Color` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Connectivity` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Cpu` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Ram` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `ScreenSize` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `SimSlot` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Storage` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Type` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BatteryHealth" DROP CONSTRAINT "BatteryHealth_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Color" DROP CONSTRAINT "Color_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Connectivity" DROP CONSTRAINT "Connectivity_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Cpu" DROP CONSTRAINT "Cpu_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Ram" DROP CONSTRAINT "Ram_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ScreenSize" DROP CONSTRAINT "ScreenSize_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "SimSlot" DROP CONSTRAINT "SimSlot_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Storage" DROP CONSTRAINT "Storage_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Type" DROP CONSTRAINT "Type_categoryId_fkey";

-- AlterTable
ALTER TABLE "BatteryHealth" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "Color" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "Connectivity" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "Cpu" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "Ram" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "ScreenSize" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "SimSlot" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "Storage" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "Type" DROP COLUMN "categoryId";
