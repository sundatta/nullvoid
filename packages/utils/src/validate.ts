import { type ZodSchema } from 'zod';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}

export function validate<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string[]> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) errors[path] = [];
    errors[path].push(issue.message);
  }

  return { success: false, errors };
}
