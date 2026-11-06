"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export function TableEntryClient() {
  const params = useParams<{ table: string }>();
  const router = useRouter();
  const table = params?.table ?? "";

  useEffect(() => {
    if (!/^[A-Za-z0-9-]{1,20}$/.test(table)) {
      router.replace("/?error=invalid-table");
      return;
    }

    try {
      window.localStorage.setItem("kopagmalam.table_number", table);
    } catch {
      // ignore storage errors (private mode, etc.)
    }

    router.replace(`/?table=${encodeURIComponent(table)}`);
  }, [table, router]);

  return <p className="text-sm text-zinc-600">Membuka katalog untuk meja {table}…</p>;
}