import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || username.trim().length < 4) {
      setError("ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร");
      return;
    }
    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }
    setLoading(true);
    register(username.trim(), password)
      .then((res) => {
        if (res.message) {
          navigate("/login", { replace: true });
        } else {
          setError(res.message || "สมัครไม่สำเร็จ");
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ (อาจมีชื่อผู้ใช้แล้ว)"
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">สมัครสมาชิก</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="alert alert-error text-sm">{error}</div>
          )}
          <Input
            label="ชื่อผู้ใช้ (อย่างน้อย 4 ตัวอักษร)"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <Input
            label="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Input
            label="ยืนยันรหัสผ่าน"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Button type="submit" fullWidth loading={loading}>
            สมัครสมาชิก
          </Button>
        </form>
        <p className="text-center text-sm text-base-content/70 mt-4">
          มีบัญชีอยู่แล้ว?{" "}
          <Link to="/login" className="link link-primary">
            เข้าสู่ระบบ
          </Link>
        </p>
      </Card>
    </main>
  );
}
