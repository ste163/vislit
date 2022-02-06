import { z } from "zod";

export const projectAddRequestSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    typeId: z.string(),
  })
  .strict(); // must use strict to only allow these keys

export type projectAddRequest = z.infer<typeof projectAddRequestSchema>;
