"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "@/lib/auth-client";
import { 
  loadAnalyticsAction, 
  loadUsersAction, 
  loadEbooksAction, 
  changeUserRoleAction, 
  toggleEbookStatusAction, 
  deleteEbookAction 
} from "../../../lib/actions/admin";

export default function AdminDashboard({ searchParams }) {
  // Unwrapping searchParams safely according to Next.js guidelines
  const resolvedParams = use(searchParams);
  const activeTab = resolvedParams?.tab || "overview";

  const { data: session } = useSession();
  
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const initDashboard = async () => {
    setLoading(true);
    const analyticsData = await loadAnalyticsAction();
    const usersData = await loadUsersAction();
    const ebooksData = await loadEbooksAction();

    setAnalytics(analyticsData);
    setUsers(usersData);
    setEbooks(ebooksData);
    setLoading(false);
  };

  useEffect(() => {
    initDashboard();
  }, []);

  const onRoleChange = async (userId, newRole) => {
    const success = await changeUserRoleAction(userId, newRole);
    if (success) {
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      alert("user role updated");
    }
  };

  const onToggleStatus = async (ebookId, currentStatus) => {
    const { ok, nextStatus } = await toggleEbookStatusAction(ebookId, currentStatus);
    if (ok) {
      setEbooks(ebooks.map(book => book._id === ebookId ? { ...book, status: nextStatus } : book));
      alert(`status changed to ${nextStatus}`);
    }
  };

  const onDeleteEbook = async (ebookId) => {
    if (!confirm("sure you want to delete?")) return;
    const success = await deleteEbookAction(ebookId);
    if (success) {
      setEbooks(ebooks.filter(book => book._id !== ebookId));
      alert("ebook deleted");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 uppercase">Admin Console ({activeTab})</h1>

      {/* RENDER STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white border rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Users</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{analytics?.totalUsers || 0}</p>
        </div>
        <div className="p-5 bg-white border rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Books Created</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{analytics?.totalEbooks || 0}</p>
        </div>
        <div className="p-5 bg-white border rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Books Sold</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{analytics?.totalSoldBooks || 0}</p>
        </div>
        <div className="p-5 bg-white border rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-teal-600 mt-1">${analytics?.totalRevenue || 0}</p>
        </div>
      </div>

      {/* DYNAMIC TAB CONTROLLER */}
      <div className="space-y-6">
        {/* OVERVIEW MODE: SHOW BOTH TABLES SIDE BY SIDE */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {renderUsersTable()}
            {renderEbooksTable()}
          </div>
        )}

        {/* USERS ONLY VIEW */}
        {activeTab === "users" && (
          <div className="w-full">{renderUsersTable()}</div>
        )}

        {/* EBOOKS ONLY VIEW */}
        {activeTab === "ebooks" && (
          <div className="w-full">{renderEbooksTable()}</div>
        )}
      </div>
    </div>
  );

  function renderUsersTable() {
    return (
      <div className="p-6 bg-white border rounded-xl shadow-sm overflow-hidden">
        <h2 className="font-semibold text-lg text-gray-800 mb-4">Manage System Users</h2>
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm text-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 font-medium">{user.name}</td>
                  <td className="p-3 text-gray-500">{user.email}</td>
                  <td className="p-3 text-center">
                    <select 
                      value={user.role} 
                      onChange={(e) => onRoleChange(user._id, e.target.value)}
                      className="text-xs bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none"
                    >
                      <option value="user">User</option>
                      <option value="writer">Writer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderEbooksTable() {
    return (
      <div className="p-6 bg-white border rounded-xl shadow-sm overflow-hidden">
        <h2 className="font-semibold text-lg text-gray-800 mb-4">Manage Platform Ebooks</h2>
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <th className="p-3">Title</th>
                <th className="p-3">Price</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm text-gray-700">
              {ebooks.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 font-medium max-w-[150px] truncate">{book.title}</td>
                  <td className="p-3 font-medium text-teal-600">${book.price}</td>
                  <td className="p-3 text-center space-x-2 whitespace-nowrap">
                    <button 
                      onClick={() => onToggleStatus(book._id, book.status)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition"
                    >
                      {book.status === "Available" ? "Unpublish" : "Publish"}
                    </button>
                    <button 
                      onClick={() => onDeleteEbook(book._id)}
                      className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}