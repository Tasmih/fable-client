export default function Topbar({ user }) {
  if (!user) {
    return (
      <header className="h-16 bg-white border-b flex items-center px-6">
        Loading...
      </header>
    );
  }

  return (
    /* Added fade-in and slide-down motion to the header container */
    <header className="h-10 bg-[#F7F5F2] border-b flex items-center justify-between px-6 text-[#1C1C1C] animate-in fade-in slide-in-from-top-3 duration-500 ease-out">

      {/* Left side text section with smooth scaling on group hover */}
      <div className="group transition-transform duration-300">
        <h2 className="text-lg font-semibold transition-colors duration-300 group-hover:text-[#AE7C54]">
          Welcome, {user.name || "User"}
        </h2>
        <p className="text-xs text-gray-500 capitalize tracking-wide transition-transform duration-300 group-hover:translate-x-0.5">
          {user.role} Dashboard
        </p>
      </div>

      {/* Right side user details and avatar with hover pop animation */}
      <div className="flex items-center gap-3 group/avatar cursor-pointer">
        <div className="text-right">
          <p className="text-sm font-medium transition-colors duration-300 group-hover/avatar:text-[#AE7C54]">{user.email}</p>
          <div className="flex items-center justify-end gap-1.5">
            {/* Added a pulsing green dot to make 'Active' status look alive */}
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </div>

        {/* Avatar badge with bounce effect and dynamic hover glow */}
        <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold shadow-md transition-all duration-300 group-hover/avatar:scale-105 group-hover/avatar:rotate-6 group-hover/avatar:shadow-teal-600/20 active:scale-95">
          {user?.name?.charAt(0) || "U"}
        </div>
      </div>

    </header>
  );
}