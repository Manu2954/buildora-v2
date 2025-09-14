import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useSidebar } from "@/contexts/SidebarContext";
import { useToast } from "@/hooks/use-toast";
import { login as loginApi } from "@/lib/api";
import { beTokens } from "@/lib/beTokens";
import { cn } from "@/lib/utils";

export default function Login() {
  const { isCollapsed, toggle } = useSidebar();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validate = () => {
    const e: Record<string, string> = {};

    if (!email.trim()) {
      e.email = "Email is required";
    } else if (!isValidEmail(email)) {
      e.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      e.password = "Password is required";
    } else if (password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Handle form submission
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
    <div
      className="min-h-screen"
      style={{ background: beTokens.colors.background }}
    >
      {/* Mobile: Add top margin for navbar */}
      <div className="pt-24 md:pt-16">
        <div className="flex">
          {/* Sidebar Navigation - Only on desktop */}
          <div className="hidden xl:block">
            <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
          </div>

          {/* Main Content */}
          <main
            className={cn(
              "flex-1 transition-all duration-300 ease-in-out",
              isCollapsed ? "xl:ml-16" : "xl:ml-[220px]",
            )}
          >
            {/* Mobile: Bottom padding for bottom nav */}
            <div className="min-h-screen flex flex-col pb-24 md:pb-0">
              <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                {/* Login Card */}
                <div className="w-full max-w-md">
                  <div
                    className="bg-white shadow-lg border border-gray-200 p-6 md:p-8"
                    style={{
                      borderRadius: beTokens.radii.card,
                      color: beTokens.colors.text,
                    }}
                  >
                    {/* Header */}
                    <div className="text-center mb-8">
                      <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        Welcome Back
                      </h1>
                      <p className="text-[#666666] text-sm md:text-base">
                        Sign in to your BUILDORA ENTERPRISE account
                      </p>
                    </div>

                    {/* Login Form */}
                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-6"
                    >
                      {/* Email Field */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-2"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-[#666666]" />
                          </div>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={cn(
                              "w-full pl-10 pr-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all duration-200",
                              errors.email
                                ? "border-red-500 focus:ring-red-500/20"
                                : "border-gray-300 focus:ring-[#c59c46]/20 focus:border-[#c59c46]",
                            )}
                            placeholder="Enter your email"
                            aria-invalid={!!errors.email}
                            aria-describedby={
                              errors.email ? "email-error" : undefined
                            }
                          />
                        </div>
                        {errors.email && (
                          <p
                            id="email-error"
                            className="mt-2 text-sm text-red-600"
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium mb-2"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-[#666666]" />
                          </div>
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={cn(
                              "w-full pl-10 pr-12 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all duration-200",
                              errors.password
                                ? "border-red-500 focus:ring-red-500/20"
                                : "border-gray-300 focus:ring-[#c59c46]/20 focus:border-[#c59c46]",
                            )}
                            placeholder="Enter your password"
                            aria-invalid={!!errors.password}
                            aria-describedby={
                              errors.password ? "password-error" : undefined
                            }
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#666666] hover:text-[#c59c46] transition-colors duration-200"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p
                            id="password-error"
                            className="mt-2 text-sm text-red-600"
                          >
                            {errors.password}
                          </p>
                        )}
                      </div>

                      {/* Remember Me Checkbox */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 border-gray-300 rounded focus:ring-[#c59c46] focus:ring-2"
                            style={{ accentColor: beTokens.colors.gold }}
                          />
                          <span className="text-sm text-[#666666]">
                            Remember me
                          </span>
                        </label>

                        <Link
                          to="/forgot-password"
                          className="text-sm hover:underline transition-colors duration-200"
                          style={{ color: beTokens.colors.gold }}
                        >
                          Forgot password?
                        </Link>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                          "w-full py-3 font-semibold text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200",
                          isSubmitting
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:opacity-90 active:transform active:scale-[0.98]",
                        )}
                        style={{
                          backgroundColor: beTokens.colors.gold,
                          borderRadius: beTokens.radii.button,
                        }}
                      >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                      </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-8 text-center">
                      <p className="text-sm text-[#666666]">
                        Don't have an account?{" "}
                        <Link
                          to="/sign-up"
                          className="font-medium hover:underline transition-colors duration-200"
                          style={{ color: beTokens.colors.gold }}
                        >
                          Create Account
                        </Link>
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="mt-8 relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-[#666666]">
                          Transform your space today
                        </span>
                      </div>
                    </div>

                    {/* CTA Link */}
                    <div className="mt-6 text-center">
                      <Link
                        to="/cta"
                        className="inline-flex items-center justify-center w-full py-3 px-4 text-sm font-medium border-2 rounded-lg hover:bg-[#f8f8f8] transition-all duration-200"
                        style={{
                          borderColor: beTokens.colors.gold,
                          color: beTokens.colors.gold,
                          borderRadius: beTokens.radii.button,
                        }}
                      >
                        Get Free Quote Instead
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
