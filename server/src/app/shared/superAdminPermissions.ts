/*
 * Deleting records and reversing money: only the school super admin (and the platform admin
 * working inside the school) may do them. The codes still exist, so their routes keep the
 * module check (authorize) next to superAdminOnly, but no other role can be given them
 * (role.service.ts leaves them out). Deletes without a code of their own (teachers, years,
 * exams, attendance, fee setup) use superAdminOnly with one of the module's other codes.
 */
export const SUPER_ADMIN_ONLY_PERMISSIONS = [
  "payment:cancel",
  "expense:void",
  "student:delete",
  "class:delete",
  "section:delete",
  "subject:delete",
  "group:delete",
];
