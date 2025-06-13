"use client"

import { AlertCircle, X } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ErrorFeedbackProps {
  error: Error | string | null
  onDismiss?: () => void
  className?: string
  autoDismiss?: boolean
  dismissTimeout?: number
}

export function ErrorFeedback({
  error,
  onDismiss,
  className,
  autoDismiss = true,
  dismissTimeout = 5000,
}: ErrorFeedbackProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (error) {
      setIsVisible(true)
      if (autoDismiss) {
        const timer = setTimeout(() => {
          setIsVisible(false)
          onDismiss?.()
        }, dismissTimeout)
        return () => clearTimeout(timer)
      }
    } else {
      setIsVisible(false)
    }
  }, [error, autoDismiss, dismissTimeout, onDismiss])

  if (!error || !isVisible) return null

  const errorMessage = typeof error === "string" ? error : error.message

  return (
    <div
      className={cn(
        "p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 flex items-start gap-2",
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium">Erro</p>
        <p className="text-sm">{errorMessage}</p>
      </div>
      {onDismiss && (
        <button
          onClick={() => {
            setIsVisible(false)
            onDismiss()
          }}
          className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
          aria-label="Fechar mensagem de erro"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
} 