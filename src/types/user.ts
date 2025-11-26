export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details?: string;
  ipAddress?: string;
  timestamp: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}