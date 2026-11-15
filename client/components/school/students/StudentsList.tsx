"use client";

import { Eye, MoreHorizontal, Pencil, Plus, Search, Users, X } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TablePagination } from "@/components/data/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useCan } from "@/lib/auth/hooks";
import { useLocalizedName } from "@/lib/i18n/names";
import { useErrorMessage } from "@/lib/i18n/useErrorMessage";
import { useAcademicYears } from "@/lib/school/academicYears";
import { useClasses, type SchoolClass } from "@/lib/school/classes";
import { useGroups } from "@/lib/school/groups";
import { ExportMenu } from "@/components/data/ExportMenu";
import { useSchoolMe } from "@/lib/auth/hooks";
import { datedFileName, type ListExport } from "@/lib/export/listExport";
import {
  listAllStudents,
  localPhone,
  RELIGIONS,
  useStudents,
  type StudentFilterQuery,
  type StudentListItem,
  type AdmissionType,
  type Religion,
  type StudentStatus,
} from "@/lib/school/students";
import type { Gender } from "@/lib/school/teachers";
import { cn } from "@/lib/utils";
import { StudentAvatar } from "./StudentAvatar";
import { StudentStatusBadge } from "./StudentStatusBadge";

const ALL = "ALL";
const PAGE_SIZES = [20, 50, 100];
// rows per page: enough for most of a class; with a class picked, the most the server allows (a section)
const DEFAULT_LIMIT = 50;
const CLASS_LIMIT = 100;
// with one class picked the class is the page's title; with all classes it gets its own column
const CLASS_COLUMNS = ["roll", "student", "father", "phone", "status"] as const;
const ALL_CLASSES_COLUMNS = ["roll", "class", "student", "father", "phone", "status"] as const;
type Column = (typeof ALL_CLASSES_COLUMNS)[number];
const GENDERS = ["MALE", "FEMALE", "OTHER"] as const satisfies readonly Gender[];
// the status tabs above the table, most used first
const STATUS_TABS = ["ACTIVE", "SUSPENDED", "INACTIVE", "GRADUATED"] as const satisfies readonly StudentStatus[];
// classes from this level up are the college's (HSC 1st and 2nd year are 11 and 12)
const COLLEGE_LEVEL = 11;

// undefined = no filter, except the year: undefined there means the current year
type Filters = {
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  groupId?: string;
  // new or old students that year (who pays the admission or the re-admission fee)
  admissionType?: AdmissionType;
  gender?: Gender;
  religion?: Religion;
  status?: StudentStatus;
};

const DEFAULT_FILTERS: Filters = { status: "ACTIVE" };

const isChanged = (filters: Filters) =>
  (Object.keys(filters) as (keyof Filters)[]).some((key) => filters[key] !== DEFAULT_FILTERS[key]);

// each filter's name in the address ("?class=…&section=…&status=all&page=2")
const PARAMS: Record<keyof Filters, string> = {
  academicYearId: "year",
  classId: "class",
  sectionId: "section",
  groupId: "group",
  admissionType: "type",
  gender: "gender",
  religion: "religion",
  status: "status",
};
// the status in the address: none means the default (Active), "all" means no status filter
const ALL_STATUSES = "all";

/*
 * The list's place (filters, search, page, rows per page) lives in the address, so Back from a
 * student, a refresh or a shared link returns to the same class, tab and page. Unknown values in
 * the address are ignored.
 */
function useRegisterPlace() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const text = (key: string) => params.get(key)?.trim() || undefined;
  const pick = <T extends string>(key: string, allowed: readonly T[]) => {
    const value = params.get(key);
    return value && (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
  };

  const statusParam = params.get(PARAMS.status);
  const filters: Filters = {
    academicYearId: text(PARAMS.academicYearId),
    classId: text(PARAMS.classId),
    sectionId: text(PARAMS.sectionId),
    groupId: text(PARAMS.groupId),
    admissionType: pick(PARAMS.admissionType, ["NEW", "OLD"] as const),
    gender: pick(PARAMS.gender, GENDERS),
    religion: pick(PARAMS.religion, RELIGIONS),
    status: statusParam === ALL_STATUSES ? undefined : (pick(PARAMS.status, STATUS_TABS) ?? DEFAULT_FILTERS.status),
  };
  const page = Math.max(1, Number.parseInt(params.get("page") ?? "", 10) || 1);
  const askedLimit = Number(params.get("limit"));
  const limit = PAGE_SIZES.includes(askedLimit) ? askedLimit : undefined;
  const search = params.get("q") ?? "";

  // undefined removes the key; the page is written only when it is past the first
  const write = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  // a filter change starts again from page 1
  const setFilters = (patch: Partial<Filters>) =>
    write({
      ...Object.fromEntries(
        (Object.keys(patch) as (keyof Filters)[]).map((key) => {
          const value = patch[key];
          if (key === "status") return [PARAMS.status, value === DEFAULT_FILTERS.status ? undefined : (value ?? ALL_STATUSES)];
          return [PARAMS[key], value];
        }),
      ),
      page: undefined,
    });

  return {
    filters,
    page,
    limit,
    search,
    setFilters,
    setSearch: (q: string) => write({ q: q || undefined, page: undefined }),
    setPage: (n: number) => write({ page: n > 1 ? String(n) : undefined }),
    setLimit: (n: number) => write({ limit: String(n), page: undefined }),
    clear: () => router.replace(pathname, { scroll: false }),
  };
}

type Option = { value: string; label: string };

/* One dropdown in the filter row (class and section are picked in the class index instead). */
type FilterField = {
  key: Exclude<keyof Filters, "status" | "classId" | "sectionId">;
  label: string;
  // its "all" choice; without one (the year) it always has a value
  allLabel?: string;
  options: Option[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

/**
 * The school's student register: a class index down the side (class, then its sections), the
 * status tabs, a line saying which students are shown, the search and the other filters, and
 * the table. The roll leads each row, the way the office looks students up.
 */
export function StudentsList() {
  const t = useTranslations("school.students");
  const tStatus = useTranslations("studentStatuses");
  const tCommon = useTranslations("common");
  const tType = useTranslations("school.students.admissionType");
  const tGender = useTranslations("genders");
  const tReligion = useTranslations("religions");
  const format = useFormatter();
  const locale = useLocale();
  const describeError = useErrorMessage();
  const can = useCan();
  const name = useLocalizedName();
  const classes = useClasses();
  const years = useAcademicYears();
  const groups = useGroups();

  const place = useRegisterPlace();
  const { filters, page, search } = place;
  // a class's list fits on one page unless a smaller page was chosen
  const limit = place.limit ?? (filters.classId ? CLASS_LIMIT : DEFAULT_LIMIT);

  // the box shows what is typed at once; the address (and the search) follow after a pause
  const [searchInput, setSearchInput] = useState(search);
  const typed = useDebouncedValue(searchInput.trim());
  useEffect(() => {
    if (typed !== search) place.setSearch(typed);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only a new pause in typing writes the address
  }, [typed]);

  // one request: this page of students and, for the status tabs, how many each status has
  const { data, isPending, isPlaceholderData, isError, error, isFetching, refetch } = useStudents({
    page,
    limit,
    search: search || undefined,
    ...filters,
    // a class's list runs in roll order, like the register
    ...(filters.classId ? { sortBy: "roll" as const } : {}),
    withStatusCounts: true,
  });

  const currentYear = years.data?.find((y) => y.isCurrent);
  const shownYear = years.data?.find((y) => y.id === (filters.academicYearId ?? currentYear?.id));
  const pickedClass = classes.data?.items.find((c) => c.id === filters.classId);
  const pickedSection = pickedClass?.sections.find((s) => s.id === filters.sectionId);
  const students = data?.items ?? [];
  // read from the filter, not the loaded class, so the columns don't jump while the classes load
  const columns = filters.classId ? CLASS_COLUMNS : ALL_CLASSES_COLUMNS;
  // the default view (Active, every class) is not a filter
  const filtering = !!search || isChanged(filters);
  const canClear = !!searchInput || isChanged(filters);
  const setFilter = place.setFilters;

  const clearFilters = () => {
    setSearchInput("");
    place.clear();
  };

  // a dropdown shows only when it has something to choose from
  const fields: FilterField[] = [
    ...(years.data?.length
      ? [
          {
            key: "academicYearId" as const,
            label: t("filters.academicYear"),
            options: years.data.map((y) => ({
              value: y.id,
              label: y.isCurrent ? t("filters.currentYear", { year: y.name }) : y.name,
            })),
            value: filters.academicYearId ?? currentYear?.id,
            // the current year is the default, so picking it clears the filter
            onChange: (id: string | undefined) => setFilter({ academicYearId: id === currentYear?.id ? undefined : id }),
          },
        ]
      : []),
    ...(groups.data?.items.length
      ? [
          {
            key: "groupId" as const,
            label: t("filters.group"),
            allLabel: t("filters.allGroups"),
            options: groups.data.items.map((g) => ({ value: g.id, label: name(g) })),
            value: filters.groupId,
            onChange: (groupId: string | undefined) => setFilter({ groupId }),
          },
        ]
      : []),
    {
      key: "admissionType",
      label: tType("label"),
      allLabel: tType("allTypes"),
      options: (["NEW", "OLD"] as const).map((type) => ({ value: type, label: tType(`types.${type}`) })),
      value: filters.admissionType,
      onChange: (v) => setFilter({ admissionType: v as AdmissionType | undefined }),
    },
    {
      key: "gender",
      label: t("filters.gender"),
      allLabel: t("filters.allGenders"),
      options: GENDERS.map((g) => ({ value: g, label: tGender(g) })),
      value: filters.gender,
      onChange: (v) => setFilter({ gender: v as Gender | undefined }),
    },
    {
      key: "religion",
      label: t("filters.religion"),
      allLabel: t("filters.allReligions"),
      options: RELIGIONS.map((r) => ({ value: r, label: tReligion(r) })),
      value: filters.religion,
      onChange: (v) => setFilter({ religion: v as Religion | undefined }),
    },
  ];

  const counts = data?.statusCounts;
  const allCount = counts ? Object.values(counts).reduce((sum, n) => sum + n, 0) : undefined;

  // which students are shown, in words: "Class 7, section A" and "38 active students in 2026"
  const where = pickedClass
    ? pickedSection && !pickedSection.isDefault
      ? t("register.classSection", { className: pickedClass.name, section: pickedSection.name })
      : pickedClass.name
    : t("register.allClasses");
  const statusWord = filters.status ? tStatus(filters.status) : "";
  const statusInSentence = locale === "en" ? statusWord.toLowerCase() : statusWord;
  // the list keeps to one year only when a year, class, section, group or new/old is chosen
  const yearScoped = !!(filters.academicYearId || filters.classId || filters.sectionId || filters.groupId || filters.admissionType);
  const year = yearScoped ? shownYear?.name : undefined;
  const summary = !data
    ? null
    : year
      ? filters.status
        ? t("register.countStatus", { count: data.meta.total, status: statusInSentence, year })
        : t("register.countAll", { count: data.meta.total, year })
      : filters.status
        ? t("register.countStatusAnyYear", { count: data.meta.total, status: statusInSentence })
        : t("register.countAllAnyYear", { count: data.meta.total });
  // the rows still on screen belong to the last choice while the new ones load
  const loadingNew = isFetching && isPlaceholderData;
  // tabs with students when this one has none ("None active; 1 suspended")
  const otherTabs = counts ? STATUS_TABS.filter((s) => s !== filters.status && counts[s] > 0) : [];
  // the class sizes in the index are the current year's active students: shown only where they match the list
  const showClassCounts = filters.status === "ACTIVE" && !filters.academicYearId;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex min-w-0 items-end gap-3">
          <h1 className="page-title">{t("title")}</h1>
          {allCount !== undefined && (
            <Badge className="mb-1 rounded-full border-0 bg-navy-soft px-2.5 font-semibold text-navy tabular-nums">
              {format.number(allCount)}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ExportButton query={{ search: search || undefined, ...filters }} filtered={filtering} />
          {can("student:create") && (
            <Button asChild className="h-9 px-4">
              <Link href="/students/new">
                <Plus /> {t("add")}
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Card className="gap-0 overflow-hidden border-border/60 py-0">
        {/* the statuses: each tab picks its students (All clears it), with how many there are. The tab
            bar is the card's own band, over the classes and the list; everything under it keeps to the
            open tab, and the table is its panel. Arrow keys move between tabs, Enter or Space opens one */}
        <Tabs
          value={filters.status ?? ALL}
          onValueChange={(v) => setFilter({ status: v === ALL ? undefined : (v as StudentStatus) })}
          activationMode="manual"
          className="gap-0"
        >
          <TabsList
            aria-label={t("columns.status")}
            className="gap-7 bg-brand-band px-5 shadow-none [&>button]:h-12! [&>button]:text-brand-band-foreground/75! [&>button:hover]:text-brand-band-foreground! [&>button[data-state=active]]:text-brand-band-foreground!"
          >
            {([ALL, ...STATUS_TABS] as const).map((s) => {
              const count = counts ? (s === ALL ? allCount : counts[s]) : undefined;
              return (
                <TabsTrigger key={s} value={s} className="group/tab gap-2 data-[state=active]:after:bg-brand-band-foreground!">
                  {s === ALL ? t("filters.all") : tStatus(s)}
                  {count === undefined ? (
                    <Skeleton className="h-4 w-6 bg-brand-band-foreground/15" />
                  ) : (
                    <span className="rounded-full bg-brand-band-foreground/12 px-1.5 py-px text-xs font-medium text-brand-band-foreground/85 tabular-nums transition-colors group-data-[state=active]/tab:bg-brand-band-foreground group-data-[state=active]/tab:text-brand-band">
                      {format.number(count)}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)]">
            <ClassIndex
              classes={classes.data?.items}
              classId={filters.classId}
              sectionId={filters.sectionId}
              showCounts={showClassCounts}
              onPick={(classId, sectionId) => setFilter({ classId, sectionId })}
            />

            <div className="min-w-0">
              {/* which students these are, and the search beside it; the summary is read out when it changes */}
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 pt-5">
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-lg font-semibold tracking-tight">{where}</h2>
                  <p aria-live="polite" className="text-sm text-muted-foreground">
                    {loadingNew ? t("register.loading") : summary}
                  </p>
                </div>
                <div className="flex w-full items-center gap-4 sm:w-auto">
                  {canClear && (
                    <Button variant="link" size="sm" onClick={clearFilters} className="h-auto shrink-0 px-0 text-muted-foreground hover:text-foreground">
                      {t("filters.clear")}
                    </Button>
                  )}
                  <div className="group/search relative w-full min-w-0 sm:w-64">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within/search:text-foreground" />
                    <Input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder={t("searchPlaceholder")}
                      aria-label={tCommon("search")}
                      className="h-9 border-border/60 pr-8 pl-9 shadow-none"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={() => setSearchInput("")}
                        aria-label={t("filters.remove", { name: tCommon("search") })}
                        className="absolute top-1/2 right-2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 px-5 pt-4 pb-5">
                {fields.map((field) => (
                  <FilterSelect key={field.key} field={field} />
                ))}
              </div>

              <TabsContent value={filters.status ?? ALL} className="min-w-0">
                <Separator className="bg-border/60" />
                <div aria-busy={loadingNew} className={cn("transition-opacity duration-300", isFetching && !isPending && "opacity-60")}>
                  <Table>
                    <TableHeader className="bg-navy-soft/70 [&_tr]:border-navy/10">
                      <TableRow>
                        {columns.map((column) => (
                          <TableHead key={column} className={cn(HEAD, column === "roll" && "w-24")}>
                            {t(`columns.${column}`)}
                          </TableHead>
                        ))}
                        <TableHead className={cn(HEAD, "w-12")}>
                          <span className="sr-only">{t("columns.actions")}</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isPending ? (
                        Array.from({ length: 6 }, (_, i) => <SkeletonRow key={i} columns={columns.length} />)
                      ) : isError ? (
                        <MessageRow columns={columns.length}>
                          <p className="font-medium text-foreground">{t("loadFailed")}</p>
                          <p className="text-xs">{describeError(error)}</p>
                          <Button variant="outline" size="sm" onClick={() => refetch()}>
                            {tCommon("tryAgain")}
                          </Button>
                        </MessageRow>
                      ) : students.length === 0 ? (
                        <MessageRow columns={columns.length}>
                          <span className="mb-1 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <Users className="size-5" />
                          </span>
                          {filters.status && otherTabs.length > 0 ? (
                            // none in this tab, but some in others: say where they are
                            <>
                              <p className="font-medium text-foreground">{t("register.noneInTab", { status: statusInSentence })}</p>
                              <div className="flex flex-wrap justify-center gap-2">
                                {otherTabs.map((s) => (
                                  <Button key={s} variant="outline" size="sm" onClick={() => setFilter({ status: s })}>
                                    {t("register.showTab", { status: tStatus(s), count: format.number(counts![s]) })}
                                  </Button>
                                ))}
                              </div>
                            </>
                          ) : filtering ? (
                            <>
                              <p className="font-medium text-foreground">{t("emptyFiltered")}</p>
                              {canClear && (
                                <Button variant="outline" size="sm" onClick={clearFilters}>
                                  {t("filters.clear")}
                                </Button>
                              )}
                            </>
                          ) : (
                            // a school with no students yet: its first admission starts here
                            <>
                              <p className="font-medium text-foreground">{t("empty")}</p>
                              {can("student:create") && (
                                <Button asChild size="sm">
                                  <Link href="/students/new">
                                    <Plus /> {t("add")}
                                  </Link>
                                </Button>
                              )}
                            </>
                          )}
                        </MessageRow>
                      ) : (
                        students.map((student) => (
                          <StudentRow key={student.id} student={student} columns={columns} canUpdate={can("student:update")} />
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {data && data.meta.total > 0 && (
                  <>
                    <Separator className="bg-border/60" />
                    <div className="px-5 py-3">
                      <TablePagination
                        page={data.meta.page}
                        limit={data.meta.limit}
                        total={data.meta.total}
                        totalPages={Math.max(1, data.meta.totalPages)}
                        limits={PAGE_SIZES}
                        onPageChange={place.setPage}
                        onLimitChange={place.setLimit}
                        disabled={isFetching}
                      />
                    </div>
                  </>
                )}
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}

// roomier rows; the first and last cells line up with the card's padding. The headings read
// as plain words, in sentence case, rather than the tables' usual small capitals
const HEAD = "h-11 tracking-normal text-navy normal-case first:pl-5 last:pr-5";

const CELL = "py-3 first:pl-5 last:pr-5";

/*
 * The class index, like the tabs of a register book: all classes, then the school's classes and
 * the college's, a gold mark on the one picked and its sections under it. From lg it runs down
 * the side; below lg it is a row that scrolls sideways.
 */
function ClassIndex({
  classes,
  classId,
  sectionId,
  showCounts,
  onPick,
}: {
  classes: SchoolClass[] | undefined;
  classId: string | undefined;
  sectionId: string | undefined;
  showCounts: boolean;
  onPick: (classId: string | undefined, sectionId: string | undefined) => void;
}) {
  const t = useTranslations("school.students.register");
  const format = useFormatter();
  const school = classes?.filter((c) => c.numericLevel < COLLEGE_LEVEL) ?? [];
  const college = classes?.filter((c) => c.numericLevel >= COLLEGE_LEVEL) ?? [];
  // headings only when both kinds are there
  const both = school.length > 0 && college.length > 0;

  const entry = (c: SchoolClass) => {
    const picked = c.id === classId;
    const sections = c.sections.filter((s) => !s.isDefault);
    return (
      <div key={c.id} className="contents lg:block">
        <IndexButton picked={picked} onClick={() => onPick(c.id, undefined)}>
          <span className="truncate" title={c.name}>
            {c.name}
          </span>
          {showCounts && c.activeStudents !== null && (
            <span className="ml-auto pl-2 text-xs font-normal text-muted-foreground tabular-nums">{format.number(c.activeStudents)}</span>
          )}
        </IndexButton>
        {picked && sections.length > 0 && (
          <div role="group" aria-label={t("sectionsOf", { className: c.name })} className="flex shrink-0 gap-1.5 lg:flex-wrap lg:px-2 lg:pt-1.5 lg:pb-2.5">
            <SectionButton picked={!sectionId} onClick={() => onPick(c.id, undefined)}>
              {t("allSections")}
            </SectionButton>
            {sections.map((s) => (
              <SectionButton key={s.id} picked={s.id === sectionId} onClick={() => onPick(c.id, s.id)}>
                {s.name}
              </SectionButton>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      aria-label={t("title")}
      className="flex items-center gap-1.5 overflow-x-auto border-b border-border/60 bg-navy-soft/45 px-3 py-2.5 [scrollbar-width:none] lg:block lg:overflow-visible lg:border-r lg:border-b-0 lg:px-2.5 lg:py-4"
    >
      <h2 className="hidden px-2.5 pb-2 text-sm font-medium text-muted-foreground lg:block">{t("title")}</h2>
      <IndexButton picked={!classId} onClick={() => onPick(undefined, undefined)}>
        {t("allClasses")}
      </IndexButton>
      {!classes ? (
        <div className="flex gap-1.5 lg:mt-2 lg:block lg:space-y-1.5 lg:px-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-7 w-20 lg:w-full" />
          ))}
        </div>
      ) : (
        <>
          {both && <IndexHeading>{t("school")}</IndexHeading>}
          {school.map(entry)}
          {both && <IndexHeading>{t("college")}</IndexHeading>}
          {college.map(entry)}
        </>
      )}
    </nav>
  );
}

function IndexHeading({ children }: { children: React.ReactNode }) {
  return <p className="hidden px-2.5 pt-4 pb-1.5 text-[13px] text-muted-foreground lg:block">{children}</p>;
}

function IndexButton({ picked, onClick, children }: { picked: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={picked ? "true" : undefined}
      className={cn(
        "relative flex h-9 shrink-0 items-center rounded-md px-3 text-left text-[15px] whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-card lg:w-full lg:pl-3.5",
        picked
          ? "bg-card font-semibold text-navy ring-1 ring-navy/15 lg:before:absolute lg:before:top-2 lg:before:bottom-2 lg:before:left-1 lg:before:w-[3px] lg:before:rounded-full lg:before:bg-sidebar-primary"
          : "text-foreground/80 hover:bg-card/70 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function SectionButton({ picked, onClick, children }: { picked: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={picked}
      className={cn(
        "h-8 min-w-9 shrink-0 rounded-md border px-2.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        picked ? "border-navy bg-navy font-semibold text-navy-foreground" : "border-border/70 bg-card hover:border-foreground/25",
      )}
    >
      {children}
    </button>
  );
}

/** A compact dropdown in the toolbar, "Year: 2026": its name inside the box, its "all" choice (if any) clears it, and it is outlined while set. */
function FilterSelect({ field }: { field: FilterField }) {
  const { label, value, allLabel, options, onChange } = field;
  const active = !!allLabel && value !== undefined;
  return (
    <Select value={value ?? (allLabel ? ALL : "")} onValueChange={(v) => onChange(v === ALL ? undefined : v)}>
      <SelectTrigger
        className={cn(
          "h-9 max-w-72 gap-1.5 border-border/60 bg-card pr-2.5 pl-3 shadow-none transition-colors hover:border-foreground/25 dark:bg-card",
          active && "border-foreground/30 bg-muted/50",
        )}
      >
        <span className="shrink-0 text-muted-foreground">{label}</span>
        <span className="min-w-0 truncate font-medium">
          <SelectValue placeholder={allLabel} />
        </span>
      </SelectTrigger>
      <SelectContent>
        {allLabel && <SelectItem value={ALL}>{allLabel}</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SkeletonRow({ columns }: { columns: number }) {
  return (
    <TableRow className="hover:bg-transparent">
      {Array.from({ length: columns + 1 }, (_, j) => (
        <TableCell key={j} className={CELL}>
          <Skeleton className="h-3.5 w-full max-w-28" />
        </TableCell>
      ))}
    </TableRow>
  );
}

function MessageRow({ columns, children }: { columns: number; children: React.ReactNode }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={columns + 1} className="h-56">
        <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          {children}
        </div>
      </TableCell>
    </TableRow>
  );
}

function StudentRow({
  student,
  columns,
  canUpdate,
}: {
  student: StudentListItem;
  columns: readonly Column[];
  canUpdate: boolean;
}) {
  const t = useTranslations("school.students");
  const name = useLocalizedName();
  const href = `/students/${student.id}`;
  const enrollment = student.enrollment;
  // the section only when the class has more than one; the year only when it is not the current one
  const classDetail = enrollment
    ? [!enrollment.section.isDefault && enrollment.section.name, enrollment.status !== "ACTIVE" && enrollment.academicYear.name]
        .filter(Boolean)
        .join(", ")
    : "";

  const cells: Record<Column, React.ReactNode> = {
    class: (
      <TableCell key="class" className={cn(CELL, "whitespace-nowrap")}>
        {enrollment ? (
          <>
            <div className="font-medium">{enrollment.class.name}</div>
            {classDetail && <div className="text-xs text-muted-foreground">{classDetail}</div>}
          </>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
    ),
    roll: (
      <TableCell key="roll" className={CELL}>
        <div className="text-lg leading-tight font-bold text-navy tabular-nums">
          {enrollment?.rollNumber ?? <span className="text-base font-normal text-muted-foreground">—</span>}
        </div>
      </TableCell>
    ),
    student: (
      <TableCell key="student" className={CELL}>
        <div className="flex items-center gap-3">
          <Link href={href} tabIndex={-1} aria-hidden className="shrink-0">
            <StudentAvatar photo={student.photo} name={name(student)} className="size-9" />
          </Link>
          <div className="min-w-0">
            <Link href={href} className="font-semibold underline-offset-4 hover:underline">
              {name(student)}
            </Link>
            <div className="text-xs text-muted-foreground tabular-nums">{t("admissionNoShort", { no: student.admissionNo })}</div>
          </div>
        </div>
      </TableCell>
    ),
    father: (
      <TableCell key="father" className={CELL}>
        {student.fatherName}
      </TableCell>
    ),
    phone: (
      <TableCell key="phone" className={cn(CELL, "tabular-nums")}>
        {student.phone ? localPhone(student.phone) : <span className="text-muted-foreground">{t("noLogin")}</span>}
      </TableCell>
    ),
    status: (
      <TableCell key="status" className={CELL}>
        <StudentStatusBadge status={student.status} />
      </TableCell>
    ),
  };

  return (
    <TableRow className="group/row">
      {columns.map((column) => cells[column])}
      <TableCell className={CELL}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground group-hover/row:text-foreground"
              aria-label={t("actionsFor", { name: name(student) })}
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={href}>
                <Eye /> {t("view")}
              </Link>
            </DropdownMenuItem>
            {canUpdate && (
              <DropdownMenuItem asChild>
                <Link href={`${href}/edit`}>
                  <Pencil /> {t("edit")}
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

/** Saves (Excel) or prints (PDF) the students under the current filters and tab. */
function ExportButton({ query, filtered }: { query: StudentFilterQuery; filtered: boolean }) {
  const t = useTranslations("school.students");
  const tStatus = useTranslations("studentStatuses");
  const tGender = useTranslations("genders");
  const tExport = useTranslations("export");
  const name = useLocalizedName();
  const format = useFormatter();
  const me = useSchoolMe();

  const load = async (): Promise<ListExport> => {
    const students = await listAllStudents(query);
    return {
      fileName: datedFileName("students"),
      school: me ? name(me.school) : "",
      title: t("title"),
      subtitle: [
        tExport("made", { date: format.dateTime(new Date(), { dateStyle: "medium", timeZone: "Asia/Dhaka" }) }),
        tExport("count", { count: students.length }),
        filtered ? tExport("filtered") : null,
      ]
        .filter(Boolean)
        .join(" · "),
      columns: [
        { header: t("form.admissionNo") },
        { header: t("form.nameEn") },
        { header: t("form.nameBn") },
        { header: t("form.class") },
        { header: t("form.section") },
        { header: t("form.group") },
        { header: t("form.rollNumber"), align: "right" },
        { header: t("form.fatherName") },
        { header: t("form.gender") },
        { header: t("columns.phone") },
        { header: t("columns.status") },
      ],
      rows: students.map((s) => {
        const e = s.enrollment;
        return [
          s.admissionNo,
          s.nameEn,
          s.nameBn,
          e?.class.name,
          e && !e.section.isDefault ? e.section.name : "",
          e?.group ? name(e.group) : "",
          e?.rollNumber,
          s.fatherName,
          s.gender ? tGender(s.gender) : "",
          s.phone ? localPhone(s.phone) : "",
          tStatus(s.status),
        ];
      }),
    };
  };

  return <ExportMenu load={load} />;
}
