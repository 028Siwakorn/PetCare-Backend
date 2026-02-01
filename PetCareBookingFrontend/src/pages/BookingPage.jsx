import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getServices, createBooking } from "../services/api";
import ServiceCard from "../components/molecules/ServiceCard";
import BookingForm from "../components/organisms/BookingForm";

export default function BookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    getServices()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setServices(res.data);
          const serviceId = location.state?.serviceId;
          if (serviceId) {
            const svc = res.data.find((s) => s._id === serviceId);
            if (svc) setSelectedService(svc);
          }
        }
      })
      .catch(() => setServices([]))
      .finally(() => setLoadingServices(false));
  }, [location.state?.serviceId]);

  const handleBookService = (service) => {
    setSelectedService(service);
    setSubmitError(null);
  };

  const handleSubmitBooking = (body) => {
    setSubmitLoading(true);
    setSubmitError(null);
    createBooking(body)
      .then((res) => {
        if (res.success) {
          setSelectedService(null);
          navigate("/history");
        } else {
          setSubmitError(res.message || "เกิดข้อผิดพลาด");
        }
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          "จองไม่สำเร็จ";
        setSubmitError(msg);
      })
      .finally(() => setSubmitLoading(false));
  };

  return (
    <main className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-6">
          จองบริการ
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-3">เลือกบริการ</h2>
            {loadingServices ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services
                  .filter((s) => s.available)
                  .map((service) => (
                    <ServiceCard
                      key={service._id}
                      service={service}
                      onBook={handleBookService}
                    />
                  ))}
                {services.filter((s) => s.available).length === 0 && (
                  <p className="col-span-2 text-base-content/70">
                    ยังไม่มีบริการว่างในขณะนี้
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <BookingForm
                selectedService={selectedService}
                currentUser={user ? { id: user.id } : null}
                onSubmit={handleSubmitBooking}
                loading={submitLoading}
                error={submitError}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
