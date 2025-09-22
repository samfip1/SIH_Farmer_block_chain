-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('FARMER', 'APMC', 'DISTRIBUTOR', 'MEDIATOR', 'WHOLESALER', 'RETAILER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "avatar" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'FARMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "items" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."apmc_yards" (
    "id" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 0.0,
    "speciality" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apmc_yards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."apmc_requests" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "apmcId" TEXT NOT NULL,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING',
    "cropName" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "priceExpected" DOUBLE PRECISION NOT NULL,
    "qualityExpected" TEXT NOT NULL,
    "harvestDate" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "location" TEXT NOT NULL,
    "farmLocation" TEXT,
    "message" TEXT,
    "requestType" TEXT NOT NULL DEFAULT 'APMC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apmc_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."produces" (
    "id" TEXT NOT NULL,
    "produceUniqueId" TEXT NOT NULL,
    "farmerUniqueId" TEXT NOT NULL,
    "cropName" TEXT NOT NULL,
    "farmLocation" TEXT NOT NULL,
    "qualityGrade" TEXT NOT NULL,
    "harvestDate" TIMESTAMP(3) NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "imageUrl" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."apmc_updates" (
    "id" TEXT NOT NULL,
    "apmcUniqueId" TEXT NOT NULL,
    "produceUniqueId" TEXT NOT NULL,
    "apmcName" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "finalAPMCPrice" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apmc_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."distributor_requests" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING',
    "productName" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "priceOffered" DOUBLE PRECISION NOT NULL,
    "qualityRequired" TEXT NOT NULL,
    "deliveryDate" TIMESTAMP(3),
    "imageUrl" TEXT,
    "location" TEXT,
    "message" TEXT,
    "requestType" TEXT NOT NULL DEFAULT 'DISTRIBUTOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distributor_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_uniqueId_key" ON "public"."users"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "public"."orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "apmc_yards_uniqueId_key" ON "public"."apmc_yards"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "produces_produceUniqueId_key" ON "public"."produces"("produceUniqueId");

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."apmc_requests" ADD CONSTRAINT "apmc_requests_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."apmc_requests" ADD CONSTRAINT "apmc_requests_apmcId_fkey" FOREIGN KEY ("apmcId") REFERENCES "public"."apmc_yards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."produces" ADD CONSTRAINT "produces_farmerUniqueId_fkey" FOREIGN KEY ("farmerUniqueId") REFERENCES "public"."users"("uniqueId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."apmc_updates" ADD CONSTRAINT "apmc_updates_produceUniqueId_fkey" FOREIGN KEY ("produceUniqueId") REFERENCES "public"."produces"("produceUniqueId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."apmc_updates" ADD CONSTRAINT "apmc_updates_apmcUniqueId_fkey" FOREIGN KEY ("apmcUniqueId") REFERENCES "public"."apmc_yards"("uniqueId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distributor_requests" ADD CONSTRAINT "distributor_requests_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distributor_requests" ADD CONSTRAINT "distributor_requests_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
