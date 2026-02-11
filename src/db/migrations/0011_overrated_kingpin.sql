PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`mosque_name` text DEFAULT 'Masjid Name' NOT NULL,
	`language_code` text DEFAULT 'ta' NOT NULL,
	`time_format` integer DEFAULT 12 NOT NULL,
	`hijri_offset` integer DEFAULT 0 NOT NULL,
	`is_ramadan` integer DEFAULT false NOT NULL,
	`primary_color` text DEFAULT '#00CFFF' NOT NULL,
	`secondary_color` text DEFAULT '#ffff00' NOT NULL,
	`accent_color` text DEFAULT '#00ff40' NOT NULL,
	`background_color` text DEFAULT '#000000' NOT NULL,
	`foreground_color` text DEFAULT '#ffffff' NOT NULL,
	FOREIGN KEY (`language_code`) REFERENCES `languages`(`code`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "settings_single_row" CHECK("__new_settings"."id" = 1),
	CONSTRAINT "mosque_name_length" CHECK(length("__new_settings"."mosque_name") > 0),
	CONSTRAINT "primary_hex" CHECK("__new_settings"."primary_color" LIKE '#%'),
	CONSTRAINT "secondary_hex" CHECK("__new_settings"."secondary_color" LIKE '#%'),
	CONSTRAINT "accent_hex" CHECK("__new_settings"."accent_color" LIKE '#%'),
	CONSTRAINT "bg_hex" CHECK("__new_settings"."background_color" LIKE '#%'),
	CONSTRAINT "fg_hex" CHECK("__new_settings"."foreground_color" LIKE '#%')
);
--> statement-breakpoint
INSERT INTO `__new_settings`("id", "mosque_name", "language_code", "time_format", "hijri_offset", "is_ramadan", "primary_color", "secondary_color", "accent_color", "background_color", "foreground_color") SELECT "id", "mosque_name", "language_code", "time_format", "hijri_offset", "is_ramadan", "primary_color", "secondary_color", "accent_color", "background_color", "foreground_color" FROM `settings`;--> statement-breakpoint
DROP TABLE `settings`;--> statement-breakpoint
ALTER TABLE `__new_settings` RENAME TO `settings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;