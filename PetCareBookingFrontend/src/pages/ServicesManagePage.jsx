import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getServices, deleteService } from "../services/api";
import Button from "../components/Button";
import Card, { CardBody, CardTitle, CardActions } from "../components/Card";

/**
 * หน้ารายการบริการ สำหรับเพิ่ม/แก้ไข/ลบ (เฉพาะ admin)
 */
export default function ServicesManagePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (user !== null && user?.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const loadServices = () => {
    setLoading(true);
    setError(null);
    getServices()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) setServices(res.data);
      })
      .catch((err) => setError(err.response?.data?.message || "โหลดรายการบริการไม่สำเร็จ"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.role === "admin") loadServices();
  }, [user?.role]);

  const handleDelete = (id, name) => {
    if (!window.confirm(`ต้องการลบบริการ "${name}" ใช่หรือไม่?`)) return;
    setDeletingId(id);
    deleteService(id)
      .then(() => {
        setServices((prev) => prev.filter((s) => s._id !== id));
      })
      .catch((err) => {
        alert(err.response?.data?.message || "ลบบริการไม่สำเร็จ");
      })
      .finally(() => setDeletingId(null));
  };

  if (user === null || user?.role !== "admin") {
    return (
      <main className="min-h-screen bg-base-200 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-200">
      <section className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
            จัดการบริการ
          </h1>
          <Link to="/services/new">
            <Button variant="primary" size="md">
              ＋ เพิ่มบริการ
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : error ? (
          <div className="alert alert-error max-w-md">
            <span>{error}</span>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-base-content/70">
            ยังไม่มีบริการ — กด "เพิ่มบริการ" เพื่อสร้างรายการแรก
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service) => (
              <Card key={service._id} className="hover:shadow-lg transition-shadow">
                <figure className="w-full aspect-video overflow-hidden rounded-t-2xl bg-base-200">
                  <img
                    src={service.imageUrl || "https://placehold.co/400x225?text=Service"}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </figure>
                <CardBody>
                  <CardTitle>{service.name}</CardTitle>
                  <p className="text-sm text-base-content/70 line-clamp-2">{service.description}</p>
                  <div className="flex flex-wrap gap-2 items-center text-sm">
                    <span className="font-semibold text-primary">{service.price}฿</span>
                    <span className="text-base-content/60">• {service.duration || 60} นาที</span>
                    {!service.available && (
                      <span className="badge badge-warning">ไม่ว่าง</span>
                    )}
                  </div>
                  <CardActions className="flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/services/${service._id}/edit`)}
                    >
                      แก้ไข
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-error"
                      loading={deletingId === service._id}
                      disabled={deletingId !== null}
                      onClick={() => handleDelete(service._id, service.name)}
                    >
                      ลบ
                    </Button>
                  </CardActions>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
