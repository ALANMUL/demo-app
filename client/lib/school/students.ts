"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/httpClient";
import type { ApiResponse } from "@/lib/api/types";
import { uploadFile } from "@/lib/api/upload";
import type { Gender } from "./teachers";

export const STUDENT_STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED", "GRADUATED"] as const;
export type StudentStatus = (typeof STUDENT_STATUSES)[number];

export const RELIGIONS = ["ISLAM", "HINDUISM", "CHRISTIANITY", "BUDDHISM", "OTHER"] as const;
export type Religion = (typeof RELIGIONS)[number];

export type EnrollmentStatus = "ACTIVE" | "PROMOTED" | "REPEATED" | "TRANSFERRED" | "WITHDRAWN" | "GRADUATED";
// new to the school that year (admission fee) or an old student (re-admission fee)
export type AdmissionType = "NEW" | "OLD";

export type Enrollment = {
  id: string;
  academicYearId: string;
  rollNumber: string | null;
  status: EnrollmentStatus;
  enrolledAt: string;
  academicYear: { id: string; name: string };
  class: { id: string; name: string };
  section: { id: string; name: string; isDefault: boolean };
  group: { id: string; nameEn: string | null; nameBn: string | null } | null;
  admissionType: AdmissionType;
};

export type Student = {
  id: string;
  admissionNo: string;
  // the day the student joined the school (midnight UTC of that date)
  admissionDate: string;
  nameEn: string;
  nameBn: string;
  dob: string | null;
  gender: Gender;
  fatherName: string;
  motherName: string;
  // the family's login number (+8801XXXXXXXXX); siblings share it
  phone: string | null;
  email: string | null;
  whatsApp: string | null;
  presentAddress: string | null;
  permanentAddress: string | null;
  photo: string | null; // a signed link to the stored photo
  religion: Religion | null;
  guardianName: string | null;
  guardianPhone: string | null;
  status: StudentStatus;
  userId: string | null;
  createdAt: string;
};

export type StudentListItem = Student & {
  hasAccount: boolean;
  // in the listed (or current) year, else the latest one
  enrollment: Enrollment | null;
};

export type StudentDetail = Student & {
  enrollments: Enrollment[]; // newest year first
  account: {
    hasAccount: boolean;
    // the login account, for the super admin to change its password
    userId: string | null;
    loginPhone: string | null;
    isActive: boolean | null;
    // other students of this school on the same login
    siblingsInSchool: number;
  };
};

export type StudentListQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: StudentStatus;
  gender?: Gender;
  religion?: Religion;
  // class, section, group and admission type are for this year; left out = the current year
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  groupId?: string;
  admissionType?: AdmissionType;
  // "roll": roll order, for a class, section or group list
  sortBy?: "admissionNo" | "nameEn" | "createdAt" | "roll";
  sortOrder?: "asc" | "desc";
  // also count each status under the other filters (the students page's status cards)
  withStatusCounts?: boolean;
};

export type StudentList = {
  items: StudentListItem[];
  // with withStatusCounts: how many each status has under the other filters
  statusCounts?: Record<StudentStatus, number>;
  meta: { page: number; limit: number; total: number; totalPages: number };
};

/** The profile fields; "" means "not given" when admitting and "clear it" when editing. */
export type StudentProfileBody = {
  // YYYY-MM-DD; when editing, sent only by those allowed to change it
  admissionDate?: string;
  nameEn: string;
  nameBn: string;
  gender: Gender;
  religion: Religion;
  dob: string; // YYYY-MM-DD
  fatherName: string;
  motherName: string;
  guardianName: string;
  guardianPhone: string;
  phone: string;
  email: string;
  whatsApp: string;
  presentAddress: string;
  permanentAddress: string;
  admissionNo: string;
};

export type AdmitStudentBody = StudentProfileBody & {
  // academicYearId left out = the current year
  // sectionId left out for a class without sections: the server uses its whole-class section
  enrollment: { academicYearId?: string; classId: string; sectionId?: string; groupId: string; rollNumber: string; admissionType: AdmissionType };
};

export type FamilyAccount = {
  // CREATED: a new login whose password is the phone number; LINKED: a sibling's or other existing login
  status: "CREATED" | "LINKED" | "NONE";
  loginPhone: string | null;
  // a new login's password (its phone number), shown once
  password: string | null;
  siblingsInSchool: number;
};

export type AdmitStudentResult = {
  student: Student & { enrollments: Enrollment[] };
  account: FamilyAccount;
  feesAssigned: number;
  warnings: string[];
};

export type UpdateStudentResult = {
  student: Student & { enrollments: Enrollment[] };
  // only when this change created or linked a login
  account: FamilyAccount | null;
};

export type PlacementBody = { sectionId?: string; groupId?: string | null; rollNumber?: string | null; admissionType?: AdmissionType };

/* After a placement change: only when the admission type changed, the fees that swapped. */
export type PlacementResult = StudentDetail & { admissionFees: { removed: number; kept: number } | null };

export const studentsApi = {
  list: async (query: StudentListQuery) =>
    (await httpClient.get<ApiResponse<StudentList>>("/student", { params: query })).data.data,

  get: async (studentId: string) =>
    (await httpClient.get<ApiResponse<StudentDetail>>(`/student/${studentId}`)).data.data,

  admit: async (body: AdmitStudentBody) =>
    (await httpClient.post<ApiResponse<AdmitStudentResult>>("/student", body)).data.data,

  update: async ({ studentId, body }: { studentId: string; body: Partial<StudentProfileBody> & { status?: StudentStatus } }) =>
    (await httpClient.patch<ApiResponse<UpdateStudentResult>>(`/student/${studentId}`, body)).data.data,

  changePlacement: async ({ studentId, body }: { studentId: string; body: PlacementBody }) =>
    (await httpClient.patch<ApiResponse<PlacementResult>>(`/student/${studentId}/enrollment`, body)).data.data,



  // the server crops it to a 400 px square
  setPhoto: ({ studentId, file, onProgress }: { studentId: string; file: File; onProgress?: (percent: number) => void }) =>
    uploadFile<Student>(`/student/${studentId}/photo`, file, onProgress),

  removePhoto: async (studentId: string) =>
    (await httpClient.delete<ApiResponse<Student>>(`/student/${studentId}/photo`)).data.data,

  // a student with no class this year (their class or section was deleted) into one
  place: async ({ studentId, body }: { studentId: string; body: { classId: string; sectionId?: string; rollNumber?: string; admissionType: "NEW" | "OLD" } }) =>
    (await httpClient.post<ApiResponse<StudentDetail>>(`/student/${studentId}/enrollment`, body)).data.data,

  // the super admin only; refused while the student has money records (see the delete check)
  remove: async ({ studentId, reason }: { studentId: string; reason?: string }) => {
    await httpClient.delete(`/student/${studentId}`, { params: { reason } });
  },
};

const studentsKey = ["school", "students"] as const;

export const useStudents = (query: StudentListQuery) =>
  useQuery({
    queryKey: [...studentsKey, "list", query],
    queryFn: () => studentsApi.list(query),
    placeholderData: keepPreviousData,
  });

export type StudentFilterQuery = Omit<StudentListQuery, "page" | "limit" | "sortBy" | "sortOrder" | "withStatusCounts">;

export type StudentSort = Pick<StudentListQuery, "sortBy" | "sortOrder">;

/**
 * Every student under these filters, a page of the most the server allows at a time (for an
 * export), in the given order; without one a class runs in roll order, like its list.
 */
export async function listAllStudents(query: StudentFilterQuery, sort?: StudentSort) {
  const limit = 100;
  const sorted = { ...query, ...(sort?.sortBy ? sort : query.classId ? { sortBy: "roll" as const } : {}) };
  const first = await studentsApi.list({ ...sorted, page: 1, limit });
  const items = [...first.items];
  for (let page = 2; page <= first.meta.totalPages; page++) items.push(...(await studentsApi.list({ ...sorted, page, limit })).items);
  return items;
}

export const useStudent = (studentId: string) =>
  useQuery({ queryKey: [...studentsKey, "detail", studentId], queryFn: () => studentsApi.get(studentId) });

const useStudentMutation = <TArgs, TResult>(mutationFn: (args: TArgs) => Promise<TResult>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentsKey });
      // class, section and group pages count active students
      queryClient.invalidateQueries({ queryKey: ["school", "classes"] });
      queryClient.invalidateQueries({ queryKey: ["school", "sections"] });
      queryClient.invalidateQueries({ queryKey: ["school", "groups"] });
    },
  });
};

export const useAdmitStudent = () => useStudentMutation(studentsApi.admit);
export const useUpdateStudent = () => useStudentMutation(studentsApi.update);
export const useChangePlacement = () => useStudentMutation(studentsApi.changePlacement);
export const useSetStudentPhoto = () => useStudentMutation(studentsApi.setPhoto);
export const useRemoveStudentPhoto = () => useStudentMutation(studentsApi.removePhoto);
export const useDeleteStudent = () => useStudentMutation(studentsApi.remove);
export const usePlaceStudent = () => useStudentMutation(studentsApi.place);

/** "+8801712345678" -> "01712345678": how people type it */
export const localPhone = (phone: string | null) => (phone ?? "").replace(/^\+?880/, "0");
