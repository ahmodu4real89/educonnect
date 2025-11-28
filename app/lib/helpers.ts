import { ZodSchema } from "zod";
import { join } from "path";
import { mkdir, writeFile } from "fs/promises";



export const fileSystem = {
    async put(
        file: File,
        options: {
            directory?: string;
            filename?: string;
        } = {}
    ): Promise<string> {
        const { directory = 'uploads', filename = `${Date.now()}-${file.name}` } = options;

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create full path
        const fullPath = join(process.cwd(), 'public', directory, filename);

        // Ensure directory exists
        await mkdir(join(process.cwd(), 'public', directory), { recursive: true });

        // Write file
        await writeFile(fullPath, buffer);

        // Return accessible URL
        return `/${directory}/${filename}`;
    },
    async read() {

    }
}



export async function validate<T>(
    schema: ZodSchema<T>, 
    data: object | FormData
) {
    
    let body = data;
    if (data instanceof FormData) {
        body = Object.fromEntries(data.entries());
    }

    const result = schema.safeParse(body);

    if (result.success) {
        return {
            data: result.data,
            errors: null,
        };
    } else {
        const errObj: Record<string, string> = {};
        result.error.issues.forEach(e => {
            const key = e.path[0] as string;
            errObj[key] = e.message;
        });

        return {
            data: null,
            errors: errObj,
        };
    }
}