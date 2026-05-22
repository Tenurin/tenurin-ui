import * as z from 'zod';

export const helpRequestSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters'),
});

export type HelpRequestFormData = z.infer<typeof helpRequestSchema>;
