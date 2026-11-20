import type { z } from "zod";
import { PaymentValidation } from "./payment.validation";

export type RecordPaymentPayload = z.infer<typeof PaymentValidation.recordPayment>;
export type ListPaymentsQuery = z.infer<typeof PaymentValidation.listPaymentsQuery>;