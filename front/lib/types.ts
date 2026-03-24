export interface Enseignant {
  id: string
  numens: number
  nom: string
  nbHeures: number
  tauxHoraire: number
}

export interface EnseignantStats {
  salaireMin: number
  salaireMax: number
  totalSalaires: number
  enseignantMin: string
  enseignantMax: string
}
