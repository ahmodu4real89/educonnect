import { z } from "zod";

export const registerSchema = z.object({
    
    name: z.string().min(1, "Fullname required"),
    email: z.email({
        message: "Email required"
    }),
    password: z.string().min(8, "Password required"),
    confirmPassword: z.string().min(8, "Confirm password required"),
    gender: z.enum(['MALE', 'FEMALE'], {
        message: "Gender required"
    }),
    phoneNumber: z.string().min(11, "PhoneNumber required"),
    role: z.enum(['LECTURER', 'STUDENT'], {
        message: "Role required"
    }),
    level: z.string().min(1, "Level required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't Match",
    path: ['confirmPassword']
} )
.refine((data) => {
    console.log(data.name,)
    const fullname = data.name.split(' ').map(name => name.trim()).filter(name => name.length)
    if(fullname.length == 1 || fullname.length > 3){
        return false
    }
    return true
}, {
    message: "Enter first, Lastname. Middlname is Optional",
    path: ['name']
}) 

export type TRegisterUser = z.infer<typeof registerSchema>