CREATE TABLE `localUsers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`name` varchar(100),
	`phone` varchar(20),
	`targetCompanies` text,
	`experienceYears` int,
	`isVerified` boolean NOT NULL DEFAULT false,
	`verificationToken` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `localUsers_id` PRIMARY KEY(`id`),
	CONSTRAINT `localUsers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`planName` varchar(50) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'CNY',
	`status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`transactionId` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`paidAt` timestamp,
	`expiresAt` timestamp,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
