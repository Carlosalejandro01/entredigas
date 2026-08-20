-- CreateTable
CREATE TABLE "DateRate" (
    "date" TIMESTAMP(3) NOT NULL,
    "pricePerNight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DateRate_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "Amenity" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);
