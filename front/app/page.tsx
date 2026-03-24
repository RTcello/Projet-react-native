"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Plus, Users, BarChart3, Search, GraduationCap } from "lucide-react"
import { TeacherCard } from "@/components/teacher-card"
import { TeacherForm } from "@/components/teacher-form"
import { StatsFooter } from "@/components/stats-footer"
import { SalaryChart } from "@/components/salary-chart"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { enseignantsAPI, type EnseignantAPI } from "@/lib/api"
import type { Enseignant, EnseignantStats } from "@/lib/types"

const mapAPIToEnseignant = (apiData: EnseignantAPI): Enseignant => ({
  id: apiData.numens.toString(),
  numens: apiData.numens,
  nom: apiData.nom,
  nbHeures: apiData.nbheures,
  tauxHoraire: apiData.tauxHoraire,
})

const mapEnseignantToAPI = (enseignant: Omit<Enseignant, 'id'>): Omit<EnseignantAPI, 'numens'> => ({
  nom: enseignant.nom,
  nbheures: enseignant.nbHeures,
  tauxHoraire: enseignant.tauxHoraire,
})

export default function Page() {
  const [enseignants, setEnseignants] = useState<Enseignant[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"list" | "chart">("list")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Enseignant | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Charger les données depuis l'API
  const loadEnseignants = useCallback(async () => {
    try {
      setLoading(true)
      const response = await enseignantsAPI.getAll()
      const mappedData = response.data.map(mapAPIToEnseignant)
      setEnseignants(mappedData)
    } catch (error) {
      console.error('Erreur lors du chargement des enseignants:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEnseignants()
  }, [loadEnseignants])

  const filteredEnseignants = useMemo(() => {
    if (!searchQuery.trim()) return enseignants
    const q = searchQuery.toLowerCase()
    return enseignants.filter(
      (e) =>
        e.nom.toLowerCase().includes(q) ||
        e.numens.toString().includes(q)
    )
  }, [enseignants, searchQuery])

  const stats: EnseignantStats | null = useMemo(() => {
    if (enseignants.length === 0) return null

    const salaires = enseignants.map((e) => ({
      nom: e.nom,
      salaire: e.nbHeures * e.tauxHoraire,
    }))

    const minEntry = salaires.reduce((min, s) => (s.salaire < min.salaire ? s : min))
    const maxEntry = salaires.reduce((max, s) => (s.salaire > max.salaire ? s : max))

    return {
      salaireMin: minEntry.salaire,
      salaireMax: maxEntry.salaire,
      totalSalaires: salaires.reduce((sum, s) => sum + s.salaire, 0),
      enseignantMin: minEntry.nom,
      enseignantMax: maxEntry.nom,
    }
  }, [enseignants])

  const handleSave = useCallback(async (data: Omit<Enseignant, "id"> | Enseignant) => {
    try {
      if ("id" in data) {
        // Modification
        const apiData = mapEnseignantToAPI(data)
        await enseignantsAPI.update(parseInt(data.id), apiData)
        setEnseignants((prev) =>
          prev.map((e) => (e.id === data.id ? (data as Enseignant) : e))
        )
      } else {
        // Ajout
        const apiData = mapEnseignantToAPI(data)
        const response = await enseignantsAPI.create(apiData)
        const newTeacher = mapAPIToEnseignant(response.data)
        setEnseignants((prev) => [...prev, newTeacher])
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }, [])

  const handleEdit = useCallback((enseignant: Enseignant) => {
    setEditingTeacher(enseignant)
    setIsFormOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteId) {
      try {
        await enseignantsAPI.delete(parseInt(deleteId))
        setEnseignants((prev) => prev.filter((e) => e.id !== deleteId))
        setDeleteId(null)
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }, [deleteId])

  const deletingTeacher = enseignants.find((e) => e.id === deleteId)

  return (
    <div className="flex min-h-screen items-start justify-center bg-background p-4 sm:py-8">
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl sm:max-h-[85vh]">
        {/* Header */}
        <header className="shrink-0 border-b border-border bg-primary px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/15">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary-foreground leading-tight">
                Gestion Enseignants
              </h1>
              <p className="text-xs text-primary-foreground/60">
                {enseignants.length} enseignant{enseignants.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="shrink-0 flex border-b border-border bg-card">
          <button
            onClick={() => setActiveTab("list")}
            className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === "list"
                ? "border-b-2 border-accent text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            Liste
          </button>
          <button
            onClick={() => setActiveTab("chart")}
            className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === "chart"
                ? "border-b-2 border-accent text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Graphiques
          </button>
        </nav>

        {/* Content */}
        {activeTab === "list" ? (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Search */}
            <div className="shrink-0 px-4 pt-3 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom ou N°..."
                  className="w-full rounded-lg border border-border bg-secondary/50 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Teacher List */}
            <div className="flex-1 overflow-y-auto px-4 py-2" role="list" aria-label="Liste des enseignants">
              {filteredEnseignants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Users className="mb-3 h-10 w-10 opacity-30" />
                  <p className="text-sm font-medium">
                    {searchQuery ? "Aucun resultat" : "Aucun enseignant"}
                  </p>
                  <p className="text-xs mt-1">
                    {searchQuery ? "Essayez un autre terme" : "Commencez par ajouter un enseignant"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-2">
                  {filteredEnseignants.map((enseignant) => (
                    <div key={enseignant.id} role="listitem">
                      <TeacherCard
                        enseignant={enseignant}
                        onEdit={handleEdit}
                        onDelete={(id) => setDeleteId(id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats Footer - Sticky */}
            <div className="shrink-0">
              <StatsFooter stats={stats} />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4">
            <SalaryChart enseignants={enseignants} />
          </div>
        )}

        {/* FAB */}
        {activeTab === "list" && (
          <button
            onClick={() => {
              setEditingTeacher(null)
              setIsFormOpen(true)
            }}
            className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-accent/40 active:scale-95 sm:absolute sm:bottom-24 sm:right-4"
            aria-label="Ajouter un enseignant"
          >
            <Plus className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Modals */}
      <TeacherForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingTeacher(null)
        }}
        onSave={handleSave}
        editingTeacher={editingTeacher}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Supprimer l'enseignant"
        message={
          deletingTeacher
            ? `Voulez-vous vraiment supprimer ${deletingTeacher.nom} ?`
            : ""
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
