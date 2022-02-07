import { z } from "zod";

// todo: add test to see if this throws
// just check if th error throws, not specifically what it is
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

export const projectDeleteRequestSchema = z.string();

export type projectDeleteRequest = z.infer<typeof projectDeleteRequestSchema>;
