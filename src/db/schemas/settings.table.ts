import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, check } from "drizzle-orm/sqlite-core";
import { createSelectSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { languagesTable } from "@schemas";
import { colorField } from "@utils";

export const settingsTable = sqliteTable(
  "settings",
  {
    id: integer("id").primaryKey().default(1),
    mosque_name: text("mosque_name").notNull().default("Masjid Name"),

    language_code: text("language_code")
      .notNull()
      .references(() => languagesTable.code)
      .default("ta"),
    time_format: integer("time_format").notNull().default(12),
    hijri_offset: integer("hijri_offset").notNull().default(0),

    is_ramadan: integer("is_ramadan", { mode: "boolean" })
      .notNull()
      .default(false),

    primary_color: text("primary_color").notNull().default("#00CFFF"),
    secondary_color: text("secondary_color").notNull().default("#ffff00"),
    accent_color: text("accent_color").notNull().default("#00ff40"),
    background_color: text("background_color").notNull().default("#000000"),
    foreground_color: text("foreground_color").notNull().default("#ffffff"),
  },
  (table) => [
    check("settings_single_row", sql`${table.id} = 1`),
    check("mosque_name_length", sql`length(${table.mosque_name}) > 0`),

    check("primary_hex", sql`${table.primary_color} LIKE '#%'`),
    check("secondary_hex", sql`${table.secondary_color} LIKE '#%'`),
    check("accent_hex", sql`${table.accent_color} LIKE '#%'`),
    check("bg_hex", sql`${table.background_color} LIKE '#%'`),
    check("fg_hex", sql`${table.foreground_color} LIKE '#%'`),
  ],
);

const Settings = {
  table: settingsTable,
  schema: {
    select: createSelectSchema(settingsTable).strict(),
    update: createUpdateSchema(settingsTable, {
      mosque_name: z.string().min(1, "Mosque name is required").max(100),
      language_code: z.string().min(2).max(4),
      time_format: z.union([z.literal(12), z.literal(24)]),
      primary_color: colorField,
      secondary_color: colorField,
      accent_color: colorField,
      background_color: colorField,
      foreground_color: colorField,
      is_ramadan: z.boolean(),
      hijri_offset: z.number().int().min(-12).max(12),
    })
      .omit({ id: true })
      .partial()
      .strict(),
  },
};

export type TSettings = z.infer<typeof Settings.schema.select>;
export type TSettingsUpdate = z.infer<typeof Settings.schema.update>;

export { Settings };
