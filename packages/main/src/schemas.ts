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

export const readNoteByIdRequestSchema = z.object({
  noteId: idRequestSchema,
  projectId: idRequestSchema,
});

export type readNoteByIdRequest = z.infer<typeof readNoteByIdRequestSchema>;

export const typeAddRequestSchema = z.string();

export type typeAddRequest = z.infer<typeof typeAddRequestSchema>;
