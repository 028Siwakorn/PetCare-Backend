import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createPet } from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";

/**
 * หน้าเพิ่มสัตว์เลี้ยงของ user
 * Backend: name, age, breed, image (optional), owner
 */
export default function AddPetPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [breed, setBreed] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("กรุณากรอกชื่อสัตว์เลี้ยง");
      return;
    }
    const ageNum = Number(age);
    if (age === "" || isNaN(ageNum) || ageNum < 0) {
      setError("กรุณากรอกอายุเป็นตัวเลข 0 ขึ้นไป");
      return;
    }
    if (!breed.trim()) {
      setError("กรุณากรอกสายพันธุ์");
      return;
    }
    if (!user?.id) {
      setError("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("age", String(ageNum));
    formData.append("breed", breed.trim());
    formData.append("owner", user.id);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    createPet(formData)
      .then((res) => {
        if (res.success) {
          navigate("/booking", { replace: true });
        } else {
          setError(res.message || "เพิ่มสัตว์เลี้ยงไม่สำเร็จ");
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "เพิ่มสัตว์เลี้ยงไม่สำเร็จ"
        );
      })
      .finally(() => setLoading(false));
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <p className="text-base-content/70 mb-4">กรุณาเข้าสู่ระบบก่อนเพิ่มสัตว์เลี้ยง</p>
          <Button variant="primary" onClick={() => navigate("/login")}>
            เข้าสู่ระบบ
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-md">
        <h1 className="text-2xl font-bold text-base-content mb-6">
          เพิ่มสัตว์เลี้ยง
        </h1>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="alert alert-error text-sm">{error}</div>
            )}
            <Input
              label="ชื่อสัตว์เลี้ยง"
              type="text"
              placeholder="เช่น บัดดี้"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="อายุ (ปี)"
              type="number"
              min={0}
              placeholder="0"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <Input
              label="สายพันธุ์"
              type="text"
              placeholder="เช่น ลาบราดอร์, สุนัขไทย"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">รูปภาพ (ไม่บังคับ, สูงสุด 1MB)</span>
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {imageFile && (
                <p className="text-sm text-base-content/60 mt-1">{imageFile.name}</p>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" fullWidth loading={loading}>
                บันทึก
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                ยกเลิก
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
