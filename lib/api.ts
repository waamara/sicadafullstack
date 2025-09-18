import { Ticket, User, DashboardStats, ApiResponse } from './types'
import { mockTickets, mockUsers, mockDashboardStats } from './mock-data'

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export class ApiService {
  // Dashboard API
  static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    await delay(800) // Simulate network delay
    return {
      data: mockDashboardStats,
      success: true,
      message: 'Dashboard stats retrieved successfully'
    }
  }

  // Tickets API
  static async getTickets(): Promise<ApiResponse<Ticket[]>> {
    await delay(600)
    return {
      data: mockTickets,
      success: true,
      message: 'Tickets retrieved successfully'
    }
  }

  static async getTicket(id: string): Promise<ApiResponse<Ticket | null>> {
    await delay(400)
    const ticket = mockTickets.find(t => t.id === id)
    return {
      data: ticket || null,
      success: !!ticket,
      message: ticket ? 'Ticket retrieved successfully' : 'Ticket not found'
    }
  }

  static async updateTicketStatus(id: string, status: 'approved' | 'rejected'): Promise<ApiResponse<Ticket>> {
    await delay(500)
    const ticketIndex = mockTickets.findIndex(t => t.id === id)
    
    if (ticketIndex === -1) {
      return {
        data: {} as Ticket,
        success: false,
        message: 'Ticket not found'
      }
    }

    mockTickets[ticketIndex].status = status
    mockTickets[ticketIndex].updatedAt = new Date().toISOString()

    return {
      data: mockTickets[ticketIndex],
      success: true,
      message: `Ticket ${status} successfully`
    }
  }

  // Users API
  static async getUsers(): Promise<ApiResponse<User[]>> {
    await delay(600)
    return {
      data: mockUsers,
      success: true,
      message: 'Users retrieved successfully'
    }
  }

  static async getUser(id: string): Promise<ApiResponse<User | null>> {
    await delay(400)
    const user = mockUsers.find(u => u.id === id)
    return {
      data: user || null,
      success: !!user,
      message: user ? 'User retrieved successfully' : 'User not found'
    }
  }

  static async updateUserStatus(id: string, status: 'active' | 'inactive'): Promise<ApiResponse<User>> {
    await delay(500)
    const userIndex = mockUsers.findIndex(u => u.id === id)
    
    if (userIndex === -1) {
      return {
        data: {} as User,
        success: false,
        message: 'User not found'
      }
    }

    mockUsers[userIndex].status = status

    return {
      data: mockUsers[userIndex],
      success: true,
      message: `User status updated to ${status} successfully`
    }
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> {
    await delay(700)
    const newUser: User = {
      ...userData,
      id: (mockUsers.length + 1).toString(),
      createdAt: new Date().toISOString()
    }
    
    mockUsers.push(newUser)
    
    return {
      data: newUser,
      success: true,
      message: 'User created successfully'
    }
  }

  static async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    await delay(500)
    const userIndex = mockUsers.findIndex(u => u.id === id)
    
    if (userIndex === -1) {
      return {
        data: false,
        success: false,
        message: 'User not found'
      }
    }

    mockUsers.splice(userIndex, 1)
    
    return {
      data: true,
      success: true,
      message: 'User deleted successfully'
    }
  }
}
