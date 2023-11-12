import { z } from "zod";

export const textSchema = z.object({
  title: z.string(),
  content: z.string(),
});
