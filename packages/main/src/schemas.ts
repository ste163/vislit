import { z } from "zod";

// General schemas
export const idRequestSchema = z.string();
export type idRequest = z.infer<typeof idRequestSchema>;

// Specific schemas
export const projectAddRequestSchema = z
  .object({
    title: z.string(),
    description: z.string(),
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
    basedOnWordCountOrPageCount: z.string(),
    frequencyToRepeat: z.string(),
    wordOrPageCount: z.number(),
    daysPerFrequency: z.number().optional(),
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
    basedOnWordCountOrPageCount: z.string(),
    frequencyToRepeat: z.string(),
    wordOrPageCount: z.number(),
    daysPerFrequency: z.number().optional(),
    proofreadCountsTowardGoal: z.boolean().optional(),
    editCountsTowardGoal: z.boolean().optional(),
    revisedCountsTowardsGoal: z.boolean().optional(),
    active: z.boolean().refine((value) => (value === true ? true : false)),
    completed: z.boolean().refine((value) => (value === false ? true : false)),
  })
  .strict();

export type updateGoalRequest = z.infer<typeof updateGoalRequestSchema>;

export const typeAddRequestSchema = z.string();

export type typeAddRequest = z.infer<typeof typeAddRequestSchema>;
