import { z } from "zod";

export const todoModel = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().nullable(),
  done: z.boolean().default(false),
  creationDate: z.string().datetime(),
  lastModifiedDate: z.string().datetime(),
});

export type TodoModel = z.infer<typeof todoModel>;

export const createTodoModel = z.object({
  title: z.string(),
  content: z.string().optional().nullable(),
});

export type CreateTodoModel = z.infer<typeof createTodoModel>;

export const updateTodoModel = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional().nullable(),
});

export type UpdateTodoModel = z.infer<typeof updateTodoModel>;
