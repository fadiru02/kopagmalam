export function FullScreenLoader() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-lg font-extrabold text-primary-foreground">
        KM
      </div>
      <p className="text-sm font-medium text-muted-foreground">
        Memuat sesi…
      </p>
    </div>
  )
}
