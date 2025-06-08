import { z } from "zod";
import { CATEGORY } from "./service.const";

export const createServiceValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    description: z.string({ required_error: "Description is required" }),
    price: z.number({ required_error: "Price is required" }),
    duration: z.number({ required_error: "Duration time is required" }),
    category: z.nativeEnum(CATEGORY),
  }),
});
const updateServiceValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    duration: z.number().optional(),
    category: z.nativeEnum(CATEGORY).optional(),
  }),
});

export const ServiceValidations = {
  createServiceValidationSchema,
  updateServiceValidationSchema,
};
