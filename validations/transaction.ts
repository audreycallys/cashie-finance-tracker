import { z } from "zod";

export const createTransactionSchema = z.object({
  name: z.string().trim().min(1).max(150),

  type: z.enum(["income", "expense"]),

  amount: z.number().finite().positive().max(9999999999999.99),

  category: z.string().trim().min(1).max(100),

  date: z.iso.date(),

  description: z.string().trim().max(5000).default(""),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
