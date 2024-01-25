/*
  Warnings:

  - You are about to drop the column `booking_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `booking_id` on the `seatbookings` table. All the data in the column will be lost.
  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[seatbooking_id]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seatbooking_id` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `showtime_id` to the `SeatBookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `SeatBookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `Bookings_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `Payments_booking_id_fkey`;

-- DropForeignKey
ALTER TABLE `seatbookings` DROP FOREIGN KEY `SeatBookings_booking_id_fkey`;

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `booking_id`,
    ADD COLUMN `seatbooking_id` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `seatbookings` DROP COLUMN `booking_id`,
    ADD COLUMN `showtime_id` VARCHAR(100) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE `bookings`;

-- CreateIndex
CREATE UNIQUE INDEX `Payments_seatbooking_id_key` ON `Payments`(`seatbooking_id`);

-- AddForeignKey
ALTER TABLE `SeatBookings` ADD CONSTRAINT `SeatBookings_showtime_id_fkey` FOREIGN KEY (`showtime_id`) REFERENCES `Showtimes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeatBookings` ADD CONSTRAINT `SeatBookings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payments` ADD CONSTRAINT `Payments_seatbooking_id_fkey` FOREIGN KEY (`seatbooking_id`) REFERENCES `SeatBookings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
