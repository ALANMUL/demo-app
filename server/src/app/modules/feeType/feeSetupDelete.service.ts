import httpStatus from "http-status";
import type { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "../../../../lib/prisma";
import { AppError } from "../../errorHandler/AppError";
import { writeAuditLog } from "../../shared/auditLog";
import { assertDeletable, blocker, deleteCheck } from "../../shared/deleteCheck";
import type { OptionalReasonQuery } from "../../shared/deleteSchemas";
import { feeWithMoney, untouchedFee } from "../../shared/moneyGuard";
import { displayName } from "../../shared/names";
import { lockStudentFees } from "../studentFee/studentFee.service";

/*
 * Deleting fee setup where no money moved (the super admin only, see the routes): a class's
 * fee, a fee type, a fund, a custom fee of one student. Each takes its unpaid fees with it
 * and is refused once any of its fees was paid or discounted, or (a fund) once money went
 * through it. Money that moved is only ever cancelled or voided.
 */

type Db = Prisma.TransactionClient | typeof prisma;
type Auth = NonNullable<Express.Request["auth"]>;

const TX_OPTIONS = { maxWait: 10_000, timeout: 60_000 };
const PAID = "Fees with money paid or discounted stay; cancel the payments or remove the discounts first";

// ------------------------------------------------------------- class fee

const findStructure = async (db: Db, schoolId: string, id: string) => {
  const structure = await db.feeStructure.findFirst({
    where: { id, schoolId },
    include: { feeType: { select: { nameEn: true, nameBn: true } }, schoolClass: { select: { name: true } }, academicYear: { select: { name: true } } },
  });
  if (!structure) throw new AppError("Class fee not found", httpStatus.NOT_FOUND);
  return structure;
};

const structureCheck = async (db: Db, feeStructureId: string) => {
  const [paid, unpaidFees] = await Promise.all([
    db.studentFee.count({ where: { feeStructureId, ...feeWithMoney } }),
    db.studentFee.count({ where: { feeStructureId, ...untouchedFee } }),
  ]);
  return deleteCheck([blocker("paidFees", paid, `${paid} fee(s) paid or discounted`)], { unpaidFees });
};

const feeStructureCheck = async (schoolId: string, id: string) => structureCheck(prisma, (await findStructure(prisma, schoolId, id)).id);

const deleteFeeStructure = async (auth: Auth, id: string, query: OptionalReasonQuery) => {
  const schoolId = auth.schoolId!;
  await prisma.$transaction(async (tx) => {
    const structure = await findStructure(tx, schoolId, id);
    const result = await structureCheck(tx, id);
    assertDeletable(result, PAID);
    await tx.studentFee.deleteMany({ where: { feeStructureId: id, ...untouchedFee } });
    await tx.feeStructure.delete({ where: { id } });
    await writeAuditLog(tx, auth, {
      action: "fee_structure.delete",
      entityType: "FeeStructure",
      entityId: id,
      summary: `${displayName(structure.feeType)} · ${structure.schoolClass.name} · ${structure.academicYear.name}`,
      reason: query.reason,
      snapshot: { structure, removed: result.willRemove },
    });
  }, TX_OPTIONS);
  return { id };
};

// ------------------------------------------------------------- fee type

const findFeeType = async (db: Db, schoolId: string, id: string) => {
  const feeType = await db.feeType.findFirst({ where: { id, schoolId } });
  if (!feeType) throw new AppError("Fee type not found", httpStatus.NOT_FOUND);
  return feeType;
};

const typeCheck = async (db: Db, feeTypeId: string) => {
  const [paid, unpaidFees, feeStructures] = await Promise.all([
    db.studentFee.count({ where: { feeTypeId, ...feeWithMoney } }),
    db.studentFee.count({ where: { feeTypeId, ...untouchedFee } }),
    db.feeStructure.count({ where: { feeTypeId } }),
  ]);
  return deleteCheck([blocker("paidFees", paid, `${paid} fee(s) paid or discounted`)], { feeStructures, unpaidFees });
};

const feeTypeCheck = async (schoolId: string, id: string) => typeCheck(prisma, (await findFeeType(prisma, schoolId, id)).id);

const deleteFeeType = async (auth: Auth, id: string, query: OptionalReasonQuery) => {
  const schoolId = auth.schoolId!;
  await prisma.$transaction(async (tx) => {
    const feeType = await findFeeType(tx, schoolId, id);
    const result = await typeCheck(tx, id);
    assertDeletable(result, PAID);
    await tx.studentFee.deleteMany({ where: { feeTypeId: id, ...untouchedFee } });
    await tx.feeStructure.deleteMany({ where: { feeTypeId: id } });
    await tx.feeType.delete({ where: { id } });
    await writeAuditLog(tx, auth, {
      action: "fee_type.delete",
      entityType: "FeeType",
      entityId: id,
      summary: displayName(feeType),
      reason: query.reason,
      snapshot: { feeType, removed: result.willRemove },
    });
  }, TX_OPTIONS);
  return { id };
};

// ------------------------------------------------------------- fund

const findFund = async (db: Db, schoolId: string, id: string) => {
  const fund = await db.fund.findFirst({ where: { id, schoolId } });
  if (!fund) throw new AppError("Fund not found", httpStatus.NOT_FOUND);
  return fund;
};

const fundCheck = async (db: Db, fundId: string) => {
  const [ledger, paid, feeTypes, feeStructures, unpaidFees] = await Promise.all([
    db.fundTransaction.count({ where: { fundId } }),
    db.studentFee.count({ where: { fundId, ...feeWithMoney } }),
    db.feeType.count({ where: { fundId } }),
    db.feeStructure.count({ where: { feeType: { fundId } } }),
    db.studentFee.count({ where: { fundId, ...untouchedFee } }),
  ]);
  return deleteCheck(
    [
      blocker("ledger", ledger, `${ledger} money entr(ies) in its ledger`),
      blocker("paidFees", paid, `${paid} fee(s) paid or discounted`),
    ],
    { feeTypes, feeStructures, unpaidFees },
  );
};

const fundDeleteCheck = async (schoolId: string, id: string) => fundCheck(prisma, (await findFund(prisma, schoolId, id)).id);

/* Only a fund money never went through: with its fee types, their class fees and unpaid fees. */
const deleteFund = async (auth: Auth, id: string, query: OptionalReasonQuery) => {
  const schoolId = auth.schoolId!;
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "Fund" WHERE "id" = ${id} AND "schoolId" = ${schoolId} FOR UPDATE`;
    const fund = await findFund(tx, schoolId, id);
    const result = await fundCheck(tx, id);
    assertDeletable(result, "A fund money went through stays: deactivate it instead");
    await tx.studentFee.deleteMany({ where: { fundId: id, ...untouchedFee } });
    await tx.feeStructure.deleteMany({ where: { feeType: { fundId: id } } });
    await tx.feeType.deleteMany({ where: { fundId: id } });
    await tx.fund.delete({ where: { id } });
    await writeAuditLog(tx, auth, {
      action: "fund.delete",
      entityType: "Fund",
      entityId: id,
      summary: displayName(fund),
      reason: query.reason,
      snapshot: { fund, removed: result.willRemove },
    });
  }, TX_OPTIONS);
  return { id };
};

// ------------------------------------------------------------- custom fee

/* A fee added for one student by mistake, while nothing was paid or discounted on it. */
const deleteCustomFee = async (auth: Auth, studentFeeId: string) => {
  const schoolId = auth.schoolId!;
  return prisma.$transaction(async (tx) => {
    await lockStudentFees(tx, [studentFeeId]);
    const fee = await tx.studentFee.findFirst({
      where: { id: studentFeeId, schoolId },
      include: {
        _count: { select: { allocations: true } },
        feeType: { select: { nameEn: true, nameBn: true } },
        student: { select: { admissionNo: true, nameEn: true, nameBn: true } },
      },
    });
    if (!fee) throw new AppError("Fee not found for this school", httpStatus.NOT_FOUND);
    if (fee.feeStructureId !== null) {
      throw new AppError("Only custom fees can be removed. Use a discount for class fees", httpStatus.BAD_REQUEST);
    }
    if (Number(fee.paidAmount) > 0 || fee._count.allocations > 0 || Number(fee.discountAmount) > 0) {
      throw new AppError("This fee has money paid or a discount, so it stays", httpStatus.BAD_REQUEST);
    }
    await tx.studentFee.delete({ where: { id: studentFeeId } });
    await writeAuditLog(tx, auth, {
      action: "student_fee.delete",
      entityType: "StudentFee",
      entityId: studentFeeId,
      summary: `${displayName(fee.feeType)} for ${displayName(fee.student)} (${fee.student.admissionNo}) · ${fee.amount.toFixed(2)}`,
      snapshot: fee,
    });
    return { id: studentFeeId };
  }, TX_OPTIONS);
};

export const FeeSetupDeleteService = {
  feeStructureCheck,
  deleteFeeStructure,
  feeTypeCheck,
  deleteFeeType,
  fundDeleteCheck,
  deleteFund,
  deleteCustomFee,
};
