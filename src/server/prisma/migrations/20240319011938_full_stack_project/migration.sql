/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Task";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rating" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "reviewText" TEXT NOT NULL,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "body" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
