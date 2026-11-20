import express from "express";
import validateRequest from "../../errorHandler/validateRequest";
import authenticate from "../../middlewares/auth";
import authorize, { superAdminOnly } from "../../middlewares/authorize";
import { reasonQuery } from "../../shared/deleteSchemas";
import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";

const router = express.Router();

router.use(authenticate("SCHOOL"));

router.post(
  "/",
  authorize("payment:create"),
  validateRequest({ body: PaymentValidation.recordPayment }),
  PaymentController.recordPayment,
);

router.get(
  "/",
  authorize("payment:view"),
  validateRequest({ query: PaymentValidation.listPaymentsQuery }),
  PaymentController.listPayments,
);

// the collection screen: everything the student still owes
router.get(
  "/student/:studentId/payable",
  authorize("payment:create"),
  validateRequest({
    params: PaymentValidation.studentIdParams,
    query: PaymentValidation.payableQuery,
  }),
  PaymentController.getPayableFees,
);

router.get(
  "/student/:studentId",
  authorize("payment:view"),
  validateRequest({
    params: PaymentValidation.studentIdParams,
    query: PaymentValidation.listPaymentsQuery,
  }),
  PaymentController.listStudentPayments,
);

// what a printed money receipt shows
router.get(
  "/:paymentId/receipt",
  authorize("payment:view"),
  validateRequest({ params: PaymentValidation.paymentIdParams }),
  PaymentController.getReceipt,
);

router.get(
  "/:paymentId",
  authorize("payment:view"),
  validateRequest({ params: PaymentValidation.paymentIdParams }),
  PaymentController.getPaymentById,
);

// erases a payment for good (the fees go back to unpaid, the money leaves the funds), with a
// reason (?reason=) and a copy in the activity log: the school super admin only
router.delete(
  "/:paymentId",
  authorize("payment:cancel"),
  superAdminOnly,
  validateRequest({ params: PaymentValidation.paymentIdParams, query: reasonQuery }),
  PaymentController.deletePayment,
);

export const paymentRoutes = router;