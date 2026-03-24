"use client"

import { TrendingDown, TrendingUp, Calculator } from "lucide-react"
import type { EnseignantStats } from "@/lib/types"

interface StatsFooterProps {
  stats: EnseignantStats | null
}

export function StatsFooter({ stats }: StatsFooterProps) {
  if (!stats) {
    return (
      <div className="border-t border-border bg-card px-4 py-5">
        <p className="text-center text-sm text-muted-foreground">
          Ajoutez des enseignants pour voir les statistiques
        </p>
      </div>
    )
  }

  return (
    <div className="border-t border-border bg-card px-4 py-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Statistiques Salaires
      </h3>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center rounded-xl bg-emerald-500/10 px-2 py-3">
          <TrendingDown className="mb-1 h-4 w-4 text-emerald-600" />
          <span className="text-[10px] uppercase tracking-wide text-emerald-600/80 font-medium">Min</span>
          <span className="mt-0.5 text-sm font-bold text-emerald-600">
            {stats.salaireMin.toLocaleString("fr-FR")}
          </span>
          <span className="text-[10px] text-emerald-600/60 truncate max-w-full px-1">
            {stats.enseignantMin}
          </span>
          <span className="text-[10px] text-emerald-600">Ar</span>
        </div>

        <div className="flex flex-col items-center rounded-xl bg-amber-500/10 px-2 py-3">
          <TrendingUp className="mb-1 h-4 w-4 text-amber-600" />
          <span className="text-[10px] uppercase tracking-wide text-amber-600/80 font-medium">Max</span>
          <span className="mt-0.5 text-sm font-bold text-amber-600">
            {stats.salaireMax.toLocaleString("fr-FR")}
          </span>
          <span className="text-[10px] text-amber-600/60 truncate max-w-full px-1">
            {stats.enseignantMax}
          </span>
          <span className="text-[10px] text-amber-600">Ar</span>
        </div>

        <div className="flex flex-col items-center rounded-xl bg-accent/10 px-2 py-3">
          <Calculator className="mb-1 h-4 w-4 text-accent" />
          <span className="text-[10px] uppercase tracking-wide text-accent/80 font-medium">Total</span>
          <span className="mt-0.5 text-sm font-bold text-accent">
            {stats.totalSalaires.toLocaleString("fr-FR")}
          </span>
          <span className="text-[10px] text-accent/60">Ar</span>
        </div>
      </div>
    </div>
  )
}
