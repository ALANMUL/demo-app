import httpStatus from "http-status";
import { prisma } from "../../../../lib/prisma";
import { AppError } from "../../errorHandler/AppError";
import { writeAuditLog } from "../../shared/auditLog";
import type { ReasonPayload } from "../../shared/deleteSchemas";
import { displayName } from "../../shared/names";
import { isUniqueViolation } from "../../utils/prismaError";
import { getFundBalance, lockFund } from "./fund.ledger";

/*
 * Voiding money moved by hand (the super admin only, see the routes): a deposit, or a
 * transfer between funds. Nothing is erased: an opposite entry on the original's date puts
 * the money back, and the unique reversesId means each entry is voided once. Refused when the
 * fund no longer holds the money (it was spent or moved on): its balance would go negative.
 */

type Auth = NonNullable<Express.Request["auth"]>;

const alreadyVoided = (e: unknown, what: string): never => {
  if (isUniqueViolation(e)) throw new AppError(`This ${what} has already been voided`, httpStatus.CONFLICT);
  throw e;
};

const voidDeposit = async (auth: Auth, transactionId: string, data: ReasonPayload) => {
  const schoolId = auth.schoolId!;
  try {
    return await prisma.$transaction(async (tx) => {
      const original = await tx.fundTransaction.findFirst({
        where: { id: transactionId, schoolId, type: "INCOME", source: "MANUAL_DEPOSIT" },
        include: { fund: { select: { nameEn: true, nameBn: true } }, reversedBy: { select: { id: true } } },
      });
      if (!original) throw new AppError("Deposit not found", httpStatus.NOT_FOUND);
      // before the balance: a voided deposit's money is already gone, which would read as "spent"
      if (original.reversedBy) throw new AppError("This deposit has already been voided", httpStatus.CONFLICT);

      await lockFund(tx, schoolId, original.fundId);
      const balance = await getFundBalance(tx, schoolId, original.fundId);
      if (balance.lt(original.amount)) {
        throw new AppError(
          `Cannot void: the fund holds ${balance.toFixed(2)} but ${original.amount.toFixed(2)} must be taken back`,
          httpStatus.BAD_REQUEST,
        );
      }

      const reversal = await tx.fundTransaction.create({
        data: {
          schoolId,
          fundId: original.fundId,
          type: "EXPENSE",
          source: "ADJUSTMENT",
          amount: original.amount,
          description: `Void of deposit: ${data.reason}`,
          transactionDate: original.transactionDate,
          reversesId: original.id,
          createdBy: auth.userId,
        },
      });
      await writeAuditLog(tx, auth, {
        action: "fund.deposit.void",
        entityType: "FundTransaction",
        entityId: original.id,
        summary: `Deposit to ${displayName(original.fund)} · ${original.amount.toFixed(2)}`,
        reason: data.reason,
        snapshot: original,
      });
      return { reversal, balance: balance.minus(original.amount).toFixed(2) };
    });
  } catch (e) {
    return alreadyVoided(e, "deposit");
  }
};

/* The money goes back from the destination fund to the source: two entries, one per side. */
const voidTransfer = async (auth: Auth, transferId: string, data: ReasonPayload) => {
  const schoolId = auth.schoolId!;
  try {
    return await prisma.$transaction(async (tx) => {
      const legs = await tx.fundTransaction.findMany({
        where: { schoolId, transferId, source: "TRANSFER" },
        include: { fund: { select: { nameEn: true, nameBn: true } }, reversedBy: { select: { id: true } } },
      });
      const out = legs.find((l) => l.type === "TRANSFER_OUT");
      const incoming = legs.find((l) => l.type === "TRANSFER_IN");
      if (!out || !incoming) throw new AppError("Transfer not found", httpStatus.NOT_FOUND);
      if (out.reversedBy || incoming.reversedBy) throw new AppError("This transfer has already been voided", httpStatus.CONFLICT);

      // lock both funds in id order, so two reversals at once can't deadlock
      for (const fundId of [out.fundId, incoming.fundId].sort()) await lockFund(tx, schoolId, fundId);
      const balance = await getFundBalance(tx, schoolId, incoming.fundId);
      if (balance.lt(incoming.amount)) {
        throw new AppError(
          `Cannot void: "${displayName(incoming.fund)}" holds ${balance.toFixed(2)} but ${incoming.amount.toFixed(2)} must go back`,
          httpStatus.BAD_REQUEST,
        );
      }

      const common = {
        schoolId,
        source: "ADJUSTMENT" as const,
        amount: out.amount,
        description: `Void of transfer: ${data.reason}`,
        transactionDate: out.transactionDate,
        createdBy: auth.userId,
      };
      await tx.fundTransaction.create({ data: { ...common, fundId: out.fundId, type: "TRANSFER_IN", reversesId: out.id } });
      await tx.fundTransaction.create({ data: { ...common, fundId: incoming.fundId, type: "TRANSFER_OUT", reversesId: incoming.id } });

      await writeAuditLog(tx, auth, {
        action: "fund.transfer.void",
        entityType: "FundTransfer",
        entityId: transferId,
        summary: `Transfer ${displayName(out.fund)} → ${displayName(incoming.fund)} · ${out.amount.toFixed(2)}`,
        reason: data.reason,
        snapshot: legs,
      });
      return { transferId };
    });
  } catch (e) {
    return alreadyVoided(e, "transfer");
  }
};

export const FundReversalService = { voidDeposit, voidTransfer };
