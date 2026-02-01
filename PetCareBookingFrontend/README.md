# Pet Care Booking - Frontend

เว็บแอป React สำหรับระบบจองบริการดูแลสัตว์เลี้ยง (Pet Care Booking)  
ออกแบบแบบ **Mobile-First** และใช้ **Reusable Components** (Atomic Design)

## Tech Stack

- **React** (Vite)
- **React Router** – หน้าแรก, จองบริการ, ประวัติการจอง, เข้าสู่ระบบ, สมัครสมาชิก
- **Tailwind CSS + DaisyUI** – Styling แบบ Mobile-First
- **Axios** – เรียก API กับ Backend

## โครงสร้าง Component (Atomic)

- **Atoms**: `Button`, `Input`, `Badge`
- **Molecules**: `Card`, `ServiceCard`, `BookingCard`
- **Organisms**: `Navbar`, `BookingForm`

## การติดตั้งและรัน

1. ติดตั้ง dependencies:
   ```bash
   cd PetCareBookingFrontend
   npm install
   ```

2. สร้างไฟล์ `.env` (คัดลอกจาก `.env.example`):
   ```
   VITE_API_URL=http://localhost:5000
   ```

3. รัน Backend ก่อน (ที่โฟลเดอร์ PetCareBooking):
   ```bash
   npm run dev
   ```
   Backend ต้องรันที่ `http://localhost:5000` และตั้งค่า CORS ให้รองรับ origin ของ Frontend (เช่น `http://localhost:5173` ใน `.env` ของ Backend ใช้ `BASE_URL=http://localhost:5173`)

4. รัน Frontend:
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ที่ `http://localhost:5173`

## หน้าที่มี

| หน้า | path | คำอธิบาย |
|------|------|----------|
| หน้าแรก | `/` | แสดงรายการบริการ และลิงก์ไปจอง/ประวัติ |
| จองบริการ | `/booking` | เลือกบริการ + กรอกแบบฟอร์มจอง (ต้องล็อกอิน) |
| ประวัติการจอง | `/history` | แสดงการจองของ user ปัจจุบัน และยกเลิกได้ |
| เข้าสู่ระบบ | `/login` | Login ด้วย username / password |
| สมัครสมาชิก | `/register` | สมัคร username / password |

## API ที่ใช้ (ตาม Backend PetCareBooking)

- `GET /api/v1/services` – รายการบริการ
- `GET /api/v1/services/:id` – ข้อมูลบริการตาม ID
- `POST /api/v1/bookings` – สร้างการจอง (owner, phoneNumber, petName, appointmentDateTime, serviceId, notes)
- `GET /api/v1/bookings/user/:user` – ประวัติการจองของ user
- `PUT /api/v1/bookings/:id/cancel` – ยกเลิกการจอง
- `POST /api/v1/user/register` – สมัครสมาชิก
- `POST /api/v1/user/login` – เข้าสู่ระบบ

## สร้าง Production Build

```bash
npm run build
```
ผลลัพธ์อยู่ในโฟลเดอร์ `dist/`
