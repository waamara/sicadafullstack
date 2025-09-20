# 🚗 Sicada Parking Management System

A comprehensive full-stack parking management system built with Next.js, Express.js, and SQLite. The system provides three distinct portals for different user roles: Business, Police, and Wilaya (Administrative) management.

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [System Architecture](#system-architecture)
- [Features & Functionalities](#features--functionalities)
- [User Portals](#user-portals)
- [API Documentation](#api-documentation)
- [Demo Accounts](#demo-accounts)
- [Development](#development)
- [Contributing](#contributing)

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **pnpm** package manager
- **Git**

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd sicadafullstack
```

### Step 2: Install Frontend Dependencies

```bash
npm install
# or
pnpm install
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### Step 4: Environment Setup

Create environment files:

```bash
# Copy environment examples
cp env.local.example .env.local
cp backend/env.example backend/.env
```

Edit the environment files with your configuration:

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend (backend/.env):**
```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
DB_PATH=./database/sicada.db
```

### Step 5: Initialize Database

```bash
cd backend
npm run init-db
cd ..
```

## 🏃‍♂️ Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

The backend API will be available at: `http://localhost:3001`

### 2. Start the Frontend Development Server

```bash
# In a new terminal window
npm run dev
```

The frontend will be available at: `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to `http://localhost:3000`

## 🏗️ System Architecture

```
sicadafullstack/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── dashboard-layout.tsx
│   ├── login-form.tsx
│   └── ...
├── lib/                   # Utility libraries
│   ├── api.ts            # API service
│   ├── auth-context.tsx  # Authentication context
│   └── types.ts          # TypeScript types
├── backend/              # Express.js backend
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & validation
│   ├── config/          # Database configuration
│   └── scripts/         # Database initialization
└── public/              # Static assets
```

## ✨ Features & Functionalities

### 🔐 Authentication System
- **Multi-role Authentication** with JWT tokens
- **Role-based Access Control** (RBAC)
- **Secure Password Hashing** with bcrypt
- **Session Management** with automatic token refresh

### 📊 Dashboard & Analytics
- **Real-time Dashboard** with key metrics
- **User Activity Tracking** and logging
- **Performance Analytics** and reporting
- **Responsive Design** for all screen sizes

### 🎫 Ticket Management
- **Ticket Creation** and submission
- **Status Tracking** (Pending, Approved, Rejected, Resolved)
- **Priority Levels** (Low, Medium, High, Urgent)
- **Ticket Assignment** and resolution workflow

### 👥 User Management
- **User Registration** and profile management
- **Role Assignment** (Employee, Police Officer, Admin)
- **User Activity Monitoring**
- **Account Status Management**

### 🅿️ Parking Management
- **Parking Request System** for citizens
- **Location Management** with GPS coordinates
- **Space Allocation** and availability tracking
- **Request Approval Workflow**

### 🚔 Police Portal Features
- **Complaint Management** system
- **Violation Tracking** and reporting
- **Officer Management** and assignments
- **Case Resolution** workflow

### 🏛️ Administrative Features
- **System-wide Oversight** and management
- **Report Generation** and analytics
- **Business Registration** management
- **Policy Configuration**

## 🌐 User Portals

### 🏢 Business Portal
**Purpose**: Business administration and user management
- **User Management**: Create and manage employee accounts
- **Ticket Management**: Submit and track internal tickets
- **Dashboard**: View business metrics and activities
- **Settings**: Configure business-specific settings

### 🚔 Police Portal
**Purpose**: Law enforcement and public safety
- **Complaints Management**: Handle citizen complaints
- **Violations Tracking**: Record and manage violations
- **Officer Management**: Manage police personnel
- **Reports**: Generate enforcement reports

### 🏛️ Wilaya Portal (Administrative)
**Purpose**: Governmental oversight and management
- **System Administration**: Manage all system users
- **Parking Management**: Oversee parking requests and locations
- **Business Oversight**: Monitor and manage registered businesses
- **Reports & Analytics**: Generate comprehensive reports

## 🔑 Demo Accounts

| Role | Email | Password | Portal | Description |
|------|-------|----------|---------|-------------|
| **Admin** | `admin@wilaya.dz` | `wilaya123` | Wilaya | System administrator |
| **Employee** | `employee@company.com` | `employee123` | Business | Business employee |
| **Business Admin** | `admin@company.com` | `admin123` | Business | Business administrator |
| **Police Officer** | `officer@police.dz` | `police123` | Police | Police officer |
| **Senior Officer** | `senior@police.dz` | `senior123` | Police | Senior police officer |

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### User Management
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Ticket Management
- `GET /api/tickets` - Get all tickets
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket

### Parking Management
- `GET /api/parking-requests` - Get parking requests
- `POST /api/parking-requests` - Submit parking request
- `PUT /api/parking-requests/:id` - Update request status

## 🛠️ Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

**Backend:**
```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run init-db      # Initialize database
```

### Database Schema

The system uses SQLite with the following main tables:
- **Users**: User accounts and profiles
- **Tickets**: Support and service tickets
- **ParkingRequests**: Citizen parking requests
- **ParkingLocations**: Available parking locations
- **Activities**: System activity logs

### Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Radix UI Components
- Lucide React Icons

**Backend:**
- Express.js
- SQLite3
- JWT Authentication
- bcryptjs (Password hashing)
- Express Validator
- Multer (File uploads)

## 🚀 Production Deployment

### Environment Variables

Ensure all environment variables are properly configured:

**Frontend:**
- `NEXT_PUBLIC_API_URL`: Backend API URL

**Backend:**
- `PORT`: Server port
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: Token expiration time
- `DB_PATH`: Database file path

### Build for Production

```bash
# Build frontend
npm run build

# Start backend in production
cd backend
npm start

# Start frontend in production
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

---

**Sicada Team** - Building the future of parking management 🚗✨
