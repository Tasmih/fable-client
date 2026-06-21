"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import {
  createWriterEbook,
  getWriterOverview,
} from "@/lib/actions/writer";
import WriterEbookForm from "@/components/dashboard/writer/WriterEbookForm";
import * as Icons from "@gravity-ui/icons";

const ArrowIcon = Icons.ArrowLeft;
const ShieldIcon = Icons.ShieldCheck || Icons.CircleCheck;

const IconView = ({ icon: Icon, className }) => {
  if (!Icon) return null;

  return <Icon className={className} />;
};

export default function AddEbookPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
        toast.error(err.message || "failed to load writer data");
      } finally {
        setLoading(false);
      }
    };

    loadWriter();
  }, [isPending, userEmail]);

  const handleAddEbook = async (ebookData) => {
    try {
      setSubmitting(true);

      await createWriterEbook({
        ...ebookData,
        writerName: overview?.writer?.name || session?.user?.name || "Writer",
        writerEmail: userEmail,
        writerId: overview?.writer?._id || session?.user?.id || "",
      });

      toast.success("ebook added successfully");
      router.push("/dashboard/writer/manageEbooks");
    } catch (err) {
      toast.error(err.message || "failed to add ebook");
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-7xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#AE7C54]/20 border-t-[#AE7C54]" />

          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading add ebook form...
          </p>
        </section>
      </main>
    );
  }

  if (!overview?.writerVerified) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <IconView
            icon={ShieldIcon}
            className="mx-auto h-14 w-14 text-[#AE7C54]"
          />

          <h1 className="mt-4 text-3xl font-bold text-[#053c41]">
            Writer verification required
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#053c41]/70">
            You need to complete one-time writer verification payment before
            adding ebooks.
          </p>

          <Link
            href="/dashboard/writer/verify"
            className="mt-6 inline-flex rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
          >
            Verify Now
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-5">
          <Link
            href="/dashboard/writer/manageEbooks"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/20 bg-white px-4 py-3 text-sm font-semibold text-[#053c41] shadow-sm transition hover:bg-[#053c41] hover:text-white"
          >
            <IconView icon={ArrowIcon} className="h-4 w-4" />
            Back to Manage Ebooks
          </Link>
        </div>

        <WriterEbookForm
          mode="add"
          onSubmit={handleAddEbook}
          submitting={submitting}
        />
      </section>
    </main>
  );
}