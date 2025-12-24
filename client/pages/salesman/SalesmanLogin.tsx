import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ShieldCheck, UserCheck } from "lucide-react";
import { login, logout } from "@/lib/api";

export default function SalesmanLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      if (user?.role !== "SALESMAN") {
        logout();
        setError("This account does not have salesman access.");
        return;
      }
      navigate("/salesman/leads", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#EDE7DD] relative overflow-hidden">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#C69B4B]/25 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#333132]/15 blur-3xl" />
      <div className="absolute top-1/2 right-1/3 h-48 w-48 rounded-full bg-white/60 blur-2xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl rounded-[28px] border border-[#D9D9D9] bg-white/70 backdrop-blur fade-in-up shadow-[0_30px_80px_rgba(51,49,50,0.15)] overflow-hidden">
          <div className="grid md:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-[#F5EFE6] px-8 py-10 md:px-12 md:py-14">
              <div className="text-xs uppercase tracking-[0.35em] text-[#333132] font-semibold">
                Buildora Enterprise
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.3em] text-[#B1873E] font-medium">
                Sales Team
              </div>
              <h1 className="mt-3 text-3xl md:text-4xl font-['Playfair_Display'] text-[#333132]">
                Salesman Portal
              </h1>
              <p className="mt-3 text-sm text-[#666666]">
                Capture leads, log daily activity, and stay accountable without the admin overhead.
              </p>

              <div className="mt-8 space-y-4 text-sm text-[#333132]">
                {[
                  {
                    icon: UserCheck,
                    title: "Lead capture",
                    description: "Submit new leads in seconds with verified consent.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Daily entries",
                    description: "Track start and end times with optional notes.",
                  },
                  {
                    icon: Mail,
                    title: "Follow ups",
                    description: "Keep your pipeline visible and clean.",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-3 rounded-2xl bg-white/80 px-4 py-3 border border-white/60 fade-in-up"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#C69B4B]/15 text-[#B1873E]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-[#666666]">{item.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white px-8 py-10 md:px-12 md:py-14">
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-[#B1873E] font-medium">
                    Sign in
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-[#333132]">
                    Welcome back
                  </h2>
                  <p className="mt-2 text-sm text-[#666666]">
                    Use your Buildora salesman credentials to continue.
                  </p>
                </div>

                {error && (
                  <div className="rounded-xl border border-[#F5D0D0] bg-[#FEF2F2] px-4 py-2 text-sm text-[#991B1B]">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-sm block mb-1 text-[#666666]">Email</label>
                  <input
                    className="w-full border border-[#D9D9D9] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C69B4B]/40"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1 text-[#666666]">Password</label>
                  <input
                    className="w-full border border-[#D9D9D9] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C69B4B]/40"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  className="w-full rounded-xl bg-[#C69B4B] text-[#333132] py-2.5 text-sm font-semibold hover:bg-[#B1873E] transition-colors disabled:opacity-60"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
                <div className="text-xs text-[#666666]">
                  Need the customer login instead?{" "}
                  <Link to="/login" className="text-[#B1873E] hover:underline">
                    Go to customer login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
