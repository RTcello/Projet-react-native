"use client"

import { Pencil, Trash2, User, Clock, Hash } from "lucide-react"
import type { Enseignant } from "@/lib/types"

interface TeacherCardProps {
  enseignant: Enseignant
  onEdit: (enseignant: Enseignant) => void
  onDelete: (id: string) => void
}

export function TeacherCard({ enseignant, onEdit, onDelete }: TeacherCardProps) {
  const salaire = (typeof enseignant.nbHeures === 'number' ? enseignant.nbHeures : parseFloat(enseignant.nbHeures)) * 
                  (typeof enseignant.tauxHoraire === 'number' ? enseignant.tauxHoraire : parseFloat(enseignant.tauxHoraire))

  return (
    <div className="group relative bg-card rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-lg hover:border-accent/40 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-card-foreground truncate text-base leading-tight">
              {enseignant.nom}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Hash className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">
                {enseignant.numens}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(enseignant)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
            aria-label={`Modifier ${enseignant.nom}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(enseignant.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            aria-label={`Supprimer ${enseignant.nom}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center rounded-lg bg-secondary/60 px-2 py-2">
          <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
            <Clock className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-wider font-medium">Heures</span>
          </div>
          <span className="text-sm font-semibold text-card-foreground">
            {typeof enseignant.nbHeures === 'number' ? enseignant.nbHeures : parseFloat(enseignant.nbHeures)}h
          </span>
        </div>

        <div className="flex flex-col items-center rounded-lg bg-secondary/60 px-2 py-2">
          <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
            <span className="text-[10px] uppercase tracking-wider font-medium">Taux</span>
          </div>
          <span className="text-sm font-semibold text-card-foreground">
            💰 {typeof enseignant.tauxHoraire === 'number' ? enseignant.tauxHoraire.toFixed(0) : enseignant.tauxHoraire} Ar
          </span>
        </div>

        <div className="flex flex-col items-center rounded-lg bg-accent/10 px-2 py-2">
          <span className="text-[10px] uppercase tracking-wider font-medium text-accent mb-0.5">
            Salaire
          </span>
          <span className="text-sm font-bold text-accent">
            {salaire.toLocaleString("fr-FR")} Ar
          </span>
        </div>
      </div>
    </div>
  )
}
