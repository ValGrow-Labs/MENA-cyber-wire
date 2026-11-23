"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAdmin } from "../AdminContext";

export default function CMSLoginPage() {
  const router = useRouter();
  const { notify } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/cms/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed.");
      }

      notify("Signed in successfully.", "success");
      router.push("/cms-admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0B] p-4">
      <div className="relative w-full max-w-md rounded-lg border border-[#2B2B2B] bg-[#151515] p-8 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded bg-[#191919] border border-[#2B2B2B] text-[#D63838]">
            <Lock size={18} />
          </div>
          <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            MENA Cyber Wire
          </h2>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[#A1A1A1]">
            CMS Administration
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded border border-[#D63838]/40 bg-[#D63838]/10 p-3 text-xs text-[#D63838]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A1A1A1]">Editorial Email</label>
            <div className="relative mt-1.5">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#707070]">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="editor@menacyberwire.com"
                className="w-full rounded-md border border-[#2B2B2B] bg-[#191919] py-2.5 pl-9 pr-3 text-xs text-[#F5F5F5] placeholder-[#707070] focus:border-[#D63838] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1A1]">Password</label>
            <div className="relative mt-1.5">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#707070]">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-md border border-[#2B2B2B] bg-[#191919] py-2.5 pl-9 pr-10 text-xs text-[#F5F5F5] placeholder-[#707070] focus:border-[#D63838] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#707070] transition-colors hover:text-[#F5F5F5]"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#D63838] py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-[#b02c2c] disabled:opacity-50"
            >
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              {!loading && <ArrowRight size={15} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
