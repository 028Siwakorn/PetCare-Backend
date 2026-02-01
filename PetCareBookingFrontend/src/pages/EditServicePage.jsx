import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getServiceById, updateService } from "../services/api";
import ServiceForm from "../components/ServiceForm";

/**
 * หน้าแก้ไขบริการ (เฉพาะ admin)
 */
export default function EditServicePage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (user !== null && user?.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!id || user?.role !== "admin") {
      setLoadError("ไม่พบ ID บริการ");
      return;
    }
    getServiceById(id)
      .then((res) => {
        if (res.success && res.data) setService(res.data);
        else setLoadError("โหลดบริการไม่สำเร็จ");
      })
      .catch((err) => {
        setLoadError(err.response?.data?.message || "โหลดบริการไม่สำเร็จ");
      });
  }, [id, user?.role]);

  const handleSubmit = (body) => {
    setSubmitError("");
    setLoading(true);
    updateService(id, body)
      .then((res) => {
        if (res.success) {
          navigate("/services", { replace: true });
        } else {
          setSubmitError(res.message || "บันทึกการแก้ไขไม่สำเร็จ");
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.response?.data?.errors?.join?.(" ") || "บันทึกการแก้ไขไม่สำเร็จ";
        setSubmitError(msg);
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

  if (loadError) {
    return (
      <main className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="alert alert-error max-w-md">
          <span>{loadError}</span>
          <button type="button" className="btn btn-sm" onClick={() => navigate("/services")}>
            กลับ
          </button>
        </div>
      </main>
    );
  }

  if (!service) {
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
          แก้ไขบริการ
        </h1>
        {submitError && (
          <div className="alert alert-error mb-4 text-sm">{submitError}</div>
        )}
        <ServiceForm
          initialData={service}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/services")}
          loading={loading}
        />
      </div>
    </main>
  );
}
