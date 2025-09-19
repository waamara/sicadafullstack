# External API for User Requests

This document describes how external platforms can send user access requests to the Sicada system.

## User Request Endpoint

**POST** `/api/tickets/user-request`

### Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "fullName": "[Full Name]",
  "email": "[Email]",
  "phone": "[Phone]",
  "idCard": "[ID Card]",
  "department": "[Department]",
  "position": "[Position]"
}
```

### Example Request
```json
{
  "fullName": "John Doe",
  "email": "john.doe@company.com",
  "phone": "0661234567",
  "idCard": "123456789",
  "department": "IT",
  "position": "Developer"
}
```

### Response
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "id": "ticket-uuid",
    "title": "User Access Request - John Doe",
    "type": "user_request",
    "status": "pending",
    "priority": "medium",
    "portal": "business",
    "createdAt": "2025-01-19T10:00:00.000Z"
  }
}
```

## How It Works

1. **External Platform** sends a POST request to `/api/tickets/user-request` with user request data
2. **System** creates a ticket with type `user_request` and status `pending`
3. **Business Admin** reviews the request in the Support page
4. **Admin** can either:
   - **Approve**: Creates a new user account with admin role
   - **Reject**: Marks the request as rejected

## Required Fields

- `fullName`: User's full name
- `email`: User's email address (must be unique)
- `phone`: User's phone number
- `idCard`: User's ID card number (must be unique)
- `department`: User's department
- `position`: User's position/title

## Notes

- All approved users will have `admin` role in the `business` portal
- Default password for new users is `password123`
- User requests are stored as tickets and can be tracked through the system
- Only business admins can approve user requests
