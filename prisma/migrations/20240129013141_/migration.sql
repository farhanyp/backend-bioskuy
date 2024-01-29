-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `token` VARCHAR(300) NULL,
    `role` ENUM('user', 'admin') NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Movies` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(100) NULL,
    `price` INTEGER NOT NULL,
    `status` ENUM('notShowing', 'showing', 'alreadyShowing') NOT NULL,
    `genre` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Studios` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `capcity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seats` (
    `id` VARCHAR(191) NOT NULL,
    `studio_id` VARCHAR(191) NOT NULL,
    `seat_name` VARCHAR(10) NOT NULL,
    `isAvailable` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeatBookings` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(100) NOT NULL,
    `seat_id` VARCHAR(100) NOT NULL,
    `showtime_id` VARCHAR(100) NOT NULL,
    `status` ENUM('active', 'completed', 'cancelled', 'pending') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Showtimes` (
    `id` VARCHAR(191) NOT NULL,
    `movie_id` VARCHAR(100) NOT NULL,
    `studio_id` VARCHAR(100) NOT NULL,
    `show_start` DATETIME(3) NOT NULL,
    `show_end` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payments` (
    `id` VARCHAR(191) NOT NULL,
    `seatbooking_id` VARCHAR(100) NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` ENUM('unpaid', 'paid') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `transaction_token` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Payments_seatbooking_id_key`(`seatbooking_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentsHistory` (
    `id` VARCHAR(191) NOT NULL,
    `payments_id` VARCHAR(100) NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` ENUM('unpaid', 'paid') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PaymentsHistory_payments_id_key`(`payments_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Seats` ADD CONSTRAINT `Seats_studio_id_fkey` FOREIGN KEY (`studio_id`) REFERENCES `Studios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeatBookings` ADD CONSTRAINT `SeatBookings_seat_id_fkey` FOREIGN KEY (`seat_id`) REFERENCES `Seats`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeatBookings` ADD CONSTRAINT `SeatBookings_showtime_id_fkey` FOREIGN KEY (`showtime_id`) REFERENCES `Showtimes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeatBookings` ADD CONSTRAINT `SeatBookings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Showtimes` ADD CONSTRAINT `Showtimes_movie_id_fkey` FOREIGN KEY (`movie_id`) REFERENCES `Movies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Showtimes` ADD CONSTRAINT `Showtimes_studio_id_fkey` FOREIGN KEY (`studio_id`) REFERENCES `Studios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payments` ADD CONSTRAINT `Payments_seatbooking_id_fkey` FOREIGN KEY (`seatbooking_id`) REFERENCES `SeatBookings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentsHistory` ADD CONSTRAINT `PaymentsHistory_payments_id_fkey` FOREIGN KEY (`payments_id`) REFERENCES `Payments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
