import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBookingById, getServices, getPets, updateBooking } from "../services/api";
import BookingForm from "../components/BookingForm";

/**
 * หน้าแก้ไขการจอง (จากประวัติการจอง)
 */
export default function EditBookingPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [services, setServices] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !user?.id) {
      setLoading(false);
      return;
    }
    Promise.all([
      getBookingById(id),
      getServices(),
      getPets(user.id),
    ])
      .then(([bookingRes, servicesRes, petsRes]) => {
        if (bookingRes.success && bookingRes.data) {
          setBooking(bookingRes.data);
          if (servicesRes.success && Array.isArray(servicesRes.data)) {
            setServices(servicesRes.data);
          }
          if (petsRes.success && Array.isArray(petsRes.data)) {
            setPets(petsRes.data);
          }
        } else {
          setError("โหลดข้อมูลการจองไม่สำเร็จ");
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ");
      })
      .finally(() => setLoading(false));
  }, [id, user?.id]);

  const handleSubmitEdit = (bookingId, body) => {
    setError("");
    setSubmitLoading(true);
    updateBooking(bookingId, body)
      .then((res) => {
        if (res.success) {
          navigate("/history");
        } else {
          setError(res.message || "บันทึกการแก้ไขไม่สำเร็จ");
        }
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          "บันทึกการแก้ไขไม่สำเร็จ";
        setError(msg);
      })
      .finally(() => setSubmitLoading(false));
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-base-content/70 mb-4">กรุณาเข้าสู่ระบบก่อนแก้ไขการจอง</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-base-200 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </main>
    );
  }

  if (error && !booking) {
    return (
      <main className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="alert alert-error max-w-md flex flex-col gap-2">
          <span>{error}</span>
          <button type="button" className="btn btn-sm" onClick={() => navigate("/history")}>
            กลับไปประวัติการจอง
          </button>
        </div>
      </main>
    );
  }

  const selectedService =
    booking?.serviceId && typeof booking.serviceId === "object"
      ? booking.serviceId
      : services.find((s) => String(s._id) === String(booking?.serviceId));

  return (
    <main className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-lg">
        <h1 className="text-2xl font-bold text-base-content mb-6">
          แก้ไขการจอง
        </h1>
        {error && (
          <div className="alert alert-error mb-4 text-sm">{error}</div>
        )}
        <BookingForm
          selectedService={selectedService || null}
          currentUser={{ id: user.id, username: user.username }}
          pets={pets}
          initialBooking={booking}
          onSubmitEdit={handleSubmitEdit}
          loading={submitLoading}
          error={error}
        />
        <div className="mt-4">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => navigate("/history")}
          >
            ← กลับไปประวัติการจอง
          </button>
        </div>
      </div>
    </main>
  );
}
