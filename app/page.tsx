import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-brand">
          E-commerce research
        </p>
        <h1 className="text-4xl font-bold sm:text-6xl">
          Product Trends Dashboard
        </h1>
        <p className="mt-6 text-lg text-slate-400">
          Type a keyword and instantly pull live Google Trends data — interest
          over time, top regions, and rising searches — then ask the built-in AI
          assistant what it means for your store.
        </p>
        <Link
          href="/dashboard"
          className="mt-10 inline-block rounded-lg bg-brand px-8 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          Open the dashboard →
        </Link>
      </div>
    </main>
  );
}
