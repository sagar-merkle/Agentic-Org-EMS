"use client";
import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Bot } from "lucide-react";
import { useStore } from "@/lib/store";

export function Login() {
  const { login } = useStore();
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");

  const sendOtp = () => {
    if (phone !== "9999999999") return setErr("Enter the demo number 9999999999");
    setErr("");
    setOtpSent(true);
  };
  const verify = () => {
    if (otp !== "0000") return setErr("Wrong OTP. Use 0000");
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand to-brand-dark p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 fade-up">
        <div className="flex justify-center mb-6">
          <Image src="/brand/tvs-logo-full.png" alt="TVS" width={150} height={40} style={{ height: "auto" }} priority />
        </div>
        <h1 className="text-center text-lg font-semibold">Enterprise Management System</h1>
        <p className="text-center text-xs text-gray-400 mb-6">Sales and Service Accelerator, with AI agents</p>

        <label className="text-xs text-gray-500">Mobile number</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} disabled={otpSent} placeholder="10-digit mobile number" className="w-full border border-line rounded-lg px-3 py-2.5 mt-1 text-sm disabled:bg-gray-50" />
        <p className="text-[11px] text-gray-400 mt-1 mb-4">Tip: use 9999999999 for this demo.</p>

        {otpSent && (
          <>
            <label className="text-xs text-gray-500">OTP</label>
            <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="4-digit OTP" className="w-full border border-line rounded-lg px-3 py-2.5 mt-1 text-sm tracking-widest" autoFocus />
            <p className="text-[11px] text-gray-400 mt-1 mb-4">Tip: the OTP is 0000.</p>
          </>
        )}
        {err && <p className="text-xs text-hot mb-3">{err}</p>}
        <button onClick={otpSent ? verify : sendOtp} className="w-full bg-brand hover:bg-brand-dark text-white rounded-full py-2.5 font-medium">
          {otpSent ? "Verify and sign in" : "Get OTP"}
        </button>
      </div>
    </div>
  );
}

export function BuddyFab() {
  const { setBuddyOpen } = useStore();
  return (
    <button onClick={() => setBuddyOpen(true)} title="AI Buddy" className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-brand text-white shadow-xl flex items-center justify-center hover:scale-105 transition">
      <Bot size={26} />
    </button>
  );
}

export const _unused: ReactNode = null;
