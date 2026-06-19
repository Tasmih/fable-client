"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Home,
  Loader2,
  ReceiptText,
  XCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const hasCalled = useRef(false);

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      if (hasCalled.current) return;
      hasCalled.current = true;

      if (!sessionId) {
        toast.error("Payment session id not found");
        setError("payment session id not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${API_URL}/api/payment/success?session_id=${encodeURIComponent(
            sessionId
          )}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "payment verification failed");
        }

        setPaymentData(data);

        if (data?.alreadyProcessed) {
          toast.info("Purchase already saved.");
        } else {
          toast.success("Payment successful! Ebook unlocked.");
        }
      } catch (err) {
        toast.error(err.message || "Payment verification failed");
        setError(err.message || "payment verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea] px-4 py-12 md:px-8">
        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-3xl border border-[#053c41]/10 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#053c41] text-white">
              <Loader2 size={28} className="animate-spin" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#053c41]">
              Verifying your payment
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#053c41]/70">
              Please wait. We are confirming your purchase and unlocking your
              ebook.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f6f1ea] px-4 py-12 md:px-8">
        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <XCircle size={30} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#053c41]">
              Payment verification failed
            </h1>

            <p className="mt-2 text-sm leading-6 text-red-500">{error}</p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/ebooks"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
              >
                <BookOpen size={16} />
                Browse Ebooks
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 bg-white px-5 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
              >
                <Home size={16} />
                Go Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea] px-4 py-12 md:px-8">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-[#053c41]/10 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#053c41] text-white">
            <CheckCircle2 size={32} />
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#AE7C54]">
            payment successful
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#053c41] md:text-4xl">
            Your ebook is unlocked
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#053c41]/70">
            Your purchase has been saved successfully. You can now read the full
            content of this ebook from the details page.
          </p>

          <div className="mt-6 rounded-2xl bg-[#f6f1ea] p-5 text-left">
            <div className="flex items-center gap-2 text-[#053c41]">
              <ReceiptText size={18} className="text-[#AE7C54]" />
              <h2 className="font-bold">Purchase Summary</h2>
            </div>

            <div className="mt-4 space-y-2 text-sm text-[#053c41]/80">
              <p>
                Ebook:{" "}
                <span className="font-semibold text-[#053c41]">
                  {paymentData?.ebookTitle || "Purchased Ebook"}
                </span>
              </p>

              <p>
                Amount:{" "}
                <span className="font-semibold text-[#AE7C54]">
                  ${paymentData?.amount || 0}
                </span>
              </p>

              <p className="break-all">
                Transaction:{" "}
                <span className="font-semibold text-[#053c41]">
                  {paymentData?.transactionId || "saved"}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={`/ebooks/${paymentData?.ebookId}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
            >
              Read Ebook
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/ebooks"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
            >
              <BookOpen size={16} />
              Browse More
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 bg-white px-5 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
            >
              <Home size={16} />
              Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}