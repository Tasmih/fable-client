"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { verifyWriterPayment } from "@/lib/actions/writer";
import * as Icons from "@gravity-ui/icons";

const ArrowIcon = Icons.ArrowLeft;
const CheckIcon = Icons.CircleCheck || Icons.Check;
const ShieldIcon = Icons.ShieldCheck || Icons.CircleCheck;

const IconView = ({ icon: Icon, className }) => {
  if (!Icon) return null;

  return <Icon className={className} />;
};

export default function WriterVerifySuccessPage() {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        toast.error("session id is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        await verifyWriterPayment(sessionId);
        setVerified(true);

        toast.success("writer verified successfully");
      } catch (err) {
        toast.error(err.message || "failed to verify writer payment");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#AE7C54]/20 border-t-[#AE7C54]" />

          <h1 className="mt-5 text-2xl font-bold text-[#053c41]">
            Verifying payment...
          </h1>

          <p className="mt-2 text-sm text-[#053c41]/70">
            Please wait while we verify your writer account.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-sm">
        {verified ? (
          <>
            <IconView icon={CheckIcon} className="mx-auto h-16 w-16 text-[#AE7C54]" />

            <h1 className="mt-5 text-3xl font-bold text-[#053c41]">
              Writer account verified
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#053c41]/70">
              Your writer access is now active. You can upload and manage your
              ebooks from the writer dashboard.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/dashboard/writer/addEbook"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
              >
                <IconView icon={ShieldIcon} className="h-4 w-4" />
                Add Ebook
              </Link>

              <Link
                href="/dashboard/writer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 px-5 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
              >
                <IconView icon={ArrowIcon} className="h-4 w-4" />
                Writer Dashboard
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-[#053c41]">
              Verification failed
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#053c41]/70">
              We could not verify your payment. Please try again from the writer
              verification page.
            </p>

            <Link
              href="/dashboard/writer/verify"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
            >
              Try Again
            </Link>
          </>
        )}
      </section>
    </main>
  );
}