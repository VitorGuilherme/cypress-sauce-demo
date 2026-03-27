import { z } from "zod";

export const registerSuccessSchema = z.object({
  _id: z.string().min(1),
  token: z.string().min(1),
});

export const errorSchema = z.object({
  errors: z.array(z.string().min(1)).nonempty(),
});

export const getUserByIdSchema = z.object({
  _id: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  __v: z.number(),
});

export const getUsersListSchema = z.array(
  z.object({
    _id: z.string().min(1),
    name: z.string().min(1),
    email: z.email(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    __v: z.number(),
  }),
);

export const invalidEmailSchema = errorSchema;

export const invalidPasswordSchema = errorSchema;
