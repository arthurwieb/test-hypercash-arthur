// src/schemas/inputDataSchema.ts
import { z } from 'zod';

export const inputDataSchema = z.object({
  val: z.number().min(0, "Valor deve ser um número positivo."),
  flag1: z.boolean(),
  text: z.string().min(1, "Texto não pode ser vazio."),
  hour: z.number().int().min(0, "Hora deve ser entre 0 e 23.").max(23, "Hora deve ser entre 0 e 23."),
  email: z.string().email("Formato de email inválido."),
  addr1: z.string().min(1, "Endereço 1 não pode ser vazio."),
  addr2: z.string().min(1, "Endereço 2 não pode ser vazio."),
  count: z.number().int().min(0, "Contador deve ser um número positivo."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (YYYY-MM-DD)."),
});