import { z } from "zod";

// export const registerSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   sex: z.enum(["MALE", "FEMALE"]).refine((val) => !!val, { message: "Gender is required" }),
//   phoneNumber: z
//     .string()
//     .min(10, "Phone number must be at least 10 digits")
//     .max(15, "Phone number too long"),
//   age: z
//     .string()
//     .regex(/^\d+$/, "Age must be a number")
//     .transform((val) => parseInt(val))
//     .refine((val) => val > 0 && val < 120, "Invalid age"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   role: z.enum(["STUDENT", "LECTURER"]),
// });


export const registerSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must not exceed 15 digits"),
    age: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 10, "Age must be a valid number"),
    sex: z.enum(["MALE", "FEMALE"]).refine((val) => !!val, { message: "Gender is required" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
    role: z.enum(["STUDENT", "LECTURER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
