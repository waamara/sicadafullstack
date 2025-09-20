export interface AuthUser {
  id: string
  fullName: string
  email: string
  phone: string
  idCard: string
  role: 'employee' | 'police_officer' | 'admin'
  portal: 'business' | 'police' | 'wilaya'
  department?: string
  position?: string
  address?: string
  badgeNumber?: string
  rank?: string
  station?: string
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
  role: 'employee' | 'police_officer' | 'admin'
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  clearError: () => void
}
