# Frontend-Backend Integration Guide

This guide will help you connect your existing Next.js frontend to the new Express.js backend.

## Quick Start

### 1. Setup Backend

```bash
cd backend
npm install
node scripts/setup.js
npm run dev
```

The backend will be running on `http://localhost:3001`

### 2. Update Frontend API Configuration

Update your `lib/api.ts` file to point to the real backend instead of mock data:

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ApiService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Dashboard API
  static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request('/dashboard/stats');
  }

  // Tickets API
  static async getTickets(): Promise<ApiResponse<Ticket[]>> {
    return this.request('/tickets');
  }

  static async getTicket(id: string): Promise<ApiResponse<Ticket | null>> {
    return this.request(`/tickets/${id}`);
  }

  static async updateTicketStatus(id: string, status: 'approved' | 'rejected' | 'in_progress' | 'resolved'): Promise<ApiResponse<Ticket>> {
    return this.request(`/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Users API
  static async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request('/users');
  }

  static async getUser(id: string): Promise<ApiResponse<User | null>> {
    return this.request(`/users/${id}`);
  }

  static async updateUserStatus(id: string, status: 'active' | 'inactive'): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Parking Requests API
  static async getParkingRequests(): Promise<ApiResponse<ParkingRequest[]>> {
    return this.request('/parking-requests');
  }

  static async updateParkingRequestStatus(id: string, status: 'approved' | 'rejected' | 'in_review', reviewNotes?: string): Promise<ApiResponse<ParkingRequest>> {
    return this.request(`/parking-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reviewNotes }),
    });
  }

  // Parking Locations API
  static async getParkingLocations(): Promise<ApiResponse<ParkingLocation[]>> {
    return this.request('/parking-locations');
  }

  static async updateParkingLocation(id: string, updates: Partial<ParkingLocation>): Promise<ApiResponse<ParkingLocation>> {
    return this.request(`/parking-locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Authentication API
  static async login(credentials: { email: string; password: string; role: string }): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response;
  }

  static async logout(): Promise<ApiResponse<boolean>> {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });

    localStorage.removeItem('authToken');
    return response;
  }

  static async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/auth/profile');
  }
}
```

### 3. Update Authentication Context

Update your `lib/auth-context.tsx` to use the real API:

```typescript
// lib/auth-context.tsx
import { ApiService } from './api';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await ApiService.getProfile();
          if (response.success) {
            setUser(response.data);
            setIsAuthenticated(true);
          }
        } catch (error) {
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await ApiService.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
    }
  };

  // ... rest of your context implementation
};
```

### 4. Environment Variables

Create a `.env.local` file in your frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 5. Update Login Form

Update your login form to use the real authentication:

```typescript
// components/login-form.tsx
const handleSubmit = async (data: LoginCredentials) => {
  const success = await login(data);
  if (success) {
    // Redirect based on user role/portal
    const user = await ApiService.getProfile();
    if (user.success) {
      const portal = user.data.portal;
      router.push(`/${portal}`);
    }
  } else {
    // Handle login error
    setError('Invalid credentials');
  }
};
```

## API Endpoints Mapping

| Frontend Function | Backend Endpoint | Method |
|------------------|------------------|---------|
| `getDashboardStats()` | `/api/dashboard/stats` | GET |
| `getTickets()` | `/api/tickets` | GET |
| `getTicket(id)` | `/api/tickets/:id` | GET |
| `updateTicketStatus()` | `/api/tickets/:id/status` | PATCH |
| `getUsers()` | `/api/users` | GET |
| `getUser(id)` | `/api/users/:id` | GET |
| `updateUserStatus()` | `/api/users/:id/status` | PATCH |
| `getParkingRequests()` | `/api/parking-requests` | GET |
| `updateParkingRequestStatus()` | `/api/parking-requests/:id/status` | PATCH |
| `getParkingLocations()` | `/api/parking-locations` | GET |
| `updateParkingLocation()` | `/api/parking-locations/:id` | PUT |

## Authentication Flow

1. User submits login form with email, password, and role
2. Frontend sends POST request to `/api/auth/login`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. All subsequent requests include token in Authorization header
6. Backend validates token and returns user data

## Error Handling

The backend returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // For validation errors
}
```

Handle errors in your frontend:

```typescript
try {
  const response = await ApiService.getTickets();
  if (response.success) {
    setTickets(response.data);
  } else {
    setError(response.message);
  }
} catch (error) {
  setError('Network error occurred');
}
```

## Testing the Integration

1. Start both frontend and backend servers
2. Navigate to the login page
3. Use one of the default accounts:
   - Admin: `admin@sicada.dz` / `admin123`
   - Business: `aymen.berbiche@company.com` / `password123`
   - Police: `ahmed.police@police.dz` / `police123`
4. Verify that data loads from the backend instead of mock data

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the backend CORS configuration includes your frontend URL
2. **Authentication Errors**: Check that the JWT token is being sent in the Authorization header
3. **404 Errors**: Verify that the API endpoints match between frontend and backend
4. **Database Errors**: Ensure the database is initialized and seeded with sample data

### Debug Tips

1. Check browser network tab for API requests
2. Check backend console for error logs
3. Verify environment variables are set correctly
4. Test API endpoints directly with tools like Postman or curl

## Next Steps

1. Implement real-time updates using WebSockets (optional)
2. Add file upload functionality for ticket images
3. Implement email notifications
4. Add more comprehensive error handling
5. Add API response caching
6. Implement pagination for large datasets

## Support

If you encounter any issues during integration, check:
1. Backend logs for server-side errors
2. Browser console for client-side errors
3. Network tab for HTTP request/response details
4. Database file exists and is accessible

