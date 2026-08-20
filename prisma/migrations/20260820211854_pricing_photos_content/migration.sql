-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "aboutText" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "baseGuests" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "heroSubtitle" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "heroTitle" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "maxGuests" INTEGER NOT NULL DEFAULT 6;

-- CreateTable
CREATE TABLE "SeasonalRate" (
    "month" INTEGER NOT NULL,
    "pricePerNight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SeasonalRate_pkey" PRIMARY KEY ("month")
);

-- CreateTable
CREATE TABLE "GuestRate" (
    "guests" INTEGER NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GuestRate_pkey" PRIMARY KEY ("guests")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "section" TEXT NOT NULL DEFAULT 'galeria',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);
