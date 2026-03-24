import axios from 'axios'

const API_BASE_URL = 'http://192.168.184.242:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface EnseignantAPI {
  numens: number
  nom: string
  nbheures: number
  tauxHoraire: number 
}

export const enseignantsAPI = {
  getAll: () => api.get<EnseignantAPI[]>('/enseignants'),
  create: (data: Omit<EnseignantAPI, 'numens'>) => api.post<EnseignantAPI>('/enseignants', data),
  update: (id: number, data: Omit<EnseignantAPI, 'numens'>) => api.put<EnseignantAPI>(`/enseignants/${id}`, data),
  delete: (id: number) => api.delete(`/enseignants/${id}`),
}
