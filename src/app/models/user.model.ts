export interface User {
  id?: number;
  wallet: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  description?: string;
}

export interface RegisterUserRequest {
  wallet: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  description?: string;
  role?: string;
}
