CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"gender" text NOT NULL,
	"height" integer NOT NULL,
	"weight" numeric(10, 2) NOT NULL,
	"experience" text NOT NULL,
	"goals" text NOT NULL,
	"training_frequency" integer NOT NULL,
	"equipment" text NOT NULL,
	"injuries" text,
	"preferred_exercises" text,
	"session_duration" integer NOT NULL,
	"body_fat_percentage" numeric(5, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"program_name" text NOT NULL,
	"duration_weeks" integer NOT NULL,
	"split_type" text NOT NULL,
	"program_structure" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workout_programs" ADD CONSTRAINT "workout_programs_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;