import { Ticket, User, DashboardStats, ApiResponse, ParkingRequest, ParkingLocation } from './types'
import { mockTickets, mockUsers, mockDashboardStats, mockParkingRequests, mockParkingLocations } from './mock-data'

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

  static async updateTicketStatus(id: string, status: 'approved' | 'rejected' | 'in_progress' | 'resolved'): Promise<ApiResponse<Ticket>> {
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

  static async updateTicketResolution(id: string, status: 'resolved', resolution: string): Promise<ApiResponse<Ticket>> {
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
    mockTickets[ticketIndex].resolution = resolution
    mockTickets[ticketIndex].updatedAt = new Date().toISOString()

    return {
      data: mockTickets[ticketIndex],
      success: true,
      message: 'Ticket resolved successfully'
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

  // Parking Requests API
  static async getParkingRequests(): Promise<ApiResponse<ParkingRequest[]>> {
    await delay(600)
    return {
      data: mockParkingRequests,
      success: true,
      message: 'Parking requests retrieved successfully'
    }
  }

  static async updateParkingRequestStatus(id: string, status: 'approved' | 'rejected' | 'in_review', reviewNotes?: string): Promise<ApiResponse<ParkingRequest>> {
    await delay(500)
    const requestIndex = mockParkingRequests.findIndex(r => r.id === id)
    
    if (requestIndex === -1) {
      return {
        data: {} as ParkingRequest,
        success: false,
        message: 'Parking request not found'
      }
    }

    mockParkingRequests[requestIndex].status = status
    mockParkingRequests[requestIndex].updatedAt = new Date().toISOString()
    if (reviewNotes) {
      mockParkingRequests[requestIndex].reviewNotes = reviewNotes
    }

    return {
      data: mockParkingRequests[requestIndex],
      success: true,
      message: `Parking request ${status} successfully`
    }
  }

  // Parking Locations API
  static async getParkingLocations(): Promise<ApiResponse<ParkingLocation[]>> {
    await delay(600)
    return {
      data: mockParkingLocations,
      success: true,
      message: 'Parking locations retrieved successfully'
    }
  }

  static async updateParkingLocation(id: string, updates: Partial<ParkingLocation>): Promise<ApiResponse<ParkingLocation>> {
    await delay(500)
    const locationIndex = mockParkingLocations.findIndex(l => l.id === id)
    
    if (locationIndex === -1) {
      return {
        data: {} as ParkingLocation,
        success: false,
        message: 'Parking location not found'
      }
    }

    mockParkingLocations[locationIndex] = {
      ...mockParkingLocations[locationIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    return {
      data: mockParkingLocations[locationIndex],
      success: true,
      message: 'Parking location updated successfully'
    }
  }
}
