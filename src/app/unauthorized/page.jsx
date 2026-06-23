import Link from "next/link";
import { House, Ban } from "@gravity-ui/icons";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f1ea] px-4 py-10">
      <section className="w-full max-w-2xl rounded-[32px] border border-[#AE7C54]/25 bg-white p-8 text-center shadow-xl md:p-12">
       <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#C63C37]   text-white shadow-md">
  <Ban className="h-11 w-11" />
</div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-[#AE7C54]">
          Unauthorized Access
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight text-[#053c41] md:text-5xl">
          You are not allowed to view this page
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#053c41]/70">
          Your current account does not have permission to access this area.
          Please return to the home page or sign in with the correct account.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#AE7C54] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#053c41]"
        >
          <House className="h-5 w-5" />
          Back to Home
        </Link>
      </section>
    </main>
  );
}