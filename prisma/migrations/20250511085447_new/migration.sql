-- CreateEnum
CREATE TYPE "appealStatus" AS ENUM ('open', 'process', 'close');

-- CreateEnum
CREATE TYPE "appealType" AS ENUM ('other', 'work', 'benefits', 'pension', 'payments', 'homeCare', 'elderlySupport', 'disabilityAid', 'housing', 'childSupport', 'legalHelp', 'consultation', 'transportBenefit', 'documents', 'crisisSupport', 'daycare', 'socialCard', 'utilityDiscount');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userPermission" (
    "userId" INTEGER NOT NULL,
    "appealType" "appealType" NOT NULL,

    CONSTRAINT "userPermission_pkey" PRIMARY KEY ("userId","appealType")
);

-- CreateTable
CREATE TABLE "appeal" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "type" "appealType" NOT NULL DEFAULT 'other',
    "status" "appealStatus" NOT NULL DEFAULT 'open',

    CONSTRAINT "appeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "window" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "window_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_userWindow" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_userWindow_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_appealWindow" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_appealWindow_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "userPermission_userId_appealType_idx" ON "userPermission"("userId", "appealType");

-- CreateIndex
CREATE INDEX "appeal_id_type_idx" ON "appeal"("id", "type");

-- CreateIndex
CREATE INDEX "window_id_name_idx" ON "window"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "window_name_key" ON "window"("name");

-- CreateIndex
CREATE INDEX "_userWindow_B_index" ON "_userWindow"("B");

-- CreateIndex
CREATE INDEX "_appealWindow_B_index" ON "_appealWindow"("B");

-- AddForeignKey
ALTER TABLE "userPermission" ADD CONSTRAINT "userPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userWindow" ADD CONSTRAINT "_userWindow_A_fkey" FOREIGN KEY ("A") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userWindow" ADD CONSTRAINT "_userWindow_B_fkey" FOREIGN KEY ("B") REFERENCES "window"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_appealWindow" ADD CONSTRAINT "_appealWindow_A_fkey" FOREIGN KEY ("A") REFERENCES "appeal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_appealWindow" ADD CONSTRAINT "_appealWindow_B_fkey" FOREIGN KEY ("B") REFERENCES "window"("id") ON DELETE CASCADE ON UPDATE CASCADE;
