# MongoDB CRUD Operations - Pet Care Booking System

## Overview
CRUD stands for **Create, Read, Update, Delete** — the four fundamental database operations. This guide demonstrates how MongoDB CRUD operations work in your Pet Care Booking application.

---

## 1. CREATE Operations

### 1.1 Creating a Single Document

**MongoDB Method:**
```javascript
db.collection.insertOne({ document })
```

**In Your Project - Creating a Service:**
```javascript
const service = await ServiceModel.create({
  name: "Dog Bathing",
  description: "Professional dog bathing and grooming service",
  price: 500,
  imageUrl: "https://example.com/dog-bathing.jpg",
  duration: 60,
  available: true
});
```

**API Endpoint:**
```
POST /api/v1/services
Content-Type: application/json

{
  "name": "Dog Bathing",
  "description": "Professional dog bathing and grooming service",
  "price": 500,
  "imageUrl": "https://example.com/dog-bathing.jpg",
  "duration": 60,
  "available": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Dog Bathing",
    "description": "Professional dog bathing and grooming service",
    "price": 500,
    "imageUrl": "https://example.com/dog-bathing.jpg",
    "duration": 60,
    "available": true,
    "createdAt": "2026-02-01T10:00:00.000Z",
    "updatedAt": "2026-02-01T10:00:00.000Z"
  }
}
```

---

### 1.2 Creating a Booking

**Code:**
```javascript
const booking = await BookingModel.create({
  customerName: "John Doe",
  phoneNumber: "0812345678",
  petName: "Buddy",
  appointmentDateTime: new Date("2026-02-15T10:00:00Z"),
  serviceId: "507f1f77bcf86cd799439011",
  owner: "507f1f77bcf86cd799439099",
  status: "pending",
  notes: "Please use hypoallergenic shampoo"
});
```

**API Endpoint:**
```
POST /api/v1/bookings
Content-Type: application/json

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

---

### 1.3 Creating a Pet

**Code:**
```javascript
const pet = await PetModel.create({
  name: "Buddy",
  age: 3,
  breed: "Golden Retriever",
  image: "https://example.com/buddy.jpg",
  owner: "507f1f77bcf86cd799439099"
});
```

**API Endpoint:**
```
POST /api/v1/pets/create
Content-Type: application/json

{
  "name": "Buddy",
  "age": 3,
  "breed": "Golden Retriever",
  "image": "https://example.com/buddy.jpg",
  "owner": "507f1f77bcf86cd799439099"
}
```

---

## 2. READ Operations

### 2.1 Reading All Documents

**MongoDB Method:**
```javascript
db.collection.find({})
```

**In Your Project - Get All Services:**
```javascript
const services = await ServiceModel.find().select("-__v");
```

**API Endpoint:**
```
GET /api/v1/services
```

**Response:**
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
      "imageUrl": "https://example.com/dog-bathing.jpg",
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

### 2.2 Reading with Filters

**MongoDB Method:**
```javascript
db.collection.find({ field: value })
```

**In Your Project - Get Pending Bookings:**
```javascript
const pendingBookings = await BookingModel.find({ status: "pending" })
  .populate("serviceId", "name price")
  .populate("owner", "-password");
```

**API Endpoint with Query Parameters:**
```
GET /api/v1/bookings/all?status=pending
```

---

### 2.3 Reading a Single Document by ID

**MongoDB Method:**
```javascript
db.collection.findById(id)
```

**In Your Project - Get Service by ID:**
```javascript
const service = await ServiceModel.findById("507f1f77bcf86cd799439011");
```

**API Endpoint:**
```
GET /api/v1/services/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "message": "Service retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Dog Bathing",
    "price": 500
  }
}
```

---

### 2.4 Reading with Sorting

**MongoDB Method:**
```javascript
db.collection.find({}).sort({ field: -1 })  // -1 for descending
```

**In Your Project - Get Bookings Sorted by Date:**
```javascript
const bookings = await BookingModel.find({ owner: userId })
  .sort({ createdAt: -1 })
  .populate("serviceId");
```

**API Endpoint:**
```
GET /api/v1/bookings/user/507f1f77bcf86cd799439099
```

---

### 2.5 Reading with Pagination

**MongoDB Method:**
```javascript
db.collection.find({}).skip(0).limit(10)
```

**In Your Project - Get Pets with Pagination:**
```javascript
const page = 1;
const limit = 10;
const pets = await PetModel.find()
  .skip((page - 1) * limit)
  .limit(limit)
  .sort({ createdAt: -1 });
```

---

## 3. UPDATE Operations

### 3.1 Updating a Single Document

**MongoDB Method:**
```javascript
db.collection.findByIdAndUpdate(id, { $set: updates }, { new: true })
```

**In Your Project - Update Service Price:**
```javascript
const updated = await ServiceModel.findByIdAndUpdate(
  "507f1f77bcf86cd799439011",
  { $set: { price: 600 } },
  { new: true, runValidators: true }
);
```

**API Endpoint:**
```
PUT /api/v1/services/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "price": 600
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Dog Bathing",
    "price": 600
  }
}
```

---

### 3.2 Updating a Booking Status

**Code:**
```javascript
const booking = await BookingModel.findByIdAndUpdate(
  "507f1f77bcf86cd799439100",
  { $set: { status: "confirmed" } },
  { new: true }
).populate("serviceId");
```

**API Endpoint:**
```
PUT /api/v1/bookings/507f1f77bcf86cd799439100
Content-Type: application/json

{
  "status": "confirmed"
}
```

---

### 3.3 Updating Multiple Fields

**Code:**
```javascript
const pet = await PetModel.findByIdAndUpdate(
  petId,
  { $set: { age: 4, breed: "Labrador" } },
  { new: true }
);
```

**API Endpoint:**
```
PUT /api/v1/pets/507f1f77bcf86cd799439050
Content-Type: application/json

{
  "age": 4,
  "breed": "Labrador"
}
```

---

### 3.4 Partial Update (Only Provided Fields)

**Code:**
```javascript
const updates = { age: 5 };  // Only update age
const pet = await PetModel.findByIdAndUpdate(
  petId,
  { $set: updates },
  { new: true }
);
```

---

## 4. DELETE Operations

### 4.1 Deleting a Single Document

**MongoDB Method:**
```javascript
db.collection.findByIdAndDelete(id)
```

**In Your Project - Delete Service:**
```javascript
const deleted = await ServiceModel.findByIdAndDelete("507f1f77bcf86cd799439011");
```

**API Endpoint:**
```
DELETE /api/v1/services/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "message": "Service deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Dog Bathing"
  }
}
```

---

### 4.2 Deleting a Booking

**Code:**
```javascript
const deleted = await BookingModel.findByIdAndDelete("507f1f77bcf86cd799439100");
```

**API Endpoint:**
```
DELETE /api/v1/bookings/507f1f77bcf86cd799439100
```

---

### 4.3 Deleting a Pet

**Code:**
```javascript
const deleted = await PetModel.findByIdAndDelete(petId);
```

**API Endpoint:**
```
DELETE /api/v1/pets/507f1f77bcf86cd799439050
```

---

### 4.4 Soft Delete (Mark as Inactive Instead)

**Code:**
```javascript
// Instead of hard delete, mark as deleted
const booking = await BookingModel.findByIdAndUpdate(
  bookingId,
  { $set: { status: "cancelled" } },
  { new: true }
);
```

---

## 5. Advanced CRUD Operations

### 5.1 Populating References (Joins)

**Code:**
```javascript
// Get booking with service and owner details
const booking = await BookingModel.findById(bookingId)
  .populate("serviceId", "name price duration")
  .populate("owner", "-password");
```

**Response:**
```json
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
  "owner": {
    "_id": "507f1f77bcf86cd799439099",
    "username": "johndoe"
  },
  "status": "pending"
}
```

---

### 5.2 Aggregation Pipeline (Complex Queries)

**Code - Get booking count by service:**
```javascript
const stats = await BookingModel.aggregate([
  { $match: { status: "confirmed" } },
  { $group: { _id: "$serviceId", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
```

---

### 5.3 Bulk Operations

**Code - Create multiple services:**
```javascript
const services = [
  { name: "Dog Bathing", description: "...", price: 500, imageUrl: "...", },
  { name: "Dog Grooming", description: "...", price: 700, imageUrl: "...", }
];
const result = await ServiceModel.insertMany(services);
```

---

### 5.4 Conditional Update

**Code - Update all pending bookings to confirmed:**
```javascript
const result = await BookingModel.updateMany(
  { status: "pending" },
  { $set: { status: "confirmed" } }
);
console.log(`Updated ${result.modifiedCount} bookings`);
```

---

## 6. Error Handling in CRUD

### 6.1 Try-Catch Pattern

```javascript
try {
  const service = await ServiceModel.findById(id);
  
  if (!service) {
    return res.status(404).json({ 
      success: false, 
      message: "Service not found" 
    });
  }
  
  res.status(200).json({ success: true, data: service });
} catch (error) {
  res.status(500).json({ 
    success: false, 
    message: "Error retrieving service",
    error: error.message 
  });
}
```

---

### 6.2 Validation Error Handling

```javascript
try {
  const service = await ServiceModel.create(data);
  res.status(201).json({ success: true, data: service });
} catch (error) {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: messages
    });
  }
  res.status(500).json({ success: false, message: error.message });
}
```

---

## 7. Complete CRUD Example - Services

### Create
```javascript
POST /api/v1/services
{
  "name": "Cat Grooming",
  "description": "Professional cat grooming and nail trimming service",
  "price": 400,
  "imageUrl": "https://example.com/cat-grooming.jpg"
}
```

### Read (All)
```javascript
GET /api/v1/services
```

### Read (Single)
```javascript
GET /api/v1/services/507f1f77bcf86cd799439011
```

### Update
```javascript
PUT /api/v1/services/507f1f77bcf86cd799439011
{
  "price": 450,
  "available": false
}
```

### Delete
```javascript
DELETE /api/v1/services/507f1f77bcf86cd799439011
```

---

## 8. MongoDB Operators Reference

| Operator | Purpose | Example |
|----------|---------|---------|
| `$set` | Update specific fields | `{ $set: { price: 500 } }` |
| `$inc` | Increment a number | `{ $inc: { views: 1 } }` |
| `$push` | Add to array | `{ $push: { tags: "new" } }` |
| `$pull` | Remove from array | `{ $pull: { tags: "old" } }` |
| `$gt` | Greater than | `{ age: { $gt: 5 } }` |
| `$lt` | Less than | `{ age: { $lt: 10 } }` |
| `$in` | Match any value | `{ status: { $in: ["pending", "confirmed"] } }` |

---

## 9. Best Practices

✅ **Always validate data before creating/updating**
✅ **Use try-catch for error handling**
✅ **Populate references when needed**
✅ **Use indexes for frequently queried fields**
✅ **Return meaningful error messages**
✅ **Check if document exists before updating**
✅ **Use `{ new: true }` to get updated document**
✅ **Run validators on update operations**

---

## 10. Data Models Summary

### Services Collection
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  imageUrl: String (required),
  duration: Number (default: 60),
  available: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection
```javascript
{
  customerName: String (required),
  phoneNumber: String (required),
  petName: String (required),
  appointmentDateTime: Date (required),
  serviceId: ObjectId (ref: Service),
  status: String (enum: pending/confirmed/completed/cancelled),
  notes: String,
  owner: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Pets Collection
```javascript
{
  name: String (required),
  age: Number (required),
  breed: String (required),
  image: String,
  owner: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

