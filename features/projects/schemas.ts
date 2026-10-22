import {z} from "zod";

export const createProjectSchema = z.object({
    name:z.string().trim().min(1,"Required"),
    imageUrl:z.union([
        z.instanceof(File)
            .refine((file) => file.size <= 1024 * 1024, {
                message: "Image must be 1 MB or smaller",
            })
            .refine(
                (file) => ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type),
                {message: "Choose a JPG, PNG, or SVG image"},
            ),
        z.string().transform((value)=> value === ""?undefined:value ),

    ])
    .optional(),
    workspaceId:z.string(),

});
export const updateProjectSchema = z.object({
    name:z.string().trim().min(1,"Minimum 1 character required").optional(),
    imageUrl:z.union([
        z.instanceof(File)
            .refine((file) => file.size <= 1024 * 1024, {
                message: "Image must be 1 MB or smaller",
            })
            .refine(
                (file) => ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type),
                {message: "Choose a JPG, PNG, or SVG image"},
            ),
        z.string().transform((value)=> value === ""?undefined:value ),

    ])
    .optional(),
    

});
