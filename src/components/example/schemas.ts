import { z } from 'zod';

export const exampleFormGenreSchema = z.enum(['product', 'knowledge', 'fiction']);

export const exampleFormSchema = z.object({
  title: z
    .string()
    .min(2, 'Informe um titulo com pelo menos 2 caracteres.')
    .max(80, 'Use no maximo 80 caracteres para o titulo.'),
  description: z
    .string()
    .min(10, 'A descricao precisa ter pelo menos 10 caracteres.')
    .max(280, 'Use no maximo 280 caracteres na descricao.'),
  genre: exampleFormGenreSchema,
  featured: z.boolean(),
});
