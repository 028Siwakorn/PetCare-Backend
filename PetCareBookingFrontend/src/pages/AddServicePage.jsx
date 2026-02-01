import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createService } from "../services/api";
import ServiceForm from "../components/ServiceForm";

/**
 * หน้าเพิ่มบริการใหม่ (เฉพาะ admin)
 */
export default function AddServicePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user !== null && user?.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (body) => {
    setError("");
    setLoading(true);
    createService(body)
      .then((res) => {
        if (res.success) {
          navigate("/services", { replace: true });
        } else {
          setError(res.message || "สร้างบริการไม่สำเร็จ");
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.response?.data?.errors?.join?.(" ") || "สร้างบริการไม่สำเร็จ";
        setError(msg);
      })
      .finally(() => setLoading(false));
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
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-lg">
        <h1 className="text-2xl font-bold text-base-content mb-6">
          เพิ่มบริการ
        </h1>
        {error && (
          <div className="alert alert-error mb-4 text-sm">{error}</div>
        )}
        <ServiceForm
          initialData={null}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/services")}
          loading={loading}
        />
      </div>
    </main>
  );
}
