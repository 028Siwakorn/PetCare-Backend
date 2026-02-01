import { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";
import Card from "./Card";

/**
 * ฟอร์มสร้าง/แก้ไขบริการ
 * initialData = null -> โหมดสร้าง, มีค่า -> โหมดแก้ไข
 */
export default function ServiceForm({ initialData, onSubmit, onCancel, loading }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [duration, setDuration] = useState("60");
  const [available, setAvailable] = useState(true);
  const [error, setError] = useState("");

  const isEdit = Boolean(initialData?._id);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setPrice(String(initialData.price ?? ""));
      setImageUrl(initialData.imageUrl || "");
      setDuration(String(initialData.duration ?? 60));
      setAvailable(initialData.available !== false);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const nameTrim = name.trim();
    const descTrim = description.trim();
    if (nameTrim.length < 3) {
      setError("ชื่อบริการต้องมีอย่างน้อย 3 ตัวอักษร");
      return;
    }
    if (descTrim.length < 10) {
      setError("รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร");
      return;
    }
    const priceNum = Number(price);
    if (price === "" || isNaN(priceNum) || priceNum < 0) {
      setError("กรุณากรอกราคาเป็นตัวเลข 0 ขึ้นไป");
      return;
    }
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    if (!imageUrl.trim() || !urlRegex.test(imageUrl.trim())) {
      setError("กรุณากรอก URL รูปภาพให้ถูกต้อง");
      return;
    }
    const durationNum = Number(duration);
    if (duration !== "" && (isNaN(durationNum) || durationNum < 15)) {
      setError("ระยะเวลาต้องเป็นตัวเลขอย่างน้อย 15 นาที");
      return;
    }

    const body = {
      name: nameTrim,
      description: descTrim,
      price: priceNum,
      imageUrl: imageUrl.trim(),
      duration: durationNum || 60,
      available,
    };
    onSubmit(body);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="alert alert-error text-sm">{error}</div>
        )}
        <Input
          label="ชื่อบริการ"
          type="text"
          placeholder="เช่น อาบน้ำตัดขน"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">รายละเอียด</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full min-h-[100px]"
            placeholder="อธิบายบริการอย่างน้อย 10 ตัวอักษร"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Input
          label="ราคา (บาท)"
          type="number"
          min={0}
          step={1}
          placeholder="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input
          label="URL รูปภาพ"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <Input
          label="ระยะเวลา (นาที)"
          type="number"
          min={15}
          placeholder="60"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            <span className="label-text">บริการเปิดให้จอง</span>
          </label>
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="submit" fullWidth loading={loading}>
            {isEdit ? "บันทึกการแก้ไข" : "สร้างบริการ"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            ยกเลิก
          </Button>
        </div>
      </form>
    </Card>
  );
}
