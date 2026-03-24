"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Tooltip,
} from "recharts"
import { useState } from "react"
import { BarChart3, PieChartIcon } from "lucide-react"
import type { Enseignant } from "@/lib/types"

interface SalaryChartProps {
  enseignants: Enseignant[]
}

const CHART_COLORS = [
  "#3b82f6",
  "#06b6d4",
  "#6366f1",
  "#0ea5e9",
  "#2563eb",
  "#0891b2",
  "#4f46e5",
  "#0284c7",
]

export function SalaryChart({ enseignants }: SalaryChartProps) {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar")

  const data = enseignants.map((e) => ({
    name: e.nom.length > 10 ? e.nom.slice(0, 10) + "..." : e.nom,
    fullName: e.nom,
    salaire: e.nbHeures * e.tauxHoraire,
  }))

  if (enseignants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <BarChart3 className="mb-3 h-10 w-10 opacity-30" />
        <p className="text-sm">Aucune donnee a afficher</p>
        <p className="text-xs mt-1">Ajoutez des enseignants pour voir le graphique</p>
      </div>
    )
  }

  return (
    <div className="px-4 pb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">
          {chartType === "bar" ? "Salaires par enseignant" : "Parts des salaires"}
        </h3>
        <div className="flex items-center rounded-lg bg-secondary p-0.5">
          <button
            onClick={() => setChartType("bar")}
            className={`flex h-7 w-8 items-center justify-center rounded-md transition-all ${
              chartType === "bar"
                ? "bg-card text-accent shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Graphique en barres"
          >
            <BarChart3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`flex h-7 w-8 items-center justify-center rounded-md transition-all ${
              chartType === "pie"
                ? "bg-card text-accent shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Graphique circulaire"
          >
            <PieChartIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-4">
        {chartType === "bar" ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(0 0% 45%)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(0 0% 45%)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "hsl(0 0% 95%)" }}
                contentStyle={{
                  backgroundColor: "hsl(0 0% 100%)",
                  border: "1px solid hsl(0 0% 90%)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  boxShadow: "0 4px 12px hsl(0 0% 0% / 0.1)",
                }}
                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                formatter={(value: number) => [`${value.toLocaleString("fr-FR")} Ar`, "Salaire"]}
                labelFormatter={(_: string, payload: Array<{ payload?: { fullName?: string } }>) => {
                  if (payload?.[0]?.payload?.fullName) return payload[0].payload.fullName;
                  return "";
                }}
              />
              <Bar dataKey="salaire" radius={[6, 6, 0, 0]} maxBarSize={45}>
                {data.map((_, index) => (
                  <Cell key={`bar-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={3}
                dataKey="salaire"
                nameKey="fullName"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={`pie-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0 0% 100%)",
                  border: "1px solid hsl(0 0% 90%)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  boxShadow: "0 4px 12px hsl(0 0% 0% / 0.1)",
                }}
                formatter={(value: number) => [`${value.toLocaleString("fr-FR")} Ar`, "Salaire"]}
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {chartType === "pie" && (
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            {data.map((item, index) => (
              <div key={`${item.fullName}-${index}`} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                />
                <span>{item.fullName}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
