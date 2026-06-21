"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useSession } from "@/lib/auth-client";
import {
  deleteWriterEbook,
  getWriterEbooks,
  updateWriterEbookStatus,
} from "@/lib/actions/writer";

import {
  BookOpen,
  Plus,
  Eye,
  EyeSlash,
  Pencil,
  TrashBin,
} from "@gravity-ui/icons";

export default function ManageWriterEbooksPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");

  const userEmail = session?.user?.email || "";

  // writer action: load own ebooks
  const loadEbooks = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getWriterEbooks(userEmail);
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
  }, [isPending, userEmail]);

  const formatMoney = (amount) => {
    return "$" + Number(amount || 0).toFixed(2);
  };

  // writer action: edit ebook with modal
  const handleEdit = async (ebookId) => {
    const result = await Swal.fire({
      title: "Edit this ebook?",
      text: "You will go to the ebook edit page.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, edit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#AE7C54",
      cancelButtonColor: "#053c41",
    });

    if (result.isConfirmed) {
      router.push("/dashboard/writer/editEbook/" + ebookId);
    }
  };

  // writer action: publish or unpublish ebook
  const handleStatusChange = async (ebook) => {
    const nextStatus =
      ebook.status === "published" ? "unpublished" : "published";

    try {
      setWorkingId(ebook._id);

      await updateWriterEbookStatus(ebook._id, userEmail, nextStatus);

      toast.success("ebook " + nextStatus + " successfully");
      loadEbooks();
    } catch (err) {
      toast.error(err.message || "failed to update status");
    } finally {
      setWorkingId("");
    }
  };

  // writer action: delete ebook with modal
  const handleDelete = async (ebookId) => {
    const result = await Swal.fire({
      title: "Delete this ebook?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#053c41",
    });

    if (!result.isConfirmed) return;

    try {
      setWorkingId(ebookId);

      await deleteWriterEbook(ebookId, userEmail);

      await Swal.fire({
        title: "Deleted",
        text: "Ebook deleted successfully.",
        icon: "success",
        confirmButtonColor: "#053c41",
      });

      setEbooks((prev) => prev.filter((item) => item._id !== ebookId));
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "failed to delete ebook",
        icon: "error",
        confirmButtonColor: "#053c41",
      });
    } finally {
      setWorkingId("");
    }
  };

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
        <section className="mx-auto w-full max-w-6xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#AE7C54]/20 border-t-[#AE7C54]" />

          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading ebooks...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f1ea]/50 px-4 py-6 md:px-8">
      <section className="mx-auto w-full max-w-6xl">
        {/* header */}
        <div className="mb-5 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#f6f1ea] px-4 py-2 text-sm font-semibold text-[#AE7C54]">
              <BookOpen className="h-4 w-4" />
              Manage Ebooks
            </div>

            <h1 className="text-3xl font-bold text-[#053c41] md:text-4xl">
              Your Ebook Library
            </h1>

            <p className="mt-2 text-sm text-[#053c41]/70">
              Edit, delete, publish, and unpublish your own ebooks.
            </p>
          </div>

          <Link
            href="/dashboard/writer/addEbook"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c99367]"
          >
            <Plus className="h-4 w-4" />
            Add Ebook
          </Link>
        </div>

        {ebooks.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <BookOpen className="mx-auto h-14 w-14 text-[#AE7C54]" />

            <h2 className="mt-4 text-2xl font-bold text-[#053c41]">
              No ebooks added yet
            </h2>

            <p className="mt-2 text-sm text-[#053c41]/70">
              Start by adding your first ebook.
            </p>

            <Link
              href="/dashboard/writer/addEbook"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#053c41] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6f7a]"
            >
              <Plus className="h-4 w-4" />
              Add Ebook
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {ebooks.map((ebook) => {
              const isPublished = ebook.status === "published";

              return (
                <div
                  key={ebook._id}
                  className="rounded-3xl bg-white p-5 shadow-sm md:p-6"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    {/* ebook details */}
                    <div className="flex min-w-0 flex-1 gap-4">
                      {ebook.coverImage ? (
                        <img
                          src={ebook.coverImage}
                          alt={ebook.title}
                          className="h-32 w-24 shrink-0 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-32 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#f6f1ea]">
                          <BookOpen className="h-8 w-8 text-[#AE7C54]" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="text-2xl font-bold text-[#053c41]">
                          {ebook.title}
                        </h3>

                        <p className="mt-1 text-base text-[#053c41]/60">
                          {ebook.genre || "No genre"}
                        </p>

                        {/* details */}
                        <div className="mt-4 flex flex-wrap gap-3">
                          {isPublished ? (
                            <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-2 text-sm font-bold uppercase text-emerald-700">
                              <Eye className="h-4 w-4" />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-xl bg-red-100 px-4 py-2 text-sm font-bold uppercase text-red-600">
                              <EyeSlash className="h-4 w-4" />
                              Unpublished
                            </span>
                          )}

                          <span className="rounded-xl bg-[#f6f1ea] px-4 py-2 text-sm font-bold text-[#053c41]">
                            Price: {formatMoney(ebook.price)}
                          </span>

                          <span className="rounded-xl bg-[#f6f1ea] px-4 py-2 text-sm font-bold text-[#053c41]">
                            Sales: {ebook.totalSales || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* actions */}
                    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[300px] xl:grid-cols-2">
                      <Link
                        href={"/ebooks/" + ebook._id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/15 px-4 py-3 text-sm font-semibold text-[#053c41] transition hover:bg-[#053c41] hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleEdit(ebook._id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#AE7C54]/25 px-4 py-3 text-sm font-semibold text-[#AE7C54] transition hover:bg-[#AE7C54] hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(ebook)}
                        disabled={workingId === ebook._id}
                        className={
                          isPublished
                            ? "inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            : "inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        }
                      >
                        {isPublished ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeSlash className="h-4 w-4" />
                        )}

                        {isPublished ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(ebook._id)}
                        disabled={workingId === ebook._id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <TrashBin className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}