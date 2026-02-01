# Pet Care Booking - Backend (หลังบ้าน)

API หลังบ้านสำหรับระบบจองบริการดูแลสัตว์เลี้ยง (Pet Care Booking)  
สร้างด้วย **Node.js**, **Express** และ **MongoDB**

---

## Tech Stack

- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB (Mongoose)  
- **Auth:** bcrypt, jsonwebtoken  
- **อื่นๆ:** CORS, dotenv, multer  

---

## โครงสร้างโปรเจกต์

```
PetCareBooking/
├── index.js              # จุดเข้า แก้ CORS, ต่อ MongoDB, ใช้ Router
├── package.json
├── .env                   # ตัวแปรสภาพ (ไม่ commit)
├── config/                # auth, firebase
├── controllers/           # logic การทำงาน
│   ├── booking.controller.js
│   ├── pet.controller.js
│   ├── service.controller.js
│   └── user.controller.js
├── middlewares/
│   ├── authJWT.middleware.js
│   ├── file.middleware.js
│   └── validation.middleware.js
├── models/                # Schema (MongoDB)
│   ├── booking.js
│   ├── pet.js
│   ├── service.js
│   └── user.js
├── routers/
│   ├── booking.router.js
│   ├── pet.router.js
│   ├── service.router.js
│   └── user.router.js
├── API_DOCUMENTATION.md    # รายละเอียด API
├── IMPLEMENTATION_SUMMARY.md
├── MONGODB_CRUD_GUIDE.md
└── PetCareBookingFrontend/   # โปรเจกต์ Frontend แยก
```

---

## การติดตั้งและรัน

### 1. ติดตั้ง Dependencies

```bash
cd PetCareBooking
npm install
```

### 2. ตั้งค่า Environment (.env)

สร้างไฟล์ `.env` ในโฟลเดอร์ PetCareBooking:

```
PORT=5000
BASE_URL=http://localhost:5173
DB_URL=mongodb://localhost:27017/petcaredb
SECRET=your_jwt_secret_string
```

- **PORT** – พอร์ตที่รัน API  
- **BASE_URL** – origin ของ Frontend (ใช้เช็ค CORS)  
- **DB_URL** – connection string ของ MongoDB  
- **SECRET** – ค่าลับสำหรับ JWT (login)  

### 3. รันเซิร์ฟเวอร์

```bash
npm start      # Production
npm run dev    # Development (nodemon)
```

เซิร์ฟเวอร์จะรันที่ `http://localhost:5000`

---

## API Endpoints สรุป

Base URL: `http://localhost:5000/api/v1`

### User (Auth)

| Method | Path | คำอธิบาย |
|--------|------|----------|
| POST | `/user/register` | สมัครสมาชิก (username, password) |
| POST | `/user/login` | เข้าสู่ระบบ (username, password) → ได้ id, username, accessToken |

### Services

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | `/services` | รายการบริการทั้งหมด |
| GET | `/services/:id` | ข้อมูลบริการตาม ID |
| POST | `/services` | สร้างบริการใหม่ (มี validation) |
| PUT | `/services/:id` | แก้ไขบริการ |
| DELETE | `/services/:id` | ลบบริการ |

### Bookings

| Method | Path | คำอธิบาย |
|--------|------|----------|
| POST | `/bookings` | สร้างการจอง (customerName, owner, phoneNumber, petName, appointmentDateTime, serviceId, notes) |
| GET | `/bookings/user/:user` | ประวัติการจองของ user |
| GET | `/bookings/:id` | ข้อมูลการจองตาม ID |
| GET | `/bookings/all` | การจองทั้งหมด (Admin) ?status= &sortBy= |
| PUT | `/bookings/:id` | แก้ไขการจอง (status, notes) |
| PUT | `/bookings/:id/cancel` | ยกเลิกการจอง |
| DELETE | `/bookings/:id` | ลบการจอง |

### Pets

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | `/pets` | รายการ pets (?owner=userId) |
| GET | `/pets/:id` | ข้อมูล pet ตาม ID |
| POST | `/pets/create` | สร้าง pet ใหม่ |
| PUT | `/pets/:id` | แก้ไข pet |
| DELETE | `/pets/:id` | ลบ pet |

---

## โครงสร้างข้อมูลหลัก (Collections)

### Services

- name, description, price, imageUrl, duration, available  
- Validation: name ≥ 3 ตัวอักษร, description ≥ 10, price ≥ 0, imageUrl เป็น URL  

### Bookings

- customerName, phoneNumber, petName, appointmentDateTime, serviceId, status, notes, owner  
- status: pending, confirmed, completed, cancelled  
- owner อ้างอิง User, serviceId อ้างอิง Service  

### User

- username, password (เก็บแบบ hash ด้วย bcrypt)  

---

## รูปแบบ Response

- **สำเร็จ:** `{ success: true, message: "...", data: {...} }`  
- **รายการ:** มี `count` ด้วย  
- **Error:** `{ success: false, message: "...", errors: [...] }` (กรณี validation)  

---

## เอกสารเพิ่มเติม

- **API_DOCUMENTATION.md** – รายละเอียด request/response ทุก endpoint  
- **IMPLEMENTATION_SUMMARY.md** – สรุปการ implement และสถานะโปรเจกต์  
- **MONGODB_CRUD_GUIDE.md** – ตัวอย่าง CRUD กับ MongoDB ในโปรเจกต์  

---

## การเชื่อมกับ Frontend

- Frontend อยู่ที่โฟลเดอร์ **PetCareBookingFrontend**  
- ตั้งค่า **BASE_URL** ใน `.env` ของ Backend ให้ตรงกับ origin ของ Frontend (เช่น `http://localhost:5173`) เพื่อให้ CORS ผ่าน  
- Frontend ตั้ง **VITE_API_URL=http://localhost:5000** เพื่อเรียก API  
