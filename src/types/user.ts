export interface User {
  id: string;
  username: string;
  email?: string;
  role_name: string;
  role_id: number;
  permission_level?: string;
  active_until?: string | Date | null;
  created_at?: string | Date;
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

// Helper function to check if user is active
export function isUserActive(user: User): boolean {
  if (!user.active_until) return true; // Null means indefinitely active
  const activeUntilDate = new Date(user.active_until);
  return activeUntilDate > new Date();
}