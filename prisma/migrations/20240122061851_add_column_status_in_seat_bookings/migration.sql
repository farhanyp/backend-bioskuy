/*
  Warnings:

  - Added the required column `status` to the `SeatBookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `seatbookings` ADD COLUMN `status` ENUM('active', 'completed', 'cancelled') NOT NULL;
