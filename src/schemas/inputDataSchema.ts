// src/schemas/inputDataSchema.ts
import { z } from 'zod';

export const inputDataSchema = z.object({
  val: z.number("Valor deve ser um número positivo.").min(0),
  flag1: z.boolean(),
  text:  z.string().trim().min(1, "Texto não pode ser vazio."),
  hour: z.number("Hora deve ser entre 0 e 23.").int().min(0).max(23, "Hora deve ser entre 0 e 23."),
  email: z.email("Formato de email inválido."),
  addr1: z.string().min(1, "Endereço 1 não pode ser vazio."),
  addr2: z.string().min(1, "Endereço 2 não pode ser vazio."),
  count: z.number().int().min(0, "Contador deve ser um número positivo."),
  date: z.date("Formato de data inválido (YYYY-MM-DD)."),
});