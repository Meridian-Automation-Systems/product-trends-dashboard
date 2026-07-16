import Link from "next/link";

const FEATURES = [
  {
    num: "01",
    title: "Search a keyword",
    copy: "Type any product idea \u2014 \u201ccold plunge tub\u201d, \u201csauna blanket\u201d \u2014 and we pull live Google Trends: six months of interest, the top regions, and the searches around it.",
  },
  {
    num: "02",
    title: "Read it at a glance",
    copy: "Four numbers and three charts, each explained in plain English. No \u201cmomentum\u201d without telling you what momentum is. Compare keywords side by side when you're choosing between products.",
  },
  {
    num: "03",
    title: "Ask the assistant",
    copy: "Every search comes with a written brief: is it climbing, is it seasonal, is it worth stocking. Then ask follow-ups \u2014 the assistant sits beside your results and answers from the data on screen, not from thin air.",
  },
];

const STATS = [
  { num: "3", label: "Data views per search" },
  { num: "0\u2013100", label: "One scale for everything" },
  { num: "60s", label: "From keyword to first insight" },
  { num: "1", label: "Analyst included" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <nav className="flex items-center gap-4 border-b-2 border-divider px-6 py-3 md:px-12">
        <span className="mr-auto text-lg font-extrabold">Product Trends</span>
        <a href="#how" className="text-sm text-ink no-underline hover:text-brand">
          How it works
        </a>
        <a
          href="#assistant"
          className="text-sm text-ink no-underline hover:text-brand"
        >
          The assistant
        </a>
        <Link
          href="/dashboard"
          className="bg-brand px-4 py-2 text-sm font-extrabold text-paper no-underline transition hover:bg-brand-dark"
        >
          Open the dashboard
        </Link>
      </nav>

      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <section className="pb-20 pt-24">
          <h1 className="-ml-[0.058em] text-[clamp(42px,6.2vw,84px)] font-extrabold leading-[1.06] tracking-[-0.02em]">
            <span className="block">Know what sells.</span>
            <span className="block">Before you stock it.</span>
          </h1>
          <p className="mt-9 max-w-[58ch] text-[17px] leading-7">
            Search any product keyword and get live Google Trends data \u2014
            interest over time, where demand lives, and what's rising. A
            built-in assistant reads the charts for you and answers the only
            question that matters: so what?
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="bg-brand px-4 py-2 text-sm font-extrabold text-paper no-underline transition hover:bg-brand-dark"
            >
              Open the dashboard
            </Link>
            <a
              href="#how"
              className="px-1 py-2 text-sm font-extrabold text-brand no-underline hover:bg-brand/10"
            >
              See how it works
            </a>
          </div>
        </section>

        <div className="h-0.5 bg-divider" />

        <section aria-label="By the numbers" className="py-16">
          <div className="grid grid-cols-2 gap-x-7 gap-y-10 md:grid-cols-[repeat(4,auto)] md:justify-between">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="-ml-[0.045em] text-5xl font-extrabold leading-[56px] text-brand">
                  {s.num}
                </p>
                <p className="mt-3 text-[13px] uppercase tracking-wider text-ink/70">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="h-0.5 bg-divider" />

        <section id="how" className="pb-16 pt-20">
          <span className="block text-[13px] uppercase tracking-wider text-brand-deep">
            How it works
          </span>
          {FEATURES.map((f, i) => (
            <div
              key={f.num}
              id={i === 2 ? "assistant" : undefined}
              className={`grid items-baseline gap-x-[clamp(24px,4vw,72px)] gap-y-7 py-10 md:grid-cols-[minmax(64px,160px)_minmax(0,420px)_minmax(0,1fr)] ${
                i > 0 ? "border-t-2 border-divider" : ""
              }`}
            >
              <p className="m-0 text-[15px] font-extrabold">
                <span className="mr-3.5 inline-block h-2.5 w-2.5 bg-brand" />
                {f.num}
              </p>
              <h2 className="m-0 text-2xl font-extrabold tracking-[-0.01em]">
                {f.title}
              </h2>
              <p className="m-0 max-w-[52ch] text-[15.5px] leading-7 text-ink/80">
                {f.copy}
              </p>
            </div>
          ))}
        </section>
      </div>

      <section className="bg-brand text-paper">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-12">
          <h3 className="-ml-[0.058em] text-[clamp(34px,4.2vw,56px)] font-extrabold leading-[1.06] tracking-[-0.015em]">
            <span className="block">Stop guessing.</span>
            <span className="block">Ask the assistant.</span>
          </h3>
          <div className="mt-10">
            <Link
              href="/dashboard"
              className="inline-block border border-paper px-3.5 py-2 text-sm font-extrabold text-paper no-underline transition hover:bg-paper/10"
            >
              Open the dashboard \u2014 it's one click
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <footer className="py-14 text-[13px] text-ink/70">
          Product Trends \u2014 live Google Trends research with a built-in
          analyst.
        </footer>
      </div>
    </main>
  );
}
