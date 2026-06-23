import { BookOpen } from "@gravity-ui/icons";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f1ea] px-4">
      <section className="flex flex-col items-center text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#053c41] text-white shadow-xl">
          <BookOpen className="h-11 w-11" />

          <div className="absolute inset-0 rounded-[28px] border-4 border-[#AE7C54] border-t-transparent animate-spin" />
        </div>

        <h1 className="mt-6 text-2xl font-black text-[#053c41]">
          Loading Fable
        </h1>

        <p className="mt-2 max-w-sm text-sm font-medium text-[#053c41]/65">
          Please wait while we prepare your ebook experience.
        </p>
      </section>
    </main>
  );
}