CREATE TABLE `BSRelateAccount` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uid` integer NOT NULL,
	`type` text NOT NULL,
	`platform` text NOT NULL,
	`platformUname` text NOT NULL,
	`platformUid` text NOT NULL,
	`platformScope` text NOT NULL,
	`accessToken` text NOT NULL,
	`refreshToken` text NOT NULL,
	`otherPlatformInfo` text,
	`lastModifiedAt` integer NOT NULL,
	`lastRefreshAt` integer NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `BSRelateChannelInfo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`platform` text NOT NULL,
	`selfId` text NOT NULL,
	`channelId` text NOT NULL,
	`uid` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `BSSubscribe` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`gid` integer NOT NULL,
	`enable` integer NOT NULL,
	`type` text NOT NULL,
	`data` text,
	`time` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `BSSubscribeMember` (
	`subscribeId` integer NOT NULL,
	`memberUid` integer NOT NULL,
	`subscribeData` text,
	`joinedAt` integer NOT NULL,
	PRIMARY KEY(`subscribeId`, `memberUid`)
);
--> statement-breakpoint
CREATE TABLE `BSUserPreference` (
	`uid` integer NOT NULL,
	`gid` integer,
	`data` text,
	PRIMARY KEY(`uid`, `gid`)
);
