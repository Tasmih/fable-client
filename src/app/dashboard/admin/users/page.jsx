"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import {
  deleteAdminUser,
  getAdminUsers,
  updateAdminUserRole,
} from "@/lib/actions/admin";
import {
  Home,
  Loader2,
  ShieldCheck,
  Trash2,
  UserCog,
  UserRound,
} from "lucide-react";

export default function AdminUsersPage() {
  const { data: session, isPending } = useSession();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");

  const adminEmail = session?.user?.email || "";

  const loadUsers = async () => {
    if (!adminEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getAdminUsers(adminEmail);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || "failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;
    loadUsers();
  }, [isPending, adminEmail]);

  const handleRoleChange = async (userId, role) => {
    try {
      setWorkingId(userId);
      await updateAdminUserRole(userId, adminEmail, role);
      toast.success("user role updated successfully");
      loadUsers();
    } catch (err) {
      toast.error(err.message || "failed to update role");
    } finally {
      setWorkingId("");
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (userEmail === adminEmail) {
      toast.error("you cannot delete yourself");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      setWorkingId(userId);
      await deleteAdminUser(userId, adminEmail);
      toast.success("user deleted successfully");
      setUsers((prev) => prev.filter((item) => item._id !== userId));
    } catch (err) {
      toast.error(err.message || "failed to delete user");
    } finally {
      setWorkingId("");
    }
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
      <main className="min-h-screen max-w-full overflow-x-hidden bg-[#f6f1ea] px-4 py-4 md:px-6">
        <section className="mx-auto w-full max-w-7xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <Loader2 size={38} className="mx-auto animate-spin text-[#AE7C54]" />
          <p className="mt-3 text-sm font-semibold text-[#053c41]">
            Loading users...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-full overflow-x-hidden bg-[#f6f1ea] px-4 py-4 md:px-6">
      <section className="mx-auto w-full max-w-7xl overflow-x-hidden">
        <div className="mb-4 rounded-3xl bg-[#053c41] p-4 text-white shadow-sm md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#f6f1ea]">
                <UserCog size={16} />
                Manage Users
              </div>

              <h1 className="text-2xl font-bold text-white md:text-3xl">
                Admin Users Control
              </h1>

              <p className="mt-1 text-sm leading-6 text-white/75">
                View users, change roles, verify writers, and remove accounts.
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
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#053c41]">
                All Users
              </h2>
              <p className="mt-1 text-sm text-[#053c41]/60">
                Total users found: {users.length}
              </p>
            </div>
          </div>

          <div className="hidden rounded-2xl bg-[#053c41] px-4 py-3 text-sm font-bold text-white lg:grid lg:grid-cols-[1.3fr_1.6fr_0.8fr_1fr_1fr_0.8fr] lg:gap-3">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div>Writer Status</div>
            <div>Joined</div>
            <div>Action</div>
          </div>

          {users.length === 0 ? (
            <div className="py-12 text-center">
              <UserRound size={44} className="mx-auto text-[#AE7C54]" />
              <h3 className="mt-3 text-xl font-bold text-[#053c41]">
                No users found
              </h3>
              <p className="mt-1 text-sm text-[#053c41]/60">
                Users will appear here after registration.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {users.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-[#053c41]/10 bg-[#fdfcfb] p-4"
                >
                  <div className="hidden min-w-0 grid-cols-[1.3fr_1.6fr_0.8fr_1fr_1fr_0.8fr] items-center gap-3 text-sm lg:grid">
                    <div className="flex min-w-0 items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || "User"}
                          referrerPolicy="no-referrer"
                          className="h-10 w-10 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#AE7C54] text-sm font-bold text-white">
                          {(item.name || "U").charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-bold text-[#053c41]">
                          {item.name || "No Name"}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-0 truncate text-[#053c41]/70">
                      {item.email || "N/A"}
                    </div>

                    <div>
                      <select
                        value={item.role || "user"}
                        disabled={workingId === item._id}
                        onChange={(event) =>
                          handleRoleChange(item._id, event.target.value)
                        }
                        className="w-full rounded-xl border border-[#053c41]/15 bg-white px-3 py-2 text-sm font-semibold text-[#053c41] outline-none focus:border-[#AE7C54]"
                      >
                        <option value="user">user</option>
                        <option value="writer">writer</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>

                    <div>
                      {item.writerVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
                          <ShieldCheck size={13} />
                          Verified
                        </span>
                      ) : (
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase text-orange-700">
                          Not Verified
                        </span>
                      )}
                    </div>

                    <div className="truncate text-[#053c41]/70">
                      {formatDate(item.createdAt)}
                    </div>

                    <button
                      type="button"
                      disabled={workingId === item._id}
                      onClick={() => handleDeleteUser(item._id, item.email)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>

                  <div className="lg:hidden">
                    <div className="flex min-w-0 items-start gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || "User"}
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#AE7C54] text-base font-bold text-white">
                          {(item.name || "U").charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold text-[#053c41]">
                          {item.name || "No Name"}
                        </h3>
                        <p className="truncate text-sm text-[#053c41]/70">
                          {item.email || "N/A"}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#f6f1ea] px-3 py-1 text-xs font-bold uppercase text-[#053c41]">
                            {item.role || "user"}
                          </span>

                          {item.writerVerified ? (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
                              Verified
                            </span>
                          ) : (
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase text-orange-700">
                              Not Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <select
                        value={item.role || "user"}
                        disabled={workingId === item._id}
                        onChange={(event) =>
                          handleRoleChange(item._id, event.target.value)
                        }
                        className="w-full rounded-xl border border-[#053c41]/15 bg-white px-3 py-3 text-sm font-semibold text-[#053c41] outline-none focus:border-[#AE7C54]"
                      >
                        <option value="user">user</option>
                        <option value="writer">writer</option>
                        <option value="admin">admin</option>
                      </select>

                      <button
                        type="button"
                        disabled={workingId === item._id}
                        onClick={() => handleDeleteUser(item._id, item.email)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>

                    <p className="mt-3 text-xs text-[#053c41]/50">
                      Joined: {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}