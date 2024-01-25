-- AlterTable
ALTER TABLE `seatbookings` MODIFY `status` ENUM('active', 'completed', 'cancelled', 'pending') NOT NULL;
