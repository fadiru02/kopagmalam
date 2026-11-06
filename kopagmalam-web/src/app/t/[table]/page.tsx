import { Suspense } from "react";
import { TableEntryClient } from "./client";

export default function TableEntryPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<p className="text-sm text-zinc-600">Memuat…</p>}>
        <TableEntryClient />
      </Suspense>
    </main>
  );
}