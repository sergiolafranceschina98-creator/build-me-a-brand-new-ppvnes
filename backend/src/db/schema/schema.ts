import { pgTable, text, integer, decimal, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  gender: text('gender').notNull(),
  height: integer('height').notNull(),
  weight: decimal('weight', { precision: 10, scale: 2 }).notNull(),
  experience: text('experience').notNull(),
  goals: text('goals').notNull(),
  trainingFrequency: integer('training_frequency').notNull(),
  equipment: text('equipment').notNull(),
  injuries: text('injuries'),
  preferredExercises: text('preferred_exercises'),
  sessionDuration: integer('session_duration').notNull(),
  bodyFatPercentage: decimal('body_fat_percentage', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const workoutPrograms = pgTable('workout_programs', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  programName: text('program_name').notNull(),
  durationWeeks: integer('duration_weeks').notNull(),
  splitType: text('split_type').notNull(),
  programStructure: jsonb('program_structure').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
