export default function ErrorLoading() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-4 px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-gray-50" />
        <p className="text-lg text-gray-500 dark:text-gray-400">Carregando informações do erro...</p>
      </div>
    </div>
  )
}
