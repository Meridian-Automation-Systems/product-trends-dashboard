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
    <form onSubmit={submit} className="flex w-full gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search a product keyword, e.g. 'cold plunge tub'"
        className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-brand"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
      >
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
