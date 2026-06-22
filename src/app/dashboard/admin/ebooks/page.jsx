"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import {
  deleteAdminEbook,
  getAdminEbooks,
  updateAdminEbookStatus,
} from "@/lib/actions/admin";
import {
  BookOpen,
  Eye,
  EyeOff,
  Home,
  Loader2,
  ShieldCheck,
  Trash2,
} from "lucide-react";

export default function AdminEbooksPage() {
  const { data: session, isPending } = useSession();

  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");

  const adminEmail = session?.user?.email || "";

  const loadEbooks = async () => {
    if (!adminEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getAdminEbooks(adminEmail);
      setEbooks(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || "failed to load ebooks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;
    loadEbooks();
  }, [isPending, adminEmail]);

  const handleStatusChange = async (ebook) => {
    const nextStatus =
      ebook.status === "published" ? "unpublished" : "published";

    try {
      setWorkingId(ebook._id);
      await updateAdminEbookStatus(ebook._id, adminEmail, nextStatus);
      toast.success(`ebook ${nextStatus} successfully`);
      loadEbooks();
    } catch (err) {
      toast.error(err.message || "failed to update ebook status");
    } finally {
      setWorkingId("");
    }
  };

  const handleDelete = async (ebookId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ebook?"
    );

    if (!confirmDelete) return;

    try {
      setWorkingId(ebookId);
      await deleteAdminEbook(ebookId, adminEmail);
      toast.success("ebook deleted successfully");
      setEbooks((prev) => prev.filter((item) => item._id !== ebookId));
    } catch (err) {
      toast.error(err.message || "failed to delete ebook");
    } finally {
      setWorkingId("");
    }
  };

  const formatMoney = (amount) => {
    return "$" + Number(amount || 0).toFixed(2);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isPending || loading) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#f6f1ea] px-4 py-4 md:px-6">
        <section className="mx-auto w-full max-w-7xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <Loader2 size={38} className="mx-auto animate-spin text-[#AE7C54]" />
          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading ebooks...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f1ea] px-4 py-4 md:px-6">
      <section className="mx-auto w-full max-w-7xl overflow-x-hidden">
        <div className="mb-4 rounded-3xl bg-[#053c41] p-4 text-white shadow-sm md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#f6f1ea]">
                <BookOpen size={16} />
                Manage All Ebooks
              </div>

              <h1 className="text-2xl font-bold text-white md:text-3xl">
                Admin Ebook Control
              </h1>

              <p className="mt-1 text-sm leading-6 text-white/75">
                Publish, unpublish, view, and delete ebooks from the platform.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
            >
              <Home size={16} />
              Go Home
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm md:p-5">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-[#053c41]">All Ebooks</h2>
            <p className="mt-1 text-sm text-[#053c41]/60">
              Total ebooks found: {ebooks.length}
            </p>
          </div>

          {ebooks.length === 0 ? (
            <div className="py-12 text-center">
              <BookOpen size={46} className="mx-auto text-[#AE7C54]" />
              <h3 className="mt-3 text-xl font-bold text-[#053c41]">
                No ebooks found
              </h3>
              <p className="mt-1 text-sm text-[#053c41]/60">
                Ebooks will appear here after writers upload them.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {ebooks.map((ebook) => {
                const isPublished = ebook.status === "published";

                return (
                  <div
                    key={ebook._id}
                    className="rounded-2xl border border-[#053c41]/10 bg-[#fdfcfb] p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 gap-4">
                        {ebook.coverImage ? (
                          <img
                            src={ebook.coverImage}
                            alt={ebook.title}
                            className="h-24 w-16 shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-xl bg-[#f6f1ea]">
                            <BookOpen size={24} className="text-[#AE7C54]" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-[#053c41]">
                            {ebook.title || "Untitled Ebook"}
                          </h3>

                          <p className="mt-1 truncate text-sm text-[#053c41]/70">
                            Writer: {ebook.writerName || "Unknown Writer"}
                          </p>

                          <p className="mt-1 truncate text-sm text-[#053c41]/70">
                            {ebook.writerEmail || "N/A"}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-[#f6f1ea] px-3 py-1 text-xs font-bold uppercase text-[#053c41]">
                              {ebook.genre || "No Genre"}
                            </span>

                            <span className="rounded-full bg-[#f6f1ea] px-3 py-1 text-xs font-bold text-[#AE7C54]">
                              {formatMoney(ebook.price)}
                            </span>

                            <span
                              className={
                                isPublished
                                  ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700"
                                  : "rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase text-orange-700"
                              }
                            >
                              {ebook.status || "unpublished"}
                            </span>

                            <span className="rounded-full bg-[#f6f1ea] px-3 py-1 text-xs font-bold text-[#053c41]/70">
                              {formatDate(ebook.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[360px]">
                        <Link
                        href={`/ebooks/${ebook._id}?from=admin-ebooks`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/15 bg-white px-4 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
                        >
                          <Eye size={15} />
                          View
                        </Link>

                        <button
                          type="button"
                          disabled={workingId === ebook._id}
                          onClick={() => handleStatusChange(ebook)}
                          className={
                            isPublished
                              ? "inline-flex items-center justify-center gap-2 rounded-xl bg-orange-100 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                              : "inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                          }
                        >
                          {isPublished ? <EyeOff size={15} /> : <ShieldCheck size={15} />}
                          {isPublished ? "Unpublish" : "Publish"}
                        </button>

                        <button
                          type="button"
                          disabled={workingId === ebook._id}
                          onClick={() => handleDelete(ebook._id)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}