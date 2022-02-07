import { z } from "zod";

// General schemas
export const idRequestSchema = z.string();
export type idRequest = z.infer<typeof idRequestSchema>;

// Specific schemas
export const projectAddRequestSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    typeId: z.string(),
  })
  .strict(); // must use strict to only allow these keys

export type projectAddRequest = z.infer<typeof projectAddRequestSchema>;

export const projectUpdateRequestSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    typeId: z.string(),
    completed: z.boolean(),
    archived: z.boolean(),
  })
  .strict();

export type projectUpdateRequest = z.infer<typeof projectUpdateRequestSchema>;

export const typeAddRequestSchema = z.string();
export type typeAddRequest = z.infer<typeof typeAddRequestSchema>;
