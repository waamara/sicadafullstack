import { Ticket, User, DashboardStats, Activity } from './types'

export const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Demande de place au parking',
    type: 'parking',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    user: {
      name: 'Aymen Berbiche',
      email: 'aymen.berbiche@company.com',
      phone: '0666786789',
      idCard: '112234567',
      department: 'Informatique',
      position: 'Manager'
    },
    description: 'Request for parking space assignment'
  },
  {
    id: '2',
    title: 'Demande de place au parking',
    type: 'parking',
    status: 'pending',
    priority: 'low',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
    user: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '0554568635',
      idCard: '13434155475689',
      department: 'Marketing',
      position: 'Supervisor'
    },
    description: 'Need parking space for new employee'
  },
  {
    id: '3',
    title: 'Demande de place au parking',
    type: 'parking',
    status: 'approved',
    priority: 'high',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T16:45:00Z',
    user: {
      name: 'Mohamed Ali',
      email: 'mohamed.ali@company.com',
      phone: '0771234567',
      idCard: '12251143677789',
      department: 'Finance',
      position: 'Analyst'
    },
    description: 'Urgent parking request for client meeting'
  },
  {
    id: '4',
    title: 'Demande de place au parking',
    type: 'parking',
    status: 'rejected',
    priority: 'low',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-12T15:30:00Z',
    user: {
      name: 'Fatima Zahra',
      email: 'fatima.zahra@company.com',
      phone: '0667890123',
      idCard: '14567890123456',
      department: 'HR',
      position: 'Coordinator'
    },
    description: 'Parking space request - no available spots'
  },
  {
    id: '5',
    title: 'Demande de place au parking',
    type: 'parking',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-11T13:45:00Z',
    updatedAt: '2024-01-11T13:45:00Z',
    user: {
      name: 'Ahmed Benali',
      email: 'ahmed.benali@company.com',
      phone: '0555678901',
      idCard: '15678901234567',
      department: 'Operations',
      position: 'Manager'
    },
    description: 'Request for permanent parking assignment'
  }
]

export const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'Aymen Berbiche',
    email: 'aymen.berbiche@company.com',
    phone: '0666786789',
    idCard: '112234567',
    department: 'Informatique',
    position: 'Manager',
    status: 'active',
    createdAt: '2023-06-15T08:00:00Z',
    lastLogin: '2024-01-15T09:30:00Z'
  },
  {
    id: '2',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '0554568635',
    idCard: '13434155475689',
    department: 'Marketing',
    position: 'Supervisor',
    status: 'active',
    createdAt: '2023-08-20T10:15:00Z',
    lastLogin: '2024-01-14T16:20:00Z'
  },
  {
    id: '3',
    fullName: 'Mohamed Ali',
    email: 'mohamed.ali@company.com',
    phone: '0771234567',
    idCard: '12251143677789',
    department: 'Finance',
    position: 'Analyst',
    status: 'active',
    createdAt: '2023-09-10T14:30:00Z',
    lastLogin: '2024-01-15T08:45:00Z'
  },
  {
    id: '4',
    fullName: 'Fatima Zahra',
    email: 'fatima.zahra@company.com',
    phone: '0667890123',
    idCard: '14567890123456',
    department: 'HR',
    position: 'Coordinator',
    status: 'active',
    createdAt: '2023-07-05T11:20:00Z',
    lastLogin: '2024-01-13T12:10:00Z'
  },
  {
    id: '5',
    fullName: 'Ahmed Benali',
    email: 'ahmed.benali@company.com',
    phone: '0555678901',
    idCard: '15678901234567',
    department: 'Operations',
    position: 'Manager',
    status: 'active',
    createdAt: '2023-05-12T09:45:00Z',
    lastLogin: '2024-01-15T07:30:00Z'
  },
  {
    id: '6',
    fullName: 'Layla Mansouri',
    email: 'layla.mansouri@company.com',
    phone: '0662345678',
    idCard: '16789012345678',
    department: 'Sales',
    position: 'Representative',
    status: 'inactive',
    createdAt: '2023-10-15T13:00:00Z',
    lastLogin: '2024-01-10T17:45:00Z'
  }
]

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'ticket_created',
    description: 'New parking request from Aymen Berbiche',
    timestamp: '2024-01-15T10:30:00Z',
    user: 'Aymen Berbiche'
  },
  {
    id: '2',
    type: 'ticket_approved',
    description: 'Parking request approved for Mohamed Ali',
    timestamp: '2024-01-13T16:45:00Z',
    user: 'Mohamed Ali'
  },
  {
    id: '3',
    type: 'user_registered',
    description: 'New user registered: Ahmed Benali',
    timestamp: '2024-01-11T13:45:00Z',
    user: 'Ahmed Benali'
  },
  {
    id: '4',
    type: 'ticket_rejected',
    description: 'Parking request rejected for Fatima Zahra',
    timestamp: '2024-01-12T15:30:00Z',
    user: 'Fatima Zahra'
  },
  {
    id: '5',
    type: 'ticket_created',
    description: 'New parking request from Sarah Johnson',
    timestamp: '2024-01-14T14:20:00Z',
    user: 'Sarah Johnson'
  }
]

export const mockDashboardStats: DashboardStats = {
  totalUsers: mockUsers.length,
  activeUsers: mockUsers.filter(user => user.status === 'active').length,
  pendingTickets: mockTickets.filter(ticket => ticket.status === 'pending').length,
  resolvedTickets: mockTickets.filter(ticket => ticket.status === 'approved' || ticket.status === 'rejected').length,
  totalTickets: mockTickets.length,
  recentActivity: mockActivities.slice(0, 5)
}
