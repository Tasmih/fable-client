"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import {
  getWriterEbookById,
  updateWriterEbook,
} from "@/lib/actions/writer";
import WriterEbookForm from "@/components/dashboard/writer/WriterEbookForm";
import * as Icons from "@gravity-ui/icons";

const ArrowIcon = Icons.ArrowLeft;
const BookIcon = Icons.BookOpen || Icons.FileText;

const IconView = ({ icon: Icon, className }) => {
  if (!Icon) return null;

  return <Icon className={className} />;
};

export default function EditEbookPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const ebookId = params?.id;
  const userEmail = session?.user?.email || "";

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isPending) return;

    const loadEbook = async () => {
      if (!ebookId || !userEmail) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getWriterEbookById(ebookId, userEmail);
        setEbook(data);
      } catch (err) {
        toast.error(err.message || "failed to load ebook");
      } finally {
        setLoading(false);
      }
    };

    loadEbook();
  }, [isPending, ebookId, userEmail]);

  const handleUpdateEbook = async (ebookData) => {
    try {
      setSubmitting(true);

      await updateWriterEbook(ebookId, userEmail, ebookData);

      toast.success("ebook updated successfully");
      router.push("/dashboard/writer/manageEbooks");
    } catch (err) {
      toast.error(err.message || "failed to update ebook");
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
            Loading ebook...
          </p>
        </section>
      </main>
    );
  }

  if (!ebook) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <IconView
            icon={BookIcon}
            className="mx-auto h-14 w-14 text-[#AE7C54]"
          />

          <h1 className="mt-4 text-3xl font-bold text-[#053c41]">
            Ebook not found
          </h1>

          <Link
            href="/dashboard/writer/manageEbooks"
            className="mt-5 inline-flex rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Manage Ebooks
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
          mode="edit"
          initialData={ebook}
          onSubmit={handleUpdateEbook}
          submitting={submitting}
        />
      </section>
    </main>
  );
}