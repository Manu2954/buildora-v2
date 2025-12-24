import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardCheck, Eye, EyeOff, Home, Lock, Mail, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { login as loginApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const highlights = [
  {
    icon: Home,
    title: "Project visibility",
    description: "Track progress, timelines, and milestones in one place.",
  },
  {
    icon: ClipboardCheck,
    title: "Service updates",
    description: "Stay in the loop with instant updates from the team.",
  },
  {
    icon: Sparkles,
    title: "Design inspiration",
    description: "Explore curated ideas for your next space.",
  },
];

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!isValidEmail(email)) {
      next.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      next.password = "Password is required";
    } else if (password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await loginApi(email, password);
      toast({ title: "Welcome back!", description: "Logged in successfully." });
      navigate("/", { replace: true });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Login failed";
      toast({ title: "Login failed", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDE7DD] relative overflow-hidden">
      <div className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-[#C69B4B]/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#333132]/15 blur-3xl" />
      <div className="absolute top-1/2 right-1/3 h-48 w-48 rounded-full bg-white/60 blur-2xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl rounded-[28px] border border-[#D9D9D9] bg-white/70 backdrop-blur fade-in-up shadow-[0_30px_80px_rgba(51,49,50,0.15)] overflow-hidden">
          <div className="grid md:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-[#F5EFE6] px-8 py-10 md:px-12 md:py-14">
              <div className="text-xs uppercase tracking-[0.35em] text-[#333132] font-semibold">
                Buildora Enterprise
              </div>
              <h1 className="mt-3 text-3xl md:text-4xl font-['Playfair_Display'] text-[#333132]">
                Welcome back to Buildora
              </h1>
              <p className="mt-3 text-sm text-[#666666]">
                Sign in to manage your projects, approvals, and service updates.
              </p>

              <div className="mt-8 space-y-4 text-sm text-[#333132]">
                {highlights.map((item, index) => {
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
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-[#B1873E] font-medium">
                    Sign in
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-[#333132]">
                    Customer login
                  </h2>
                  <p className="mt-2 text-sm text-[#666666]">
                    Access your Buildora Enterprise account.
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm mb-1 text-[#666666]">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-[#666666]" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn(
                        "w-full border border-[#D9D9D9] rounded-xl px-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C69B4B]/40",
                        errors.email && "border-red-500 focus:ring-red-500/30",
                      )}
                      placeholder="name@company.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm mb-1 text-[#666666]">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-[#666666]" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn(
                        "w-full border border-[#D9D9D9] rounded-xl px-9 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C69B4B]/40",
                        errors.password && "border-red-500 focus:ring-red-500/30",
                      )}
                      placeholder="••••••••"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#666666] hover:text-[#B1873E]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="mt-1 text-xs text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-[#666666]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border border-[#D9D9D9]"
                    />
                    Remember me
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#B1873E] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#C69B4B] text-[#333132] py-2.5 text-sm font-semibold hover:bg-[#B1873E] transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>

                <div className="text-sm text-[#666666]">
                  Don't have an account?{" "}
                  <Link to="/sign-up" className="text-[#B1873E] hover:underline">
                    Create account
                  </Link>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E6E1D8]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-[#999189]">Transform your space today</span>
                  </div>
                </div>

                <Link
                  to="/cta"
                  className="inline-flex items-center justify-center w-full rounded-xl border-2 border-[#C69B4B] py-2.5 text-sm font-medium text-[#B1873E] hover:bg-[#F8F3EA] transition-colors"
                >
                  Get free quote instead
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
