import { ListOrdered } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = [
  { value: "paid", label: "Baru" },
  { value: "processing", label: "Diproses" },
  { value: "completed", label: "Selesai" },
] as const

export function QueuePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Antrean"
        description="Pantau dan ubah status tiket seduh."
      />

      <Tabs defaultValue="paid">
        <TabsList className="w-full">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            <EmptyState
              icon={ListOrdered}
              title="Tidak ada tiket"
              description="Tiket muncul dari order berstatus lunas dan akan diperbarui otomatis."
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
