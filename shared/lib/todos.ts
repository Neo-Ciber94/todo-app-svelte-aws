import { z } from "zod";

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 1000;

export const todoModel = z.object({
  id: z.string(),
  title: z.string().trim(),
  content: z.string().nullable(),
  done: z.boolean().default(false),
  createdBy: z.string(),
  creationDate: z.string().datetime(),
  lastModifiedDate: z.string().datetime(),
});

export type TodoModel = z.infer<typeof todoModel>;

export const createTodoModel = z.object({
  title: z.string().trim().min(1).max(MAX_TITLE_LENGTH),
  content: z.string().trim().max(MAX_CONTENT_LENGTH).optional().nullable(),
});

export type CreateTodoModel = z.infer<typeof createTodoModel>;

export const updateTodoModel = z.object({
  id: z.string().min(1, "id is required"),
  title: z.string().trim().min(1).max(MAX_TITLE_LENGTH),
  content: z.string().trim().max(MAX_CONTENT_LENGTH).optional().nullable(),
});

export type UpdateTodoModel = z.infer<typeof updateTodoModel>;
