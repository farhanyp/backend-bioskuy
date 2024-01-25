/*
  Warnings:

  - Added the required column `transaction_token` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payments` ADD COLUMN `transaction_token` VARCHAR(100) NOT NULL;
