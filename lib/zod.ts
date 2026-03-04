import { z } from "zod";
import { MAX_FILE_SIZE } from "./constants";

const VOICE_IDS = ["dave", "daniel", "chris", "rachel", "sarah"] as const;

export const UploadSchema = z.object({
  pdfFile: z
    .union([
      z.undefined(),
      z
        .instanceof(File)
        .refine((f) => f.size <= MAX_FILE_SIZE, "PDF must be 50MB or less"),
    ])
    .refine((f) => f instanceof File, "Please upload a PDF file"),
  coverImage: z.instanceof(File).optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author name is required"),
  persona: z.enum(VOICE_IDS, { message: "Please choose an assistant voice" }),
});

export type UploadFormValues = z.infer<typeof UploadSchema>;
export type UploadFormInput = z.input<typeof UploadSchema>;
