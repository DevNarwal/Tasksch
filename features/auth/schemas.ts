import {z} from "zod";
const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(256, "Password cannot exceed 256 characters"),
});
const registerSchema = z.object({
    name:z
        .string()
        .trim()
        .min(1, "Name is required")
        .max(256, "Name cannot exceed 256 characters"),
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(256, "Password cannot exceed 256 characters"),
});

export { loginSchema , registerSchema };