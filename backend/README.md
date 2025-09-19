# Sicada Backend API

A comprehensive Express.js backend API for the Sicada Parking Management System with SQLite database.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Multi-Portal Support**: Business, Police, and Wilaya portals with different permissions
- **User Management**: Complete CRUD operations for users with different roles
- **Ticket System**: Support for various ticket types (parking, equipment, access, complaints, violations)
- **Parking Management**: Request and location management for parking facilities
- **Dashboard Analytics**: Comprehensive statistics and reporting
- **Activity Logging**: Audit trail for all system activities
- **Security**: Rate limiting, CORS, helmet security headers
- **Validation**: Input validation and sanitization

## Tech Stack

- **Node.js** with Express.js
- **SQLite** database with sqlite3
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **helmet** for security headers
- **cors** for cross-origin requests
- **express-rate-limit** for rate limiting

## Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=24h
   DB_PATH=./database/sicada.db
   FRONTEND_URL=http://localhost:3000
   ```

3. **Initialize Database**:
   ```bash
   npm run init-db
   ```

4. **Seed Sample Data** (optional):
   ```bash
   node scripts/seed-data.js
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /register` - Register new user (admin only)
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `POST /logout` - Logout
- `GET /verify` - Verify token

### Users (`/api/users`)
- `GET /` - Get all users (admin only)
- `GET /portal/:portal` - Get users by portal
- `GET /:id` - Get user by ID
- `POST /` - Create new user (admin only)
- `PUT /:id` - Update user (admin only)
- `PATCH /:id/status` - Update user status (admin only)
- `DELETE /:id` - Delete user (admin only)
- `GET /stats/overview` - Get user statistics

### Tickets (`/api/tickets`)
- `GET /` - Get all tickets
- `GET /portal/:portal` - Get tickets by portal
- `GET /:id` - Get ticket by ID
- `POST /` - Create new ticket
- `PUT /:id` - Update ticket
- `PATCH /:id/status` - Update ticket status
- `PATCH /:id/assign` - Assign ticket to officer
- `DELETE /:id` - Delete ticket
- `GET /stats/overview` - Get ticket statistics

### Parking Requests (`/api/parking-requests`)
- `GET /` - Get all parking requests (wilaya only)
- `GET /:id` - Get parking request by ID
- `POST /` - Create new parking request
- `PUT /:id` - Update parking request
- `PATCH /:id/status` - Update request status (admin only)
- `DELETE /:id` - Delete parking request (admin only)
- `GET /stats/overview` - Get request statistics

### Parking Locations (`/api/parking-locations`)
- `GET /` - Get all parking locations (wilaya only)
- `GET /:id` - Get parking location by ID
- `POST /` - Create new parking location (admin only)
- `PUT /:id` - Update parking location
- `PATCH /:id/spaces` - Update available spaces
- `PATCH /:id/status` - Update location status
- `DELETE /:id` - Delete parking location (admin only)
- `GET /stats/overview` - Get location statistics

### Dashboard (`/api/dashboard`)
- `GET /stats` - Get dashboard statistics
- `GET /wilaya` - Get wilaya-specific dashboard data
- `GET /business` - Get business portal dashboard data
- `GET /police` - Get police portal dashboard data

## User Roles & Portals

### Roles
- **admin**: Full system access
- **employee**: Business portal access
- **police_officer**: Police portal access
- **citizen**: Limited access

### Portals
- **business**: Employee management and internal requests
- **police**: Citizen complaints and parking violations
- **wilaya**: Parking management and administrative oversight

## Database Schema

### Users Table
- User information with role-based access
- Support for different portals and departments
- Police officer specific fields (badge number, rank, station)

### Tickets Table
- Support for multiple ticket types
- Status tracking and assignment
- Location and image support

### Parking Requests Table
- New parking location requests
- Requester information and documents
- Review and approval workflow

### Parking Locations Table
- Complete parking facility information
- Pricing and availability tracking
- Manager and contact details

### Activities Table
- Audit trail for all system activities
- User and ticket associations

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions by role and portal
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Controlled cross-origin access
- **Security Headers**: Helmet.js for security headers
- **Password Hashing**: bcryptjs for secure password storage

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Initialize database schema
- `node scripts/seed-data.js` - Seed sample data

### File Structure
```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── validation.js       # Input validation middleware
├── models/
│   ├── User.js             # User model
│   ├── Ticket.js           # Ticket model
│   ├── ParkingRequest.js   # Parking request model
│   ├── ParkingLocation.js  # Parking location model
│   └── Activity.js         # Activity model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── users.js            # User management routes
│   ├── tickets.js          # Ticket routes
│   ├── parking-requests.js # Parking request routes
│   ├── parking-locations.js# Parking location routes
│   └── dashboard.js        # Dashboard routes
├── scripts/
│   ├── init-db.js          # Database initialization
│   └── seed-data.js        # Sample data seeding
├── database/               # SQLite database files
├── uploads/                # File upload directory
├── server.js               # Main server file
└── package.json
```

## Default Accounts

After seeding the database, you can use these default accounts:

- **Admin**: `admin@sicada.dz` / `admin123`
- **Business User**: `aymen.berbiche@company.com` / `password123`
- **Police Officer**: `ahmed.police@police.dz` / `police123`

## API Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {}, // Response data (if any)
  "errors": [] // Validation errors (if any)
}
```

## Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

## Contributing

1. Follow the existing code structure
2. Add proper validation and error handling
3. Include JSDoc comments for new functions
4. Test all endpoints thoroughly
5. Update documentation as needed

## License

MIT License - see LICENSE file for details

