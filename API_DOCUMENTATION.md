# Pet Care Booking System - API Documentation

## Project Overview
This is a Pet Care Booking backend system built with Node.js, Express, and MongoDB. It provides comprehensive APIs for managing pet care services and bookings.

---

## Database Schema Design

### Services Collection
Stores information about available pet care services.

**Fields:**
- `_id` (ObjectId): Unique identifier
- `name` (String, Required): Service name (min. 3 characters)
- `description` (String, Required): Service description (min. 10 characters)
- `price` (Number, Required): Service price (must be positive)
- `imageUrl` (String, Required): Service cover image URL
- `duration` (Number): Service duration in minutes (default: 60, min: 15)
- `available` (Boolean): Service availability status (default: true)
- `createdAt` (Date): Timestamp of creation
- `updatedAt` (Date): Timestamp of last update

**Example:**
```json
{
  "name": "Dog Bathing",
  "description": "Professional dog bathing and grooming service for all dog breeds",
  "price": 500,
  "imageUrl": "https://example.com/images/dog-bathing.jpg",
  "duration": 60,
  "available": true
}
```

---

### Bookings Collection
Stores information about service bookings.

**Fields:**
- `_id` (ObjectId): Unique identifier
- `customerName` (String, Required): Customer name (min. 3 characters)
- `phoneNumber` (String, Required): 10-digit phone number
- `petName` (String, Required): Name of the pet
- `appointmentDateTime` (Date, Required): Appointment date and time (must be in future)
- `serviceId` (ObjectId, Required): Reference to Services collection
- `status` (String): Booking status - "pending", "confirmed", "completed", "cancelled" (default: "pending")
- `notes` (String): Additional notes (max. 500 characters)
- `owner` (ObjectId, Required): Reference to User who made the booking
- `createdAt` (Date): Timestamp of creation
- `updatedAt` (Date): Timestamp of last update

**Example:**
```json
{
  "customerName": "John Doe",
  "phoneNumber": "0812345678",
  "petName": "Buddy",
  "appointmentDateTime": "2026-02-15T10:00:00Z",
  "serviceId": "507f1f77bcf86cd799439011",
  "status": "pending",
  "notes": "Please use hypoallergenic shampoo",
  "owner": "507f1f77bcf86cd799439012"
}
```

---

## API Endpoints

### Services Management

#### 1. Get All Services
**Request:**
```
GET /api/v1/services
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Services retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Dog Bathing",
      "description": "Professional dog bathing and grooming service",
      "price": 500,
      "imageUrl": "https://example.com/images/dog-bathing.jpg",
      "duration": 60,
      "available": true,
      "createdAt": "2026-02-01T10:00:00.000Z",
      "updatedAt": "2026-02-01T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

#### 2. Get Service by ID
**Request:**
```
GET /api/v1/services/:id
```

**Parameters:**
- `id` (path): Service ID (MongoDB ObjectId)

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Service retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Dog Bathing",
    "description": "Professional dog bathing and grooming service",
    "price": 500,
    "imageUrl": "https://example.com/images/dog-bathing.jpg",
    "duration": 60,
    "available": true,
    "createdAt": "2026-02-01T10:00:00.000Z",
    "updatedAt": "2026-02-01T10:00:00.000Z"
  }
}
```

---

#### 3. Create New Service
**Request:**
```
POST /api/v1/services
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Dog Nail Trimming",
  "description": "Safe and professional dog nail trimming service to keep your pet healthy",
  "price": 300,
  "imageUrl": "https://example.com/images/nail-trim.jpg",
  "duration": 30,
  "available": true
}
```

**Validation Rules:**
- `name`: Required, string, min. 3 characters
- `description`: Required, string, min. 10 characters
- `price`: Required, number, must be >= 0
- `imageUrl`: Required, valid URL format
- `duration`: Optional, number, min. 15 minutes
- `available`: Optional, boolean

**Response:** (201 Created)
```json
{
  "success": true,
  "message": "Service created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Dog Nail Trimming",
    "description": "Safe and professional dog nail trimming service to keep your pet healthy",
    "price": 300,
    "imageUrl": "https://example.com/images/nail-trim.jpg",
    "duration": 30,
    "available": true,
    "createdAt": "2026-02-01T11:00:00.000Z",
    "updatedAt": "2026-02-01T11:00:00.000Z"
  }
}
```

**Error Response:** (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Service name must be at least 3 characters",
    "Please provide a valid image URL"
  ]
}
```

---

#### 4. Update Service
**Request:**
```
PUT /api/v1/services/:id
Content-Type: application/json
```

**Parameters:**
- `id` (path): Service ID

**Request Body:**
```json
{
  "price": 350,
  "available": false
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Service updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Dog Nail Trimming",
    "description": "Safe and professional dog nail trimming service to keep your pet healthy",
    "price": 350,
    "imageUrl": "https://example.com/images/nail-trim.jpg",
    "duration": 30,
    "available": false,
    "createdAt": "2026-02-01T11:00:00.000Z",
    "updatedAt": "2026-02-01T12:30:00.000Z"
  }
}
```

---

#### 5. Delete Service
**Request:**
```
DELETE /api/v1/services/:id
```

**Parameters:**
- `id` (path): Service ID

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Service deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Dog Nail Trimming",
    "description": "Safe and professional dog nail trimming service to keep your pet healthy",
    "price": 350,
    "imageUrl": "https://example.com/images/nail-trim.jpg",
    "duration": 30,
    "available": false,
    "createdAt": "2026-02-01T11:00:00.000Z",
    "updatedAt": "2026-02-01T12:30:00.000Z"
  }
}
```

---

### Bookings Management

#### 1. Create New Booking
**Request:**
```
POST /api/v1/bookings
Content-Type: application/json
```

**Request Body:**
```json
{
  "customerName": "John Doe",
  "phoneNumber": "0812345678",
  "petName": "Buddy",
  "appointmentDateTime": "2026-02-15T10:00:00Z",
  "serviceId": "507f1f77bcf86cd799439011",
  "owner": "507f1f77bcf86cd799439099",
  "notes": "Please use hypoallergenic shampoo"
}
```

**Validation Rules:**
- `customerName`: Required, string, min. 3 characters
- `phoneNumber`: Required, exactly 10 digits
- `petName`: Required, string
- `appointmentDateTime`: Required, date in future
- `serviceId`: Required, valid MongoDB ObjectId
- `owner`: Required
- `notes`: Optional, max. 500 characters

**Response:** (201 Created)
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439100",
    "customerName": "John Doe",
    "phoneNumber": "0812345678",
    "petName": "Buddy",
    "appointmentDateTime": "2026-02-15T10:00:00.000Z",
    "serviceId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Dog Bathing",
      "price": 500,
      "duration": 60
    },
    "status": "pending",
    "notes": "Please use hypoallergenic shampoo",
    "owner": {
      "_id": "507f1f77bcf86cd799439099",
      "username": "johndoe"
    },
    "createdAt": "2026-02-01T15:00:00.000Z",
    "updatedAt": "2026-02-01T15:00:00.000Z"
  }
}
```

---

#### 2. Get User Bookings
**Request:**
```
GET /api/v1/bookings/user/:user
```

**Parameters:**
- `user` (path): User ID (MongoDB ObjectId)

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "User bookings retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439100",
      "customerName": "John Doe",
      "phoneNumber": "0812345678",
      "petName": "Buddy",
      "appointmentDateTime": "2026-02-15T10:00:00.000Z",
      "serviceId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Dog Bathing",
        "price": 500,
        "duration": 60,
        "description": "Professional dog bathing and grooming service",
        "imageUrl": "https://example.com/images/dog-bathing.jpg"
      },
      "status": "pending",
      "notes": "Please use hypoallergenic shampoo",
      "owner": {
        "_id": "507f1f77bcf86cd799439099",
        "username": "johndoe"
      },
      "createdAt": "2026-02-01T15:00:00.000Z",
      "updatedAt": "2026-02-01T15:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

#### 3. Get Booking by ID
**Request:**
```
GET /api/v1/bookings/:id
```

**Parameters:**
- `id` (path): Booking ID

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Booking retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439100",
    "customerName": "John Doe",
    "phoneNumber": "0812345678",
    "petName": "Buddy",
    "appointmentDateTime": "2026-02-15T10:00:00.000Z",
    "serviceId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Dog Bathing",
      "price": 500,
      "duration": 60,
      "description": "Professional dog bathing and grooming service",
      "imageUrl": "https://example.com/images/dog-bathing.jpg"
    },
    "status": "pending",
    "notes": "Please use hypoallergenic shampoo",
    "owner": {
      "_id": "507f1f77bcf86cd799439099",
      "username": "johndoe"
    },
    "createdAt": "2026-02-01T15:00:00.000Z",
    "updatedAt": "2026-02-01T15:00:00.000Z"
  }
}
```

---

#### 4. Get All Bookings (Admin)
**Request:**
```
GET /api/v1/bookings/all?status=pending&sortBy=createdAt
```

**Query Parameters:**
- `status` (optional): Filter by status - "pending", "confirmed", "completed", "cancelled"
- `serviceId` (optional): Filter by service ID
- `sortBy` (optional): Sort field (default: "createdAt")

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "All bookings retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439100",
      "customerName": "John Doe",
      "phoneNumber": "0812345678",
      "petName": "Buddy",
      "appointmentDateTime": "2026-02-15T10:00:00.000Z",
      "serviceId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Dog Bathing",
        "price": 500,
        "duration": 60
      },
      "status": "pending",
      "owner": {
        "_id": "507f1f77bcf86cd799439099",
        "username": "johndoe"
      }
    }
  ],
  "count": 1
}
```

---

#### 5. Update Booking
**Request:**
```
PUT /api/v1/bookings/:id
Content-Type: application/json
```

**Parameters:**
- `id` (path): Booking ID

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Confirmed appointment"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Booking updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439100",
    "customerName": "John Doe",
    "phoneNumber": "0812345678",
    "petName": "Buddy",
    "appointmentDateTime": "2026-02-15T10:00:00.000Z",
    "serviceId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Dog Bathing",
      "price": 500,
      "duration": 60
    },
    "status": "confirmed",
    "notes": "Confirmed appointment",
    "owner": {
      "_id": "507f1f77bcf86cd799439099",
      "username": "johndoe"
    },
    "createdAt": "2026-02-01T15:00:00.000Z",
    "updatedAt": "2026-02-02T09:30:00.000Z"
  }
}
```

---

#### 6. Cancel Booking
**Request:**
```
PUT /api/v1/bookings/:id/cancel
```

**Parameters:**
- `id` (path): Booking ID

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439100",
    "customerName": "John Doe",
    "phoneNumber": "0812345678",
    "petName": "Buddy",
    "appointmentDateTime": "2026-02-15T10:00:00.000Z",
    "serviceId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Dog Bathing",
      "price": 500
    },
    "status": "cancelled",
    "owner": {
      "_id": "507f1f77bcf86cd799439099",
      "username": "johndoe"
    }
  }
}
```

---

#### 7. Delete Booking
**Request:**
```
DELETE /api/v1/bookings/:id
```

**Parameters:**
- `id` (path): Booking ID

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Booking deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439100",
    "customerName": "John Doe",
    "phoneNumber": "0812345678",
    "petName": "Buddy",
    "appointmentDateTime": "2026-02-15T10:00:00.000Z",
    "serviceId": "507f1f77bcf86cd799439011",
    "status": "cancelled",
    "owner": "507f1f77bcf86cd799439099"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Field validation error message"]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Service/Booking not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

---

## Testing with curl/Postman

### Example: Create a Service
```bash
curl -X POST http://localhost:5000/api/v1/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dog Bathing",
    "description": "Professional dog bathing and grooming service for all breeds",
    "price": 500,
    "imageUrl": "https://example.com/images/dog-bathing.jpg",
    "duration": 60,
    "available": true
  }'
```

### Example: Create a Booking
```bash
curl -X POST http://localhost:5000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "phoneNumber": "0812345678",
    "petName": "Buddy",
    "appointmentDateTime": "2026-02-15T10:00:00Z",
    "serviceId": "507f1f77bcf86cd799439011",
    "owner": "507f1f77bcf86cd799439099",
    "notes": "Please use hypoallergenic shampoo"
  }'
```

---

## Environment Variables
Create a `.env` file with the following variables:
```
PORT=5000
BASE_URL=http://localhost:3000
DB_URL=mongodb://username:password@localhost:27017/petcaredb
```

---

## Project Structure
```
PetCareBooking/
├── index.js
├── package.json
├── config/
├── controllers/
│   ├── booking.controller.js
│   ├── pet.controller.js
│   └── service.controller.js
├── middlewares/
│   ├── authJWT.middleware.js
│   ├── file.middleware.js
│   └── validation.middleware.js
├── models/
│   ├── booking.js
│   ├── pet.js
│   ├── service.js
│   └── user.js
└── routers/
    ├── booking.router.js
    ├── service.router.js
    └── user.router.js
```

---

## Key Features
✅ RESTful API design  
✅ Data validation middleware  
✅ MongoDB relationships with references  
✅ Comprehensive error handling  
✅ Service CRUD operations  
✅ Booking management with status tracking  
✅ User-specific booking retrieval  
✅ Admin booking management  
✅ Service availability management  
✅ Appointment scheduling with validation  

---

## Created/Updated Files
1. **models/service.js** - Service schema with validation
2. **models/booking.js** - Enhanced Booking schema with validation
3. **controllers/service.controller.js** - Service CRUD operations
4. **controllers/booking.controller.js** - Booking management
5. **routers/service.router.js** - Service API endpoints
6. **routers/booking.router.js** - Booking API endpoints
7. **middlewares/validation.middleware.js** - Input validation
8. **index.js** - Updated with new routes

---
