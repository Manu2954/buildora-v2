import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      nav("/admin/cta/config");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8e8e8] p-6">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <label className="text-sm block mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm block mb-1">Password</label>
          <input className="w-full border rounded px-3 py-2" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <button className="w-full bg-[#C69B4B] text-white rounded py-2 font-medium disabled:opacity-60" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

