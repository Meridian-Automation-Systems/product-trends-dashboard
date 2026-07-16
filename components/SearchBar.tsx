"use client";

import { useState } from "react";

export default function SearchBar({
  onSearch,
  loading,
}: {
  onSearch: (keyword: string) => void;
  loading: boolean;
}) {
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const keyword = value.trim();
    if (keyword) onSearch(keyword);
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-[860px] gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={"Try 'cold plunge tub' — or any product idea"}
        className="h-12 min-w-0 flex-1 border border-divider bg-surface px-3.5 text-base text-ink caret-brand outline-none placeholder:text-ink/50 hover:border-ink/45 focus-visible:border-brand"
      />
      <button
        type="submit"
        disabled={loading}
        className="h-12 shrink-0 bg-brand px-6 text-[15px] font-extrabold text-paper transition hover:bg-brand-dark active:bg-brand-deep disabled:opacity-45"
      >
        {loading ? "Searching…" : "Search trends"}
      </button>
    </form>
  );
}
