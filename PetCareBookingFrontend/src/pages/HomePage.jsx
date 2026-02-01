import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getServices } from "../services/api";
import ServiceCard from "../components/ServiceCard";
import Button from "../components/Button";

export default function HomePage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getServices()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) setServices(res.data);
      })
      .catch((err) => setError(err.response?.data?.message || "โหลดบริการไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-base-200">
      <section className="container mx-auto px-4 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
            บริการดูแลสัตว์เลี้ยง
          </h1>
          <p className="text-base-content/70 mt-2 text-sm sm:text-base">
            เลือกบริการที่ต้องการและจองนัดได้ทันที
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : error ? (
          <div className="alert alert-error max-w-md mx-auto">
            <span>{error}</span>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-base-content/70">
            ยังไม่มีบริการในขณะนี้
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onBook={() => navigate("/booking", { state: { serviceId: service._id } })}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link to="/booking">
            <Button variant="primary" size="lg" fullWidth className="sm:w-auto">
              ไปหน้าจองบริการ
            </Button>
          </Link>
          <Link to="/history">
            <Button variant="outline" size="lg" fullWidth className="sm:w-auto">
              ดูประวัติการจอง
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
