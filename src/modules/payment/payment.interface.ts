export interface ICreatePaymentPayload {
  rentalRequestId: string;
  amount: number;
  method: "STRIPE" | "SSLCOMMERZ";
  provider: "STRIPE" | "SSLCOMMERZ";
}

export interface IConfirmPaymentPayload {
  paymentId: string;
  transactionId?: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
}
