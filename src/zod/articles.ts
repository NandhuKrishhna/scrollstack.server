import { z } from "zod";
import { Category } from "../utils/article.enum";

// Validation schema for article creation
export const createArticleSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().optional(),
    content: z.string().min(1, "Content is required"), // Add content validation
    category: z.nativeEnum(Category),
    imageUrl: z.string().optional(),
    tags: z.array(z.string()).min(1, "At least one tag is required"), // Ensure at least one tag is provided
});
