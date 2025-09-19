import { AuthUser } from './auth-types'

// Predefined accounts for each role
export const predefinedAccounts: Record<string, { user: AuthUser; password: string }> = {
  // Business Portal - Employee
  'employee@company.com': {
    user: {
      id: 'emp-001',
      fullName: 'Aymen Berbiche',
      email: 'employee@company.com',
      phone: '0666786789',
      idCard: '112234567',
      role: 'employee',
      portal: 'business',
      department: 'Informatique',
      position: 'Manager',
      avatar: '/professional-woman-avatar.png'
    },
    password: 'employee123'
  },

  // Business Portal - Admin
  'admin@company.com': {
    user: {
      id: 'admin-001',
      fullName: 'Sarah Johnson',
      email: 'admin@company.com',
      phone: '0554568635',
      idCard: '13434155475689',
      role: 'admin',
      portal: 'business',
      department: 'Administration',
      position: 'HR Manager',
      avatar: '/professional-woman-avatar.png'
    },
    password: 'admin123'
  },

  // Police Portal - Officer
  'officer@police.dz': {
    user: {
      id: 'pol-001',
      fullName: 'Officer Ahmed Benali',
      email: 'officer@police.dz',
      phone: '0661234567',
      idCard: 'POL001234',
      role: 'police_officer',
      portal: 'police',
      badgeNumber: 'POL-001',
      rank: 'Lieutenant',
      station: 'Commissariat Central, Alger',
      avatar: '/professional-woman-avatar.png'
    },
    password: 'police123'
  },

  // Police Portal - Senior Officer
  'senior@police.dz': {
    user: {
      id: 'pol-002',
      fullName: 'Officer Fatima Mansouri',
      email: 'senior@police.dz',
      phone: '0551234567',
      idCard: 'POL002345',
      role: 'police_officer',
      portal: 'police',
      badgeNumber: 'POL-002',
      rank: 'Capitaine',
      station: 'Commissariat Central, Alger',
      avatar: '/professional-woman-avatar.png'
    },
    password: 'senior123'
  },

  // Wilaya Portal - Administrator
  'admin@wilaya.dz': {
    user: {
      id: 'wil-001',
      fullName: 'Admin Mustapha',
      email: 'admin@wilaya.dz',
      phone: '0661111111',
      idCard: 'ADM001234',
      role: 'admin',
      portal: 'wilaya',
      department: 'Administration',
      position: 'Wilaya Administrator',
      avatar: '/professional-woman-avatar.png'
    },
    password: 'wilaya123'
  }
}

// Helper function to get account by email
export const getAccountByEmail = (email: string) => {
  return predefinedAccounts[email] || null
}

// Helper function to get all accounts for a specific role
export const getAccountsByRole = (role: 'employee' | 'police_officer' | 'admin') => {
  return Object.values(predefinedAccounts).filter(account => account.user.role === role)
}

// Helper function to get all accounts for a specific portal
export const getAccountsByPortal = (portal: 'business' | 'police' | 'wilaya') => {
  return Object.values(predefinedAccounts).filter(account => account.user.portal === portal)
}
