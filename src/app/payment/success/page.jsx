import { Suspense } from "react";
import PaymentSuccessContent from "@/components/payment/PaymentSuccessContent";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f6f1ea] px-4 py-12 md:px-8">
          <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
            <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-semibold text-[#053c41]">
                Loading payment page...
              </p>
            </div>
          </section>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}