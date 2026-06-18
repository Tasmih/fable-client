"use client";

import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  PenTool,
  ChevronDown,
  XCircle,
  CheckCircle,
} from "lucide-react";
import Logo from "@/components/Logo";
import { signUp, signIn, authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");

  // ui states
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  // prefetch routes for faster redirection
  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/dashboard/writer");
    router.prefetch("/dashboard/user");
  }, [router]);

  // dynamic callback url based on selected role
  const getCallbackURL = () => {
    return role === "writer" ? "/dashboard/writer" : "/dashboard/user";
  };

  // email sign-up handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      toast.error("Password must be at least 6 characters.", {
        icon: <XCircle className="w-4 h-4 text-red-500" />,
      });
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.", {
        icon: <XCircle className="w-4 h-4 text-red-500" />,
      });
      return;
    }

    setIsLoading(true);

    try {
      const targetCallback = getCallbackURL();

      const { data, error: authError } = await authClient. signUp.email({
        email,
        password,
        name,
        role: role,
        callbackURL: '/',
      });

      if (authError) {
        setError(authError.message || "Something went wrong during signup.");
        toast.error(authError.message || "Something went wrong during signup.", {
          icon: <XCircle className="w-4 h-4 text-red-500" />,
        });
      } else {
        setSuccess("Account created successfully! Welcome. Redirecting...");
        toast.success("Account created successfully! Welcome.", {
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        });
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          router.push(targetCallback);
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
      toast.error("An unexpected network error occurred.", {
        icon: <XCircle className="w-4 h-4 text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // google sign-in handler (Fixed to support dynamic roles)
  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/auth/select-role",
      });
    } catch (err) {
      setError("Failed to initialize Google sign in.");
      toast.error("Failed to initialize Google sign in.");
    }
  };
    

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F5F2] flex items-center justify-center px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,111,109,0.05),transparent_60%)]" />

      <div className="relative z-10 w-full max-w-sm">
        {/* header section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center px-8 py-6 bg-white shadow-xl shadow-black/5"
          style={{ border: "1.5px dashed rgba(47, 111, 109, 0.3)", borderRadius: "8px" }}
        >
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <div className="mb-2 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#2F6F6D] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#AE7C54]" />
            Join Fable Platform
            <span className="h-1.5 w-1.5 rounded-full bg-[#AE7C54]" />
          </div>
          <h1 className="text-2xl font-bold leading-tight text-[#1C1C1C]">Create your account</h1>
          <p className="text-xs text-[#6B6B6B] mt-1">Discover & Read Original Ebooks</p>
        </motion.div>

        {/* form card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="p-6 bg-white shadow-xl shadow-black/5"
          style={{ border: "1.5px dashed rgba(47, 111, 109, 0.2)", borderRadius: "8px" }}
        >
          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              {/* full name */}
              <div>
                <label className="text-xs uppercase tracking-widest font-semibold text-[#6B6B6B]">Full Name</label>
                <div className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-[#2F6F6D]/35 rounded bg-[#F7F5F2]/50 mt-1">
                  <User className="h-4 w-4 text-[#2F6F6D]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-transparent text-sm text-[#1C1C1C] outline-none placeholder-gray-400"
                  />
                </div>
              </div>

              {/* email */}
              <div>
                <label className="text-xs uppercase tracking-widest font-semibold text-[#6B6B6B]">Email Address</label>
                <div className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-[#2F6F6D]/35 rounded bg-[#F7F5F2]/50 mt-1">
                  <AtSign className="h-4 w-4 text-[#2F6F6D]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-transparent text-sm text-[#1C1C1C] outline-none placeholder-gray-400"
                  />
                </div>
              </div>

              {/* password */}
              <div>
                <label className="text-xs uppercase tracking-widest font-semibold text-[#6B6B6B]">Password</label>
                <div className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-[#2F6F6D]/35 rounded bg-[#F7F5F2]/50 mt-1">
                  <Lock className="h-4 w-4 text-[#2F6F6D]" />
                  <input
                    type={isVisible ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-transparent text-sm text-[#1C1C1C] outline-none placeholder-gray-400"
                  />
                  <button type="button" onClick={toggleVisibility} className="text-gray-400 hover:text-[#2F6F6D]">
                    {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* confirm password */}
              <div>
                <label className="text-xs uppercase tracking-widest font-semibold text-[#6B6B6B]">Confirm Password</label>
                <div className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-[#2F6F6D]/35 rounded bg-[#F7F5F2]/50 mt-1">
                  <Lock className="h-4 w-4 text-[#2F6F6D]" />
                  <input
                    type={isConfirmVisible ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-transparent text-sm text-[#1C1C1C] outline-none placeholder-gray-400"
                  />
                  <button type="button" onClick={toggleConfirmVisibility} className="text-gray-400 hover:text-[#2F6F6D]">
                    {isConfirmVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* role dropdown */}
              <div className="relative">
                <label className="text-xs uppercase tracking-widest font-semibold text-[#6B6B6B]">Choose Your Role</label>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full flex items-center justify-between border border-dashed border-[#2F6F6D]/35 p-2.5 rounded text-sm bg-[#F7F5F2]/50 text-[#1C1C1C] mt-1 transition focus:outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                >
                  <div className="flex items-center gap-2">
                    {role === "user" ? (
                      <>
                        <BookOpen className="h-4 w-4 text-[#2F6F6D]" />
                        <span>Reader (User)</span>
                      </>
                    ) : (
                      <>
                        <PenTool className="h-4 w-4 text-[#AE7C54]" />
                        <span>Writer</span>
                      </>
                    )}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                    <button
                      type="button"
                      onClick={() => { setRole("user"); setIsOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-[#F7F5F2] transition ${role === "user" ? "bg-[#2F6F6D]/5 font-medium text-[#2F6F6D]" : "text-gray-700"}`}
                    >
                      <BookOpen className="h-4 w-4 text-[#2F6F6D]" />
                      <span>Reader (User)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRole("writer"); setIsOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-[#F7F5F2] transition ${role === "writer" ? "bg-[#AE7C54]/5 font-medium text-[#AE7C54]" : "text-gray-700"}`}
                    >
                      <PenTool className="h-4 w-4 text-[#AE7C54]" />
                      <span>Writer</span>
                    </button>
                  </div>
                )}
              </div>

              {error && <div className="p-3 text-xs font-medium rounded border border-dashed border-red-200 bg-red-50 text-red-600 mt-1"><strong>Error:</strong> {error}</div>}
              {success && <div className="p-3 text-xs font-medium rounded border border-dashed border-emerald-200 bg-emerald-50 text-emerald-700 mt-1"><strong>Success:</strong> {success}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#2F6F6D] text-white font-semibold py-2.5 rounded hover:bg-[#235351] transition shadow-md mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <span className="text-sm">Processing...</span> : <span>{role === "user" ? "Create Fable Account" : "Join as Fable Writer"}</span>}
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 border border-dashed border-gray-300 py-2.5 rounded bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.39 7.51l3.79 2.94C6.07 7.22 8.77 5.04 12 5.04z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.58l3.73 2.89c2.18-2.01 3.43-4.97 3.43-8.62z" />
              <path fill="#FBBC05" d="M5.18 14.56c-.24-.72-.38-1.5-.38-2.31s.14-1.59.38-2.31L1.39 7.51C.5 9.31 0 11.31 0 13.43s.5 4.12 1.39 5.92l3.79-2.79z" />
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.1.74-2.51 1.18-4.23 1.18-3.23 0-5.93-2.18-6.91-5.41L1.39 16.35C3.37 20.21 7.35 23 12 23z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-[#6B6B6B] mt-4">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-[#2F6F6D] font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}