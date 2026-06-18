"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { BookOpen, PenTool } from "lucide-react";
import { toast } from "react-toastify";

export default function SelectRolePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await authClient.getSession();
      if (session?.user?.role && session.user.role !== "user") {
         router.push("/");
      router.refresh();
      }
    };
    checkSession();
  }, [router]);

  const handleRoleSelect = async (selectedRole) => {
    setIsLoading(true);
    try {
      await authClient.updateUser({ role: selectedRole });
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error("Failed to set role.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white p-8 rounded shadow-xl shadow-black/5" style={{ border: "1.5px dashed rgba(47,111,109,0.2)" }}>
        <h1 className="text-xl font-bold text-[#1C1C1C] text-center mb-2">Choose Your Role</h1>
        <p className="text-xs text-[#6B6B6B] text-center mb-6">How do you want to use Fable?</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleRoleSelect("user")}
            disabled={isLoading}
            className="flex items-center gap-3 p-4 border border-dashed border-[#2F6F6D]/35 rounded hover:bg-[#2F6F6D]/5 transition"
          >
            <BookOpen className="h-5 w-5 text-[#2F6F6D]" />
            <div className="text-left">
              <p className="text-sm font-semibold text-[#1C1C1C]">Reader</p>
              <p className="text-xs text-[#6B6B6B]">Browse and purchase ebooks</p>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect("writer")}
            disabled={isLoading}
            className="flex items-center gap-3 p-4 border border-dashed border-[#AE7C54]/35 rounded hover:bg-[#AE7C54]/5 transition"
          >
            <PenTool className="h-5 w-5 text-[#AE7C54]" />
            <div className="text-left">
              <p className="text-sm font-semibold text-[#1C1C1C]">Writer</p>
              <p className="text-xs text-[#6B6B6B]">Upload and sell your ebooks</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}