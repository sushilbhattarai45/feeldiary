import { Sparkles } from "lucide-react"

export function Header() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm flex-shrink-0">
      <div className="container mx-auto px-6 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-foreground font-[family-name:var(--font-cursive)]">
              Feel<span className="text-primary">Diary</span>
            </h1>
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
