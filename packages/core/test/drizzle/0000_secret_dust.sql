CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`type` text NOT NULL,
	`provider_name` text NOT NULL,
	`account_id` text NOT NULL,
	`scope` text,
	`access_token` text,
	`access_token_expires_at` integer,
	`refresh_token` text,
	`refresh_token_expires_at` integer,
	`id_token` text,
	`metadata` text,
	`status` text NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `BSSubscribe` (
	`id` text PRIMARY KEY NOT NULL,
	`channel_id` text NOT NULL,
	`enabled` integer NOT NULL,
	`type` text NOT NULL,
	`data` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `BSSubscribeMember` (
	`subscribe_id` text NOT NULL,
	`member_id` text NOT NULL,
	`subscribe_data` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`subscribe_id`, `member_id`)
);
--> statement-breakpoint
CREATE TABLE `BSUserPreference` (
	`uid` text NOT NULL,
	`gid` text,
	`data` text,
	PRIMARY KEY(`uid`, `gid`)
);
--> statement-breakpoint
CREATE TABLE `channel` (
	`id` text PRIMARY KEY NOT NULL,
	`channel_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
