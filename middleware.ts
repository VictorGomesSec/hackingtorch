import { createMiddlewareSupabaseClient } from "@/utils/supabase/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { response, supabase } = createMiddlewareSupabaseClient(request)

  try {
    // Obtém a sessão atual
    const { data: { session } } = await supabase.auth.getSession()

    // Rotas protegidas que requerem autenticação
    const protectedRoutes = [
      "/dashboard",
      "/profile",
      "/settings",
      "/admin",
      "/event/team",
      "/event/submission",
      "/event/certificate",
    ]

    // Verifica se a rota atual requer autenticação
    const isProtectedRoute = protectedRoutes.some(
      (route) => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(`${route}/`),
    )

    // Se não houver sessão e a rota requer autenticação
    if (!session && isProtectedRoute) {
      const redirectUrl = new URL("/auth/login", request.url)
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Se houver sessão e a rota é de autenticação
    if (session && (request.nextUrl.pathname === "/auth/login" || request.nextUrl.pathname === "/auth/register")) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Verificar se o usuário é admin para rotas /admin
    if (session && request.nextUrl.pathname.startsWith("/admin")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", session.user.id)
        .single()

      // Se não for admin, redireciona para o dashboard
      if (profile?.user_type !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    return response
  } catch (error) {
    console.error("Erro no middleware:", error)
    return NextResponse.redirect(new URL("/error", request.url))
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/auth/login",
    "/auth/register",
    "/event/team/:path*",
    "/event/submission/:path*",
    "/event/certificate/:path*",
  ],
}
