-- AlterTable
ALTER TABLE "DateRate" ADD COLUMN     "minNights" INTEGER,
ALTER COLUMN "pricePerNight" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SeasonalRate" ADD COLUMN     "minNights" INTEGER,
ALTER COLUMN "pricePerNight" DROP NOT NULL;
