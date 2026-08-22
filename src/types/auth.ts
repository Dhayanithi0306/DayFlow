export type UserRole = "employee" | "hr" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
