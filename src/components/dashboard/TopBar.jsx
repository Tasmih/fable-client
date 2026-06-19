export default function Topbar({ user }) {
  if (!user) {
    return (
      <header className="h-16 bg-white border-b flex items-center px-6">
        Loading...
      </header>
    );
  }

  return (
    <header className="h-16 bg-[#F7F5F2] border-b flex items-center justify-between px-6 text-[#1C1C1C]">

      <div>
        <h2 className="text-lg font-semibold">
          Welcome, {user.name || "User"}
        </h2>
        <p className="text-xs text-gray-500 capitalize">
          {user.role} Dashboard
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">{user.email}</p>
          <p className="text-xs text-gray-500">Active</p>
        </div>

        <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
          {user?.name?.charAt(0) || "U"}
        </div>
      </div>

    </header>
  );
}