import { useState, useEffect } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Card from "../molecules/Card";

/**
 * BookingForm - Reusable form for creating a booking
 * Backend: customerName, phoneNumber, petName, appointmentDateTime, serviceId, owner, notes
 * customerName = username ของ user ที่ล็อกอิน (match กับ backend แบบเดิม)
 */
export default function BookingForm({
  selectedService,
  currentUser,
  onSubmit,
  loading = false,
  error: externalError,
}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [petName, setPetName] = useState("");
  const [appointmentDateTime, setAppointmentDateTime] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedService) {
      setErrors((e) => ({ ...e, service: null }));
    }
  }, [selectedService]);

  const validate = () => {
    const next = {};
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      next.phoneNumber = "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก";
    }
    if (!petName.trim()) {
      next.petName = "กรุณากรอกชื่อสัตว์เลี้ยง";
    }
    const dt = new Date(appointmentDateTime);
    if (!appointmentDateTime || isNaN(dt.getTime())) {
      next.appointmentDateTime = "กรุณาเลือกวันและเวลา";
    } else if (dt <= new Date()) {
      next.appointmentDateTime = "วันเวลาต้องเป็นในอนาคต";
    }
    if (!currentUser?.id) {
      next.user = "กรุณาเข้าสู่ระบบก่อนจอง";
    }
    if (!selectedService?._id) {
      next.service = "กรุณาเลือกบริการ";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      customerName: currentUser.username,
      owner: currentUser.id,
      phoneNumber: phoneNumber.trim(),
      petName: petName.trim(),
      appointmentDateTime: new Date(appointmentDateTime).toISOString(),
      serviceId: selectedService._id,
      notes: notes.trim() || undefined,
    });
  };

  const minDateTime = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold">แบบฟอร์มจองบริการ</h2>
        {selectedService && (
          <p className="text-sm text-base-content/70">
            บริการ: <strong>{selectedService.name}</strong> ({selectedService.price}฿)
          </p>
        )}
        {externalError && (
          <div className="alert alert-error text-sm">{externalError}</div>
        )}
        {errors.user && <div className="alert alert-warning text-sm">{errors.user}</div>}
        {errors.service && !selectedService && (
          <div className="alert alert-warning text-sm">{errors.service}</div>
        )}

        <Input
          label="เบอร์โทรศัพท์ (10 หลัก)"
          type="tel"
          placeholder="0812345678"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          error={errors.phoneNumber}
          maxLength={10}
        />
        <Input
          label="ชื่อสัตว์เลี้ยง"
          type="text"
          placeholder="เช่น บัดดี้"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          error={errors.petName}
        />
        <Input
          label="วันและเวลานัด"
          type="datetime-local"
          value={appointmentDateTime}
          onChange={(e) => setAppointmentDateTime(e.target.value)}
          min={minDateTime()}
          error={errors.appointmentDateTime}
        />
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">หมายเหตุ (ถ้ามี)</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="เช่น ใช้แชมพู hypoallergenic"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={500}
          />
        </div>
        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={!currentUser || !selectedService}
        >
          ยืนยันการจอง
        </Button>
      </form>
    </Card>
  );
}
