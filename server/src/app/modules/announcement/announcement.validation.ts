import { z } from "zod";
import { AnnouncementKind } from "../../../../generated/prisma/enums";
import { idSchema } from "../../shared/financeSchemas";

const title = (language: string) =>
  z.string({ error: `${language} title is required!` }).trim().min(1, `${language} title is required!`).max(150);
const body = (language: string) =>
  z.string({ error: `${language} text is required!` }).trim().min(1, `${language} text is required!`).max(5000);

// one body for create and update (an update replaces everything)
const announcementBody = z.strictObject({
  kind: z.enum(AnnouncementKind, { error: "Choose what the announcement is about" }),
  titleEn: title("English"),
  titleBn: title("Bangla"),
  bodyEn: body("English"),
  bodyBn: body("Bangla"),
});

const announcementIdParams = z.object({ announcementId: idSchema("Announcement id") });

const listQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const AnnouncementValidation = { announcementBody, announcementIdParams, listQuery };

export type AnnouncementPayload = z.infer<typeof announcementBody>;
export type AnnouncementListQuery = z.infer<typeof listQuery>;
