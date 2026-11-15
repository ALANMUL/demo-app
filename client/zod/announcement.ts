import { z } from "zod";

// Mirrors announcementBody in server/src/app/modules/announcement/announcement.validation.ts.
// Messages are translation keys; <FormMessage> shows them in the current language.

export const announcementFormSchema = z.object({
  kind: z.enum(["NEW_FEATURE", "CHANGE", "MAINTENANCE"]),
  titleEn: z.string().trim().min(1, "validation.titleEnRequired").max(150, "validation.max150"),
  titleBn: z.string().trim().min(1, "validation.titleBnRequired").max(150, "validation.max150"),
  bodyEn: z.string().trim().min(1, "validation.bodyEnRequired").max(5000, "validation.max5000"),
  bodyBn: z.string().trim().min(1, "validation.bodyBnRequired").max(5000, "validation.max5000"),
});

export type AnnouncementFormInput = z.input<typeof announcementFormSchema>;
export type AnnouncementFormValues = z.output<typeof announcementFormSchema>;
