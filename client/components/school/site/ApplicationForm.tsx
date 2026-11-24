"use client";

import { ArrowLeft, CheckCircle2, Info, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { publicSchoolRoutes } from "@/lib/auth/routes";
import { cn } from "@/lib/utils";
import { SiteLabel } from "./SiteLabel";

// the classes a child can apply for, youngest first (names in messages: schoolHome.apply.classes)
const CLASSES = ["play", "nursery", "kg", "class1", "class2", "class3", "class4", "class5", "class6", "class7", "class8", "class9", "class10", "hsc1"] as const;
const GENDERS = ["MALE", "FEMALE", "OTHER"] as const;
const RELIGIONS = ["ISLAM", "HINDUISM", "CHRISTIANITY", "BUDDHISM", "OTHER"] as const;

type Fields = {
  nameEn: string;
  nameBn: string;
  dateOfBirth: string;
  gender: string;
  religion: string;
  classApplying: string;
  birthRegNo: string;
  previousSchool: string;
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  email: string;
  address: string;
};
type Field = keyof Fields;

const EMPTY: Fields = {
  nameEn: "",
  nameBn: "",
  dateOfBirth: "",
  gender: "",
  religion: "",
  classApplying: "",
  birthRegNo: "",
  previousSchool: "",
  fatherName: "",
  motherName: "",
  guardianPhone: "",
  email: "",
  address: "",
};

const REQUIRED: Field[] = ["nameEn", "dateOfBirth", "gender", "classApplying", "fatherName", "motherName", "guardianPhone", "address"];

// Bangla digits as ASCII, then a Bangladeshi mobile number: 01XXXXXXXXX (with or without +88)
const toAscii = (v: string) => v.replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)));
const isMobile = (v: string) => /^(?:\+?88)?01[3-9]\d{8}$/.test(toAscii(v).replace(/[\s-]/g, ""));
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/*
 * The admission application: the school's own year as a small label, the heading and a line on
 * what to fill in, a note that this is a preview (nothing is sent yet), then one white sheet split
 * by hairlines into bands (the student; the parents and how to reach them), each band's name and
 * hint on the left from 1024px. Required fields carry a star; problems show under their field on
 * submit. Sending shows a confirmation in place of the form.
 */
export function ApplicationForm({ schoolName, openYear }: { schoolName: string; openYear: string }) {
  const t = useTranslations("schoolHome.apply");
  const tGender = useTranslations("genders");
  const tReligion = useTranslations("religions");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (key: Field) => (value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    // a fixed field loses its message as soon as it is changed
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found: Partial<Record<Field, string>> = {};
    for (const key of REQUIRED) if (!fields[key].trim()) found[key] = t("required");
    if (fields.guardianPhone.trim() && !isMobile(fields.guardianPhone)) found.guardianPhone = t("badPhone");
    if (fields.email.trim() && !isEmail(fields.email.trim())) found.email = t("badEmail");
    setErrors(found);
    const first = REQUIRED.concat(["email"]).find((key) => found[key]);
    if (first) {
      document.getElementById(`apply-${first}`)?.focus();
      return;
    }
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const text = (key: Field, props: { label: string; type?: string; placeholder?: string; inputMode?: "tel" | "email" } & { className?: string }) => (
    <Item id={key} label={props.label} required={REQUIRED.includes(key)} error={errors[key]} className={props.className}>
      <Input
        id={`apply-${key}`}
        type={props.type ?? "text"}
        inputMode={props.inputMode}
        value={fields[key]}
        onChange={(e) => set(key)(e.target.value)}
        placeholder={props.placeholder}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `apply-${key}-error` : undefined}
        className="h-10 bg-white"
      />
    </Item>
  );

  const choice = <T extends string>(key: Field, label: string, options: readonly T[], name: (o: T) => string) => (
    <Item id={key} label={label} required={REQUIRED.includes(key)} error={errors[key]}>
      <Select value={fields[key]} onValueChange={set(key)}>
        <SelectTrigger
          id={`apply-${key}`}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `apply-${key}-error` : undefined}
          className="h-10 w-full bg-white"
        >
          <SelectValue placeholder={t("choose")} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {name(o)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Item>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <Link href={publicSchoolRoutes.home} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink hover:underline">
        <ArrowLeft className="size-4" /> {t("back")}
      </Link>

      <div className="mt-6">
        <SiteLabel>{openYear ? t("label", { year: openYear }) : t("labelNoYear")}</SiteLabel>
        <h1 className="mt-1.5 text-[1.75rem] leading-tight font-bold tracking-[-0.015em] text-brand-ink sm:text-[2.25rem]">{t("title")}</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-base">{t("intro", { school: schoolName })}</p>
      </div>

      {sent ? (
        <div role="status" className="mt-8 rounded-[16px] border border-border/70 bg-card p-6 sm:p-10">
          <CheckCircle2 className="size-10 text-emerald-600" />
          <h2 className="mt-4 text-xl font-bold text-brand-ink sm:text-2xl">{t("sentTitle", { name: fields.nameEn.trim() })}</h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-slate-600">{t("sentPreview")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setFields(EMPTY);
                setSent(false);
              }}
            >
              {t("another")}
            </Button>
            <Button asChild>
              <Link href={publicSchoolRoutes.home}>{t("home")}</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* honest about what this form does for now */}
          <p className="mt-6 flex items-start gap-2.5 rounded-[12px] border border-site-gold/40 bg-site-gold/10 px-4 py-3 text-sm leading-relaxed text-foreground/85">
            <Info className="mt-0.5 size-4 shrink-0 text-site-label" />
            {t("previewNote")}
          </p>

          <form noValidate onSubmit={submit} className="mt-6 divide-y divide-border/70 overflow-hidden rounded-[16px] border border-border/70 bg-card">
            <Band title={t("student")} hint={t("studentHint")}>
              {text("nameEn", { label: t("nameEn"), placeholder: t("nameEnPlaceholder") })}
              {text("nameBn", { label: t("nameBn"), placeholder: t("nameBnPlaceholder") })}
              {text("dateOfBirth", { label: t("dateOfBirth"), type: "date" })}
              {choice("gender", t("gender"), GENDERS, (g) => tGender(g))}
              {choice("classApplying", t("classApplying"), CLASSES, (c) => t(`classes.${c}`))}
              {choice("religion", t("religion"), RELIGIONS, (r) => tReligion(r))}
              {text("birthRegNo", { label: t("birthRegNo"), inputMode: "tel" })}
              {text("previousSchool", { label: t("previousSchool") })}
            </Band>

            <Band title={t("family")} hint={t("familyHint")}>
              {text("fatherName", { label: t("fatherName") })}
              {text("motherName", { label: t("motherName") })}
              {text("guardianPhone", { label: t("guardianPhone"), type: "tel", inputMode: "tel", placeholder: "01XXXXXXXXX" })}
              {text("email", { label: t("email"), type: "email", inputMode: "email" })}
              <Item id="address" label={t("address")} required error={errors.address} className="sm:col-span-2">
                <Textarea
                  id="apply-address"
                  value={fields.address}
                  onChange={(e) => set("address")(e.target.value)}
                  rows={3}
                  maxLength={300}
                  aria-invalid={!!errors.address}
                  aria-describedby={errors.address ? "apply-address-error" : undefined}
                  className="bg-white"
                />
              </Item>
            </Band>

            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 px-5 py-4 sm:px-7">
              <p className="text-xs text-muted-foreground">
                <span className="text-destructive">*</span> {t("requiredNote")}
              </p>
              <Button type="submit" className="h-11 rounded-full px-6">
                <Send /> {t("submit")}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

/* One band of the sheet: its name and hint on the left (above, below 1024px), its fields two across from 640px. */
function Band({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className="grid gap-5 px-5 py-6 sm:px-7 sm:py-7 lg:grid-cols-[13.75rem_minmax(0,1fr)] lg:gap-8">
      <div>
        <h2 id={id} className="text-base font-bold text-brand-ink">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{hint}</p>
      </div>
      <div className="grid items-start gap-x-5 gap-y-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Item({ id, label, required, error, className, children }: { id: string; label: string; required?: boolean; error?: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={`apply-${id}`} className="text-sm font-medium">
        {label}
        {required && (
          <span aria-hidden className="text-destructive">
            *
          </span>
        )}
      </Label>
      {children}
      {error && (
        <p id={`apply-${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
