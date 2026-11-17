-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "viaPlatform" BOOLEAN NOT NULL DEFAULT false,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "reason" TEXT,
    "snapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_schoolId_createdAt_idx" ON "AuditLog"("schoolId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_schoolId_entityType_entityId_idx" ON "AuditLog"("schoolId", "entityType", "entityId");

-- Deleting records and reversing money are the school super admin's alone now: custom
-- roles lose these permissions (shared/superAdminPermissions.ts).
DELETE FROM "RolePermission"
WHERE "permissionId" IN (
    SELECT "id" FROM "Permission"
    WHERE "code" IN ('payment:cancel', 'expense:void', 'student:delete', 'class:delete', 'section:delete', 'subject:delete', 'group:delete')
);
