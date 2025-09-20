import { Ticket, User, DashboardStats, ApiResponse, ParkingRequest, ParkingLocation } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export class ApiService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }
  // Dashboard API
  static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request('/dashboard/stats')
  }

  // Tickets API
  static async getTickets(): Promise<ApiResponse<Ticket[]>> {
    return this.request('/tickets')
  }

  static async getTicketsByPortal(portal: string): Promise<ApiResponse<Ticket[]>> {
    return this.request(`/tickets/portal/${portal}`)
  }

  static async getTicket(id: string): Promise<ApiResponse<Ticket | null>> {
    return this.request(`/tickets/${id}`)
  }

  static async createTicket(ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Ticket>> {
    return this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    })
  }

  static async updateTicket(id: string, updates: Partial<Ticket>): Promise<ApiResponse<Ticket>> {
    return this.request(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  static async updateTicketStatus(id: string, status: 'approved' | 'rejected' | 'in_progress' | 'resolved'): Promise<ApiResponse<Ticket>> {
    return this.request(`/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  static async updateTicketResolution(id: string, status: 'resolved', resolution: string): Promise<ApiResponse<Ticket>> {
    return this.request(`/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, resolution }),
    })
  }

  static async approveUserRequest(id: string): Promise<ApiResponse<{ ticket: Ticket; user: User }>> {
    return this.request(`/tickets/${id}/approve-user`, {
      method: 'POST',
    })
  }

  static async deleteTicket(id: string): Promise<ApiResponse<boolean>> {
    return this.request(`/tickets/${id}`, {
      method: 'DELETE',
    })
  }

  // Users API
  static async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request('/users')
  }

  static async getUser(id: string): Promise<ApiResponse<User | null>> {
    return this.request(`/users/${id}`)
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  static async updateUserStatus(id: string, status: 'active' | 'inactive'): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  static async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  // Parking Requests API
  static async getParkingRequests(): Promise<ApiResponse<ParkingRequest[]>> {
    return this.request('/parking-requests')
  }

  static async getParkingRequest(id: string): Promise<ApiResponse<ParkingRequest | null>> {
    return this.request(`/parking-requests/${id}`)
  }

  static async createParkingRequest(requestData: Omit<ParkingRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ParkingRequest>> {
    return this.request('/parking-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })
  }

  static async updateParkingRequest(id: string, updates: Partial<ParkingRequest>): Promise<ApiResponse<ParkingRequest>> {
    return this.request(`/parking-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  static async updateParkingRequestStatus(id: string, status: 'approved' | 'rejected' | 'in_review', reviewNotes?: string): Promise<ApiResponse<ParkingRequest>> {
    return this.request(`/parking-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reviewNotes }),
    })
  }

  static async deleteParkingRequest(id: string): Promise<ApiResponse<boolean>> {
    return this.request(`/parking-requests/${id}`, {
      method: 'DELETE',
    })
  }

  // Parking Locations API
  static async getParkingLocations(): Promise<ApiResponse<ParkingLocation[]>> {
    return this.request('/parking-locations')
  }

  static async getParkingLocation(id: string): Promise<ApiResponse<ParkingLocation | null>> {
    return this.request(`/parking-locations/${id}`)
  }

  static async createParkingLocation(locationData: Omit<ParkingLocation, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ParkingLocation>> {
    return this.request('/parking-locations', {
      method: 'POST',
      body: JSON.stringify(locationData),
    })
  }

  static async updateParkingLocation(id: string, updates: Partial<ParkingLocation>): Promise<ApiResponse<ParkingLocation>> {
    return this.request(`/parking-locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  static async updateParkingLocationStatus(id: string, status: 'active' | 'inactive' | 'maintenance' | 'full'): Promise<ApiResponse<ParkingLocation>> {
    return this.request(`/parking-locations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  static async deleteParkingLocation(id: string): Promise<ApiResponse<boolean>> {
    return this.request(`/parking-locations/${id}`, {
      method: 'DELETE',
    })
  }

  // Authentication API
  static async login(credentials: { email: string; password: string; role: string }): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    if (response.success && response.data.token && typeof window !== 'undefined') {
      localStorage.setItem('authToken', response.data.token)
    }

    return response
  }

  static async logout(): Promise<ApiResponse<boolean>> {
    const response = await this.request<boolean>('/auth/logout', {
      method: 'POST',
    })

    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
    }
    return response
  }

  static async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/auth/profile')
  }
}
