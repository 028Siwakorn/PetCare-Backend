import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";
import Card from "./Card";

/**
 * BookingForm - ฟอร์มจองบริการ
 * Backend: customerName, phoneNumber, petName, appointmentDateTime, serviceId, owner, notes
 */
const OTHER_PET_VALUE = "__other__";

export default function BookingForm({
  selectedService,
  currentUser,
  pets = [],
  onSubmit,
  onSubmitEdit,
  initialBooking = null,
  loading = false,
  error: externalError,
}) {
  const isEdit = Boolean(initialBooking?._id);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [petSelect, setPetSelect] = useState("");
  const [petNameCustom, setPetNameCustom] = useState("");
  const [appointmentDateTime, setAppointmentDateTime] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  const petName = petSelect === OTHER_PET_VALUE ? petNameCustom.trim() : petSelect;

  useEffect(() => {
    if (initialBooking) {
      setPhoneNumber(initialBooking.phoneNumber || "");
      const petNameFromBooking = initialBooking.petName?.trim() || "";
      const matchPet = pets.find((p) => p.name === petNameFromBooking);
      if (matchPet) {
        setPetSelect(matchPet.name);
        setPetNameCustom("");
      } else {
        setPetSelect(OTHER_PET_VALUE);
        setPetNameCustom(petNameFromBooking);
      }
      const dt = initialBooking.appointmentDateTime
        ? new Date(initialBooking.appointmentDateTime)
        : null;
      setAppointmentDateTime(dt && !isNaN(dt.getTime()) ? dt.toISOString().slice(0, 16) : "");
      setNotes(initialBooking.notes || "");
    }
  }, [initialBooking, pets]);

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
    if (!petName) {
      next.petName = petSelect === OTHER_PET_VALUE ? "กรุณากรอกชื่อสัตว์เลี้ยง" : "กรุณาเลือกหรือกรอกชื่อสัตว์เลี้ยง";
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
    const serviceId = selectedService._id != null
      ? (typeof selectedService._id === "string" ? selectedService._id : String(selectedService._id))
      : "";
    const body = {
      customerName: currentUser.username,
      owner: currentUser.id,
      phoneNumber: phoneNumber.trim(),
      petName: petName.trim(),
      appointmentDateTime: new Date(appointmentDateTime).toISOString(),
      serviceId,
      notes: notes.trim() || undefined,
    };
    if (isEdit && onSubmitEdit) {
      onSubmitEdit(initialBooking._id, {
        phoneNumber: body.phoneNumber,
        petName: body.petName,
        appointmentDateTime: body.appointmentDateTime,
        serviceId: body.serviceId,
        notes: body.notes,
      });
    } else {
      onSubmit(body);
    }
  };

  useEffect(() => {
    if (initialBooking) return;
    if (pets.length > 0 && !petSelect) setPetSelect(pets[0].name);
    if (pets.length === 0 && !petSelect) setPetSelect(OTHER_PET_VALUE);
  }, [pets, initialBooking, petSelect]);

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
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">ชื่อสัตว์เลี้ยง</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={petSelect}
            onChange={(e) => setPetSelect(e.target.value)}
          >
            <option value="">-- เลือกหรือกรอกชื่อ --</option>
            {pets.map((pet) => (
              <option key={pet._id} value={pet.name}>
                {pet.name} {pet.breed ? `(${pet.breed})` : ""}
              </option>
            ))}
            <option value={OTHER_PET_VALUE}>กรอกชื่ออื่น...</option>
          </select>
          {petSelect === OTHER_PET_VALUE && (
            <input
              type="text"
              className="input input-bordered w-full mt-2"
              placeholder="เช่น บัดดี้"
              value={petNameCustom}
              onChange={(e) => setPetNameCustom(e.target.value)}
            />
          )}
          {errors.petName && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.petName}</span>
            </label>
          )}
          {currentUser && (
            <p className="text-sm text-base-content/60 mt-1">
              ยังไม่มีรายการ?{" "}
              <Link to="/add-pet" className="link link-primary">
                เพิ่มสัตว์เลี้ยง
              </Link>
            </p>
          )}
        </div>
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
          {isEdit ? "บันทึกการแก้ไข" : "ยืนยันการจอง"}
        </Button>
      </form>
    </Card>
  );
}
