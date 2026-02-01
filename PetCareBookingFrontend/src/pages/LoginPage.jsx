import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";

export default function LoginPage() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }
    setLoading(true);
    login(username.trim(), password)
      .then((res) => {
        if (res.id && res.username && res.accessToken) {
          authLogin(res);
          navigate("/", { replace: true });
        } else {
          setError(res.message || "เข้าสู่ระบบไม่สำเร็จ");
        }
      })
      .catch((err) => {
        if (!err.response) {
          setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบว่า Backend รันอยู่และ VITE_API_URL ถูกต้อง");
          return;
        }
        const msg = err.response?.data?.message || err.response?.data?.error;
        setError(msg || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      })
      .finally(() => setLoading(false));
  };

  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">เข้าสู่ระบบ</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="alert alert-error text-sm">{error}</div>
          )}
          <Input
            label="ชื่อผู้ใช้"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <Input
            label="รหัสผ่าน"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth loading={loading}>
            เข้าสู่ระบบ
          </Button>
        </form>
        <p className="text-center text-sm text-base-content/70 mt-4">
          ยังไม่มีบัญชี?{" "}
          <Link to="/register" className="link link-primary">
            สมัครสมาชิก
          </Link>
        </p>
      </Card>
    </main>
  );
}
