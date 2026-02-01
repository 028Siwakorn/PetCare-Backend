import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserBookings, updateBooking } from "../services/api";
import BookingCard from "../components/molecules/BookingCard";

export default function HistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    getUserBookings(user.id)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) setBookings(res.data);
        else setBookings([]);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "โหลดประวัติไม่สำเร็จ");
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleCancel = (id) => {
    if (!window.confirm("ต้องการยกเลิกการจองนี้ใช่หรือไม่?")) return;
    setCancellingId(id);
    cancelBooking(id)
      .then((res) => {
        if (res.success) {
          setBookings((prev) =>
            prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
          );
        }
      })
      .catch(() => {})
      .finally(() => setCancellingId(null));
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-base-content/70 mb-4">กรุณาเข้าสู่ระบบเพื่อดูประวัติการจอง</p>
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

  return (
    <main className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-6">
          ประวัติการจอง
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 text-base-content/70">
            ยังไม่มีประวัติการจอง
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={
                  cancellingId === booking._id ? undefined : handleCancel
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
