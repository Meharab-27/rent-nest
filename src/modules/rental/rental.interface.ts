export interface ICreateRentalRequestPayload {
  propertyId: string;
  message?: string;
}

export interface IUpdateRentalRequestPayload {
  status?: "PENDING" | "APPROVED" | "REJECTED";
}
