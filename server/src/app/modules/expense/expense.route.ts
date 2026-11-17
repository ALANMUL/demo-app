import express from "express";
import validateRequest from "../../errorHandler/validateRequest";
import authenticate from "../../middlewares/auth";
import authorize, { superAdminOnly } from "../../middlewares/authorize";
import { ExpenseController } from "./expense.controller";
import { ExpenseValidation } from "./expense.validation";

const router = express.Router();

router.use(authenticate("SCHOOL"));

router.post(
  "/",
  authorize("expense:create"),
  validateRequest({ body: ExpenseValidation.createExpense }),
  ExpenseController.createExpense,
);

router.get(
  "/",
  authorize("expense:view"),
  validateRequest({ query: ExpenseValidation.listExpensesQuery }),
  ExpenseController.listExpenses,
);

router.get("/categories", authorize("expense:view"), ExpenseController.getCategories);

router.post(
  "/:expenseId/void",
  // a money reversal: the school super admin only
  authorize("expense:void"),
  superAdminOnly,
  validateRequest({
    params: ExpenseValidation.expenseIdParams,
    body: ExpenseValidation.voidExpense,
  }),
  ExpenseController.voidExpense,
);

export const expenseRoutes = router;