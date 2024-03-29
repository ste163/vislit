import { z } from "zod";

// General schemas
export const idRequestSchema = z.string();
export type idRequest = z.infer<typeof idRequestSchema>;

// Helper schemas
const isoDateRequestSchema = z.string().refine((date) => {
  const parsedDate = new Date(Date.parse(date)).toISOString();
  return parsedDate === date ? true : false;
});

const numberAsStringRequestSchema = z.string().refine((value) => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? false : true;
});

// Specific schemas
export const projectAddRequestSchema = z
  .object({
    title: z.string(),
    description: z.string().nullable(),
    typeId: idRequestSchema,
  })
  .strict(); // must use strict to only allow these keys

export type projectAddRequest = z.infer<typeof projectAddRequestSchema>;

export const projectUpdateRequestSchema = z
  .object({
    id: idRequestSchema,
    title: z.string(),
    description: z.string(),
    typeId: idRequestSchema,
    completed: z.boolean(),
    archived: z.boolean(),
  })
  .strict();

export type projectUpdateRequest = z.infer<typeof projectUpdateRequestSchema>;

export const htmlWriteRequestSchema = z
  .object({
    id: idRequestSchema,
    html: z.string(),
    type: z
      .string()
      .refine((value: string) =>
        value === "documents" || value === "notes" ? true : false
      ),
    projectId: idRequestSchema.optional(),
    createdAt: z.date().optional(),
  })
  .strict();

export type htmlWriteRequest = z.infer<typeof htmlWriteRequestSchema>;

export const deleteNoteRequestSchema = z
  .object({
    id: idRequestSchema,
    projectId: idRequestSchema,
  })
  .strict();

export type deleteNoteRequest = z.infer<typeof deleteNoteRequestSchema>;

export const readNoteByIdRequestSchema = z
  .object({
    noteId: idRequestSchema,
    projectId: idRequestSchema,
  })
  .strict();

export type readNoteByIdRequest = z.infer<typeof readNoteByIdRequestSchema>;

export const addGoalRequestSchema = z
  .object({
    projectId: idRequestSchema,
    wordCount: z.number(),
    isDaily: z.boolean(),
    daysPerMonth: z.number().nullable(),
    proofreadCountsTowardGoal: z.boolean().optional(),
    editCountsTowardGoal: z.boolean().optional(),
    revisedCountsTowardsGoal: z.boolean().optional(),
  })
  .strict();

export type addGoalRequest = z.infer<typeof addGoalRequestSchema>;

export const updateGoalRequestSchema = z
  .object({
    id: idRequestSchema,
    projectId: idRequestSchema,
    wordCount: z.number(),
    isDaily: z.boolean(),
    daysPerMonth: z.number().nullable(),
    proofreadCountsTowardGoal: z.boolean().optional(),
    editCountsTowardGoal: z.boolean().optional(),
    revisedCountsTowardsGoal: z.boolean().optional(),
    active: z.boolean().refine((value) => (value === true ? true : false)),
    completed: z.boolean().refine((value) => (value === false ? true : false)),
  })
  .strict();

export type updateGoalRequest = z.infer<typeof updateGoalRequestSchema>;

export const addNoteRequestSchema = z
  .object({
    title: z.string(),
    projectId: idRequestSchema,
  })
  .strict();

export type addNoteRequest = z.infer<typeof addNoteRequestSchema>;

export const updateNoteRequestSchema = z
  .object({
    id: idRequestSchema,
    title: z.string(),
    projectId: idRequestSchema,
  })
  .strict();

export type updateNoteRequest = z.infer<typeof updateNoteRequestSchema>;

export const getProgressByDateRequestSchema = z
  .object({
    projectId: idRequestSchema,
    date: isoDateRequestSchema,
  })
  .strict();

export type getProgressByDateRequest = z.infer<
  typeof getProgressByDateRequestSchema
>;

export const getAllProgressRequestSchema = z
  .object({
    projectId: idRequestSchema,
    year: numberAsStringRequestSchema,
    month: numberAsStringRequestSchema,
  })
  .strict();

export type getAllProgressRequest = z.infer<typeof getAllProgressRequestSchema>;

export const modifyProgressRequestSchema = z
  .object({
    date: isoDateRequestSchema,
    projectId: idRequestSchema,
    goalId: idRequestSchema,
    count: z.number(),
    edited: z.boolean(),
    proofread: z.boolean(),
    revised: z.boolean(),
  })
  .strict();

export type modifyProgressRequest = z.infer<typeof modifyProgressRequestSchema>;

export const typeAddRequestSchema = z.string();

export type typeAddRequest = z.infer<typeof typeAddRequestSchema>;

export const searchRequestSchema = z.string();

export type searchRequest = z.infer<typeof searchRequestSchema>;
