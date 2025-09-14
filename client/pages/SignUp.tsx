import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useSidebar } from "@/contexts/SidebarContext";
import { useToast } from "@/hooks/use-toast";
import { beTokens } from "@/lib/beTokens";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

export default function SignUp() {
  const { isCollapsed, toggle } = useSidebar();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ""));
  };

  const isValidName = (name: string) => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
  };

  // Form validation
  const validate = () => {
    const e: Record<string, string> = {};

    // Full name validation
    if (!fullName.trim()) {
      e.fullName = "Full name is required";
    } else if (!isValidName(fullName)) {
      e.fullName =
        "Please enter a valid full name (letters only, minimum 2 characters)";
    }

    // Email validation
    if (!email.trim()) {
      e.email = "Email is required";
    } else if (!isValidEmail(email)) {
      e.email = "Please enter a valid email address";
    }

    // Mobile number validation
    if (!mobile.trim()) {
      e.mobile = "Mobile number is required";
    } else if (!isValidPhone(mobile)) {
      e.mobile = "Please enter a valid 10-digit mobile number";
    }

    // Password validation
    if (!password.trim()) {
      e.password = "Password is required";
    } else if (password.length < 8) {
      e.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      e.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      e.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    // Terms agreement validation
    if (!agreeToTerms) {
      e.agreeToTerms =
        "You must agree to the Terms of Service and Privacy Policy";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Handle mobile number input formatting
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 10) {
      setMobile(value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await apiFetch("/api/core/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, role: "CUSTOMER" }),
      });
      toast({ title: "Account created", description: "You can now sign in." });
      navigate("/login", { replace: true });
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
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
                {/* Sign Up Card */}
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
                        Create Account
                      </h1>
                      <p className="text-[#666666] text-sm md:text-base">
                        Join BUILDORA ENTERPRISE and transform your space
                      </p>
                    </div>

                    {/* Sign Up Form */}
                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-5"
                    >
                      {/* Full Name Field */}
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium mb-2"
                        >
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-[#666666]" />
                          </div>
                          <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={cn(
                              "w-full pl-10 pr-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all duration-200",
                              errors.fullName
                                ? "border-red-500 focus:ring-red-500/20"
                                : "border-gray-300 focus:ring-[#c59c46]/20 focus:border-[#c59c46]",
                            )}
                            placeholder="Enter your full name"
                            aria-invalid={!!errors.fullName}
                            aria-describedby={
                              errors.fullName ? "fullName-error" : undefined
                            }
                          />
                        </div>
                        {errors.fullName && (
                          <p
                            id="fullName-error"
                            className="mt-2 text-sm text-red-600"
                          >
                            {errors.fullName}
                          </p>
                        )}
                      </div>

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

                      {/* Mobile Number Field */}
                      <div>
                        <label
                          htmlFor="mobile"
                          className="block text-sm font-medium mb-2"
                        >
                          Mobile Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-[#666666]" />
                          </div>
                          <input
                            id="mobile"
                            type="tel"
                            inputMode="numeric"
                            value={mobile}
                            onChange={handleMobileChange}
                            className={cn(
                              "w-full pl-10 pr-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all duration-200",
                              errors.mobile
                                ? "border-red-500 focus:ring-red-500/20"
                                : "border-gray-300 focus:ring-[#c59c46]/20 focus:border-[#c59c46]",
                            )}
                            placeholder="Enter 10-digit mobile number"
                            maxLength={10}
                            aria-invalid={!!errors.mobile}
                            aria-describedby={
                              errors.mobile ? "mobile-error" : undefined
                            }
                          />
                        </div>
                        {errors.mobile && (
                          <p
                            id="mobile-error"
                            className="mt-2 text-sm text-red-600"
                          >
                            {errors.mobile}
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
                            placeholder="Create a secure password"
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

                      {/* Confirm Password Field */}
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium mb-2"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-[#666666]" />
                          </div>
                          <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={cn(
                              "w-full pl-10 pr-12 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all duration-200",
                              errors.confirmPassword
                                ? "border-red-500 focus:ring-red-500/20"
                                : "border-gray-300 focus:ring-[#c59c46]/20 focus:border-[#c59c46]",
                            )}
                            placeholder="Confirm your password"
                            aria-invalid={!!errors.confirmPassword}
                            aria-describedby={
                              errors.confirmPassword
                                ? "confirmPassword-error"
                                : undefined
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#666666] hover:text-[#c59c46] transition-colors duration-200"
                            aria-label={
                              showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p
                            id="confirmPassword-error"
                            className="mt-2 text-sm text-red-600"
                          >
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>

                      {/* Terms Agreement */}
                      <div>
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            className={cn(
                              "mt-1 w-4 h-4 border-gray-300 rounded focus:ring-[#c59c46] focus:ring-2",
                              errors.agreeToTerms && "border-red-500",
                            )}
                            style={{ accentColor: beTokens.colors.gold }}
                            aria-invalid={!!errors.agreeToTerms}
                            aria-describedby={
                              errors.agreeToTerms
                                ? "agreeToTerms-error"
                                : undefined
                            }
                          />
                          <span className="text-sm text-[#666666] leading-5">
                            I agree to BUILDORA ENTERPRISE's{" "}
                            <Link
                              to="/terms"
                              className="font-medium hover:underline transition-colors duration-200"
                              style={{ color: beTokens.colors.gold }}
                            >
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                              to="/privacy"
                              className="font-medium hover:underline transition-colors duration-200"
                              style={{ color: beTokens.colors.gold }}
                            >
                              Privacy Policy
                            </Link>
                          </span>
                        </label>
                        {errors.agreeToTerms && (
                          <p
                            id="agreeToTerms-error"
                            className="mt-2 text-sm text-red-600"
                          >
                            {errors.agreeToTerms}
                          </p>
                        )}
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
                        {isSubmitting
                          ? "Creating Account..."
                          : "Create Account"}
                      </button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-8 text-center">
                      <p className="text-sm text-[#666666]">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="font-medium hover:underline transition-colors duration-200"
                          style={{ color: beTokens.colors.gold }}
                        >
                          Sign In
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
                          Need help getting started?
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
