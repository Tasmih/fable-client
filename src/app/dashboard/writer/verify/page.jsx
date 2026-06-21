"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import {
  createWriterVerificationCheckout,
  getWriterOverview,
} from "@/lib/actions/writer";
import * as Icons from "@gravity-ui/icons";

const ArrowIcon = Icons.ArrowLeft;
const CheckIcon = Icons.CircleCheck || Icons.Check;
const CreditIcon = Icons.CreditCard || Icons.Receipt;
const ShieldIcon = Icons.ShieldCheck || Icons.CircleCheck;

const IconView = ({ icon: Icon, className }) => {
  if (!Icon) return null;

  return <Icon className={className} />;
};

export default function WriterVerifyPage() {
  const { data: session, isPending } = useSession();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const userEmail = session?.user?.email || "";

  useEffect(() => {
    if (isPending) return;

    const loadWriter = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getWriterOverview(userEmail);
        setOverview(data);
      } catch (err) {
        toast.error(err.message || "failed to load writer verification");
      } finally {
        setLoading(false);
      }
    };

    loadWriter();
  }, [isPending, userEmail]);

  const handleVerificationPayment = async () => {
    try {
      setPaying(true);

      const data = await createWriterVerificationCheckout(userEmail);

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      toast.error("payment url not found");
    } catch (err) {
      toast.error(err.message || "failed to start verification payment");
    } finally {
      setPaying(false);
    }
  };

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#AE7C54]/20 border-t-[#AE7C54]" />

          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading verification...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="mb-5">
          <Link
            href="/dashboard/writer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 bg-white px-4 py-3 text-sm font-semibold text-[#053c41] shadow-sm transition hover:bg-[#053c41] hover:text-white"
          >
            <IconView icon={ArrowIcon} className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#f6f1ea] px-4 py-2 text-sm font-semibold text-[#AE7C54]">
            <IconView icon={ShieldIcon} className="h-4 w-4" />
            Writer Verification
          </div>

          <h1 className="text-3xl font-bold text-[#053c41] md:text-4xl">
            Verify your writer account
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#053c41]/70">
            Writers need to complete a one-time verification payment before
            uploading and publishing ebooks on Fable.
          </p>

          {overview?.writerVerified ? (
            <div className="mt-8 rounded-3xl border border-[#AE7C54]/25 bg-[#f6f1ea] p-6">
              <IconView icon={CheckIcon} className="h-12 w-12 text-[#AE7C54]" />

              <h2 className="mt-4 text-2xl font-bold text-[#053c41]">
                Your account is verified
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#053c41]/70">
                You can now add, edit, publish, unpublish, and manage your own
                ebooks.
              </p>

              <Link
                href="/dashboard/writer/addEbook"
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
              >
                Add Ebook
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
              <div className="rounded-3xl bg-[#f6f1ea] p-6">
                <h2 className="text-2xl font-bold text-[#053c41]">
                  What you get after verification
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-white p-4">
                    <h3 className="font-bold text-[#053c41]">
                      Upload ebooks
                    </h3>

                    <p className="mt-1 text-sm text-[#053c41]/70">
                      Add ebook title, full content, price, genre, and cover
                      image.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <h3 className="font-bold text-[#053c41]">
                      Manage publishing
                    </h3>

                    <p className="mt-1 text-sm text-[#053c41]/70">
                      Publish, unpublish, edit, and delete your own ebooks.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <h3 className="font-bold text-[#053c41]">
                      Track sales
                    </h3>

                    <p className="mt-1 text-sm text-[#053c41]/70">
                      View buyer information, purchase date, and earning amount.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-[#053c41] p-6 text-white">
                <IconView icon={CreditIcon} className="h-12 w-12 text-[#AE7C54]" />

                <h2 className="mt-4 text-2xl font-bold">
                  One-time fee
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/70">
                  Complete secure Stripe payment to activate writer publishing
                  access.
                </p>

                <p className="mt-6 text-4xl font-bold">$10</p>

                <button
                  type="button"
                  onClick={handleVerificationPayment}
                  disabled={paying || !userEmail}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {paying ? "Redirecting..." : "Pay Verification Fee"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}