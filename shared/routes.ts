import { z } from 'zod';
import { insertResponseSchema, responses } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  responses: {
    create: {
      method: 'POST' as const,
      path: '/api/responses' as const,
      input: insertResponseSchema,
      responses: {
        201: z.custom<typeof responses.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/responses' as const,
      responses: {
        200: z.array(z.custom<typeof responses.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ResponseInput = z.infer<typeof api.responses.create.input>;
export type ResponseResult = z.infer<typeof api.responses.create.responses[201]>;
