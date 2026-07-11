
export interface RegisteredUserPayload{
    name:string;
    email: string;
    password: string;
    role?: "TENANT" | "LANDLORD" | "ADMIN";
}
