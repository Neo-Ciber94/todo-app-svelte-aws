import { z } from 'zod';

export const todoModel = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string().nullable(),
    done: z.boolean().default(false),
    creationDate: z.string().pipe(z.coerce.date()),
    lastModifiedDate: z.string().pipe(z.coerce.date()),
});

export const createTodoModel = z.object({
    title: z.string(),
    content: z.string().optional().nullable(),
});
