ALTER TABLE `arithmetic_race_participants` ADD `score` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `arithmetic_race_participants` ADD `skip_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `arithmetic_race_participants` ADD `card_index` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `arithmetic_race_participants` ADD `scored_at` integer;--> statement-breakpoint
ALTER TABLE `arithmetic_races` ADD `duration_seconds` integer;