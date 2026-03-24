"use client"

import { AlertTriangle } from "lucide-react"

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-50 w-full max-w-sm mx-4 rounded-2xl bg-card border border-border shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center px-6 pt-6 pb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground text-center">{message}</p>
        </div>
        <div className="flex gap-3 p-5">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-card-foreground hover:bg-secondary transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground hover:opacity-90 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}
