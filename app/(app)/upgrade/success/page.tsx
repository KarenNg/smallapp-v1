import Link from "next/link";

export default function UpgradeSuccessPage() {
  return (
    <main className="max-w-lg mx-auto p-8 space-y-6 text-center">
      <div className="text-5xl">🎉</div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">You&apos;re on Pro!</h1>
        <p className="text-neutral-600">
          Payment confirmed. You can now add unlimited leads and log unlimited touchpoints.
        </p>
      </div>
      <Link
        href="/leads"
        className="inline-block rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Back to Leads →
      </Link>
    </main>
  );
}
