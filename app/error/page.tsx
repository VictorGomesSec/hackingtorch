"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const errorType = searchParams.get("type")

  const getErrorMessage = () => {
    switch (errorType) {
      case "timeout":
        return "O servidor demorou muito para responder. Por favor, tente novamente."
      case "auth":
        return "Erro de autenticação. Por favor, faça login novamente."
      default:
        return "Ocorreu um erro inesperado. Por favor, tente novamente."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Ops! Algo deu errado
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {getErrorMessage()}
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Voltar para a página inicial
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  )
}
