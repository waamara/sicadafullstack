export interface Ticket {
  id: string
  title: string
  type: 'parking' | 'equipment' | 'access' | 'complaint' | 'violation' | 'other'
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'resolved'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  updatedAt: string
  user: {
    name: string
    email: string
    phone: string
    idCard: string
    department?: string
    position?: string
    address?: string
  }
  description?: string
  images?: string[]
  location?: {
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  assignedOfficer?: string
  resolution?: string
  portal: 'business' | 'police' | 'wilaya'
}

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  idCard: string
  department?: string
  position?: string
  address?: string
  status: 'active' | 'inactive'
  role: 'employee' | 'police_officer' | 'admin' | 'citizen'
  portal: 'business' | 'police' | 'wilaya' | 'citizen'
  badgeNumber?: string // For police officers
  rank?: string // For police officers
  station?: string // For police officers
  createdAt: string
  lastLogin?: string
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  pendingTickets: number
  resolvedTickets: number
  totalTickets: number
  recentActivity: Activity[]
}

export interface Activity {
  id: string
  type: 'ticket_created' | 'ticket_approved' | 'ticket_rejected' | 'ticket_assigned' | 'ticket_resolved' | 'user_registered' | 'complaint_received' | 'violation_reported'
  description: string
  timestamp: string
  user?: string
  portal?: 'business' | 'police' | 'wilaya'
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PortalConfig {
  id: 'business' | 'police' | 'wilaya'
  name: string
  description: string
  icon: string
  color: string
  allowedRoles: string[]
  ticketTypes: string[]
}

export interface ParkingRequest {
  id: string
  title: string
  description: string
  location: {
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  requester: {
    name: string
    email: string
    phone: string
    idCard: string
    organization?: string
  }
  status: 'pending' | 'approved' | 'rejected' | 'in_review'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  requestedSpaces: number
  estimatedCost?: number
  documents?: string[]
  createdAt: string
  updatedAt: string
  reviewedBy?: string
  reviewNotes?: string
}

export interface ParkingLocation {
  id: string
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  totalSpaces: number
  availableSpaces: number
  hourlyRate: number
  dailyRate: number
  monthlyRate: number
  features: string[]
  status: 'active' | 'inactive' | 'maintenance' | 'full'
  openingHours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  contact: {
    phone: string
    email: string
  }
  manager: {
    name: string
    phone: string
    email: string
  }
  createdAt: string
  updatedAt: string
}
