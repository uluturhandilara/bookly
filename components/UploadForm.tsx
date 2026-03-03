"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, ImageIcon, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  UploadSchema,
  type UploadFormValues,
  type UploadFormInput,
} from "@/lib/zod";
import { voiceOptions, voiceCategories, DEFAULT_VOICE } from "@/lib/constants";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useRef } from "react";

const PDF_MAX_MB = 50;

export default function UploadForm() {
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UploadFormInput, unknown, UploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      pdfFile: undefined,
      coverImage: undefined,
      title: "",
      author: "",
      voiceId: DEFAULT_VOICE,
    },
  });

  const pdfFile = useWatch({ control: form.control, name: "pdfFile" });
  const coverImage = useWatch({ control: form.control, name: "coverImage" });
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: UploadFormValues) {
    // TODO: upload PDF + cover, then create book (API)
    console.log("Submit:", values);
  }

  return (
    <div className="new-book-wrapper space-y-8">
      {isSubmitting && <LoadingOverlay />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* PDF file upload */}
          <FormField
            control={form.control}
            name="pdfFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book PDF File</FormLabel>
                <FormControl>
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    className="upload-dropzone border-2 border-dashed border-[var(--border-subtle)]"
                    onClick={() => pdfInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        pdfInputRef.current?.click();
                      }
                    }}
                  >
                    {pdfFile instanceof File ? (
                      <div className="upload-dropzone-uploaded flex flex-col items-center justify-center gap-2">
                        <span className="upload-dropzone-text truncate max-w-[90%]">
                          {pdfFile.name}
                        </span>
                        <button
                          type="button"
                          className="upload-dropzone-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            field.onChange(undefined);
                          }}
                          aria-label="Remove PDF"
                        >
                          <X className="size-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="upload-dropzone-icon" />
                        <span className="upload-dropzone-text">
                          Click to upload PDF
                        </span>
                        <span className="upload-dropzone-hint">
                          PDF file (max {PDF_MAX_MB}MB)
                        </span>
                      </>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover image upload (optional) */}
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image (Optional)</FormLabel>
                <FormControl>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    className="upload-dropzone border-2 border-dashed border-[var(--border-subtle)]"
                    onClick={() => coverInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        coverInputRef.current?.click();
                      }
                    }}
                  >
                    {coverImage instanceof File ? (
                      <div className="upload-dropzone-uploaded flex flex-col items-center justify-center gap-2">
                        <span className="upload-dropzone-text truncate max-w-[90%]">
                          {coverImage.name}
                        </span>
                        <button
                          type="button"
                          className="upload-dropzone-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            field.onChange(undefined);
                          }}
                          aria-label="Remove cover image"
                        >
                          <X className="size-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="upload-dropzone-icon" />
                        <span className="upload-dropzone-text">
                          Click to upload cover image
                        </span>
                        <span className="upload-dropzone-hint">
                          Leave empty to auto-generate from PDF
                        </span>
                      </>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <input
                    className="form-input border border-[var(--border-subtle)]"
                    placeholder="ex: Rich Dad Poor Dad"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Author */}
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Name</FormLabel>
                <FormControl>
                  <input
                    className="form-input border border-[var(--border-subtle)]"
                    placeholder="ex: Robert Kiyosaki"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Voice selector */}
          <FormField
            control={form.control}
            name="voiceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choose Assistant Voice</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div>
                      <p className="form-label text-base text-[var(--text-secondary)] mb-2">
                        Male Voices
                      </p>
                      <div className="voice-selector-options flex flex-wrap gap-4">
                        {voiceCategories.male.map((key) => {
                          const voice =
                            voiceOptions[key as keyof typeof voiceOptions];
                          const isSelected = field.value === key;
                          return (
                            <label
                              key={key}
                              className={`voice-selector-option flex-1 min-w-[140px] ${
                                isSelected
                                  ? "voice-selector-option-selected"
                                  : "voice-selector-option-default"
                              }`}
                            >
                              <input
                                type="radio"
                                name={field.name}
                                value={key}
                                checked={isSelected}
                                onChange={() => field.onChange(key)}
                                className="sr-only"
                              />
                              <div className="flex flex-col items-start gap-1 text-left w-full">
                                <span className="font-semibold text-[#212a3b]">
                                  {voice.name}
                                </span>
                                <span className="text-sm text-[var(--text-secondary)]">
                                  {voice.description}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="form-label text-base text-[var(--text-secondary)] mb-2">
                        Female Voices
                      </p>
                      <div className="voice-selector-options flex flex-wrap gap-4">
                        {voiceCategories.female.map((key) => {
                          const voice =
                            voiceOptions[key as keyof typeof voiceOptions];
                          const isSelected = field.value === key;
                          return (
                            <label
                              key={key}
                              className={`voice-selector-option flex-1 min-w-[140px] ${
                                isSelected
                                  ? "voice-selector-option-selected"
                                  : "voice-selector-option-default"
                              }`}
                            >
                              <input
                                type="radio"
                                name={field.name}
                                value={key}
                                checked={isSelected}
                                onChange={() => field.onChange(key)}
                                className="sr-only"
                              />
                              <div className="flex flex-col items-start gap-1 text-left w-full">
                                <span className="font-semibold text-[#212a3b]">
                                  {voice.name}
                                </span>
                                <span className="text-sm text-[var(--text-secondary)]">
                                  {voice.description}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="form-btn disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Begin Synthesis
          </button>
        </form>
      </Form>
    </div>
  );
}
