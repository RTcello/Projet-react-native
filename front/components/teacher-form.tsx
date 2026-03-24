"use client"

import { useState, useEffect } from "react"
import { X, UserPlus, Save } from "lucide-react"
import type { Enseignant } from "@/lib/types"

interface TeacherFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Enseignant, "id"> | Enseignant) => void
  editingTeacher: Enseignant | null
}

export function TeacherForm({ isOpen, onClose, onSave, editingTeacher }: TeacherFormProps) {
  const [numEmp, setNumEmp] = useState("")
  const [nom, setNom] = useState("")
  const [nbHeures, setNbHeures] = useState("")
  const [tauxHoraire, setTauxHoraire] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingTeacher) {
      setNumEmp(editingTeacher.numens.toString())
      setNom(editingTeacher.nom)
      setNbHeures(editingTeacher.nbHeures.toString())
      setTauxHoraire(editingTeacher.tauxHoraire.toString())
    } else {
      resetForm()
    }
  }, [editingTeacher, isOpen])

  function resetForm() {
    setNumEmp("")
    setNom("")
    setNbHeures("")
    setTauxHoraire("")
    setErrors({})
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!numEmp.trim()) newErrors.numEmp = "Requis"
    if (!nom.trim()) newErrors.nom = "Requis"
    if (!nbHeures || Number(nbHeures) <= 0) newErrors.nbHeures = "Nombre > 0"
    if (!tauxHoraire || Number(tauxHoraire) <= 0) newErrors.tauxHoraire = "Nombre > 0"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const data = {
      numens: Number(numEmp.trim()),
      nom: nom.trim(),
      nbHeures: Number(nbHeures),
      tauxHoraire: Number(tauxHoraire),
    }

    if (editingTeacher) {
      onSave({ ...data, id: editingTeacher.id })
    } else {
      onSave(data)
    }

    resetForm()
    onClose()
  }

  const salaire = (Number(nbHeures) || 0) * (Number(tauxHoraire) || 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-50 w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-card border border-border shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
              {editingTeacher ? <Save className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            </div>
            <h2 className="text-lg font-semibold text-card-foreground">
              {editingTeacher ? "Modifier Enseignant" : "Nouvel Enseignant"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-card-foreground hover:bg-secondary transition-colors"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="numEmp" className="mb-1.5 block text-sm font-medium text-card-foreground">
                {"N\u00B0 Employ\u00E9"}
              </label>
              <input
                id="numEmp"
                type="text"
                value={numEmp}
                onChange={(e) => setNumEmp(e.target.value)}
                placeholder="EMP-001"
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
              />
              {errors.numEmp && <span className="mt-1 text-xs text-destructive">{errors.numEmp}</span>}
            </div>

            <div>
              <label htmlFor="nom" className="mb-1.5 block text-sm font-medium text-card-foreground">
                Nom complet
              </label>
              <input
                id="nom"
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ahmed Benali"
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
              />
              {errors.nom && <span className="mt-1 text-xs text-destructive">{errors.nom}</span>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="nbHeures" className="mb-1.5 block text-sm font-medium text-card-foreground">
                  {"Nb d'heures"}
                </label>
                <input
                  id="nbHeures"
                  type="number"
                  min="0"
                  value={nbHeures}
                  onChange={(e) => setNbHeures(e.target.value)}
                  placeholder="40"
                  className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                />
                {errors.nbHeures && <span className="mt-1 text-xs text-destructive">{errors.nbHeures}</span>}
              </div>

              <div>
                <label htmlFor="tauxHoraire" className="mb-1.5 block text-sm font-medium text-card-foreground">
                  Taux horaire (AR)
                </label>
                <input
                  id="tauxHoraire"
                  type="number"
                  min="0"
                  value={tauxHoraire}
                  onChange={(e) => setTauxHoraire(e.target.value)}
                  placeholder="250"
                  className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                />
                {errors.tauxHoraire && <span className="mt-1 text-xs text-destructive">{errors.tauxHoraire}</span>}
              </div>
            </div>
          </div>

          {salaire > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-accent/10 px-4 py-3">
              <span className="text-sm font-medium text-accent">Salaire estim&eacute;</span>
              <span className="text-lg font-bold text-accent">
                {salaire.toLocaleString("fr-FR")} AR
              </span>
            </div>
          )}

          <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            {editingTeacher ? "Enregistrer les modifications" : "Ajouter l'enseignant"}
          </button>
        </form>
      </div>
    </div>
  )
}
