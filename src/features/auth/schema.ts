// Form rules only - "is this a valid email?" not "does this account exist?"

import { z } from "zod";

export const loginSchema = z.object({
    email: z.email({ error: 'Enter a valid email address' }),
    password: z.string().min(8, { error: 'Password must be at least 8 characters' }),
})

export type LoginValues = z.infer<typeof loginSchema>;

export const mfaSchema = z.object({
    code: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit code')
})

export type MfaValues = z.infer<typeof mfaSchema>;

export const signupSchema = loginSchema
export type SignupValues = LoginValues