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
