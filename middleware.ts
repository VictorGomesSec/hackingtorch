import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'

// Rotas protegidas que requerem autenticação
const protectedRoutes = ['/dashboard', '/profile', '/settings']
const adminRoutes = ['/admin']

// Cache de sessão para reduzir chamadas ao Supabase
const sessionCache = new Map<string, { session: any, timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

// Função auxiliar para log formatado com categorias
function logDebug(category: string, message: string, data?: any) {
  const timestamp = new Date().toISOString()
  const requestId = Math.random().toString(36).substring(7)
  const emoji = {
    'REQUEST': '🌐',
    'AUTH': '🔐',
    'CACHE': '💾',
    'ROUTE': '🛣️',
    'REDIRECT': '↪️',
    'ERROR': '❌',
    'PERFORMANCE': '⚡',
    'STORAGE': '🗄️'
  }[category] || '📝'

  console.log(`[${timestamp}] ${emoji} ${category}: ${message}`)
  if (data) {
    console.log('📦 Dados:', JSON.stringify(data, null, 2))
  }
  return requestId
}

// Função para medir performance
function measurePerformance(label: string) {
  const start = performance.now()
  return {
    end: () => {
      const duration = performance.now() - start
      logDebug('PERFORMANCE', `${label}: ${duration.toFixed(2)}ms`)
      return duration
    }
  }
}

export async function middleware(request: NextRequest) {
  const requestId = logDebug('REQUEST', 'Iniciando requisição', {
    path: request.nextUrl.pathname,
    method: request.method,
    searchParams: Object.fromEntries(request.nextUrl.searchParams),
    headers: Object.fromEntries(request.headers),
    cookies: Object.fromEntries(request.cookies)
  })

  const perf = measurePerformance('Middleware Total')
  
  try {
    const res = NextResponse.next()
    
    // Configuração do cliente Supabase com storage personalizado
    const supabase = createMiddlewareClient({ req: request, res }) as SupabaseClient

    // Configuração do storage com persistência em cookies
    const storage = {
      getItem: (key: string) => {
        const cookie = request.cookies.get(key)
        logDebug('STORAGE', `getItem: ${key}`, { 
          exists: !!cookie,
          value: cookie?.value ? '***' : null
        })
        return cookie?.value ?? null
      },
      setItem: (key: string, value: string) => {
        logDebug('STORAGE', `setItem: ${key}`, { 
          value: '***',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7
        })
        res.cookies.set({
          name: key,
          value,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true
        })
      },
      removeItem: (key: string) => {
        logDebug('STORAGE', `removeItem: ${key}`, {
          path: '/',
          maxAge: 0
        })
        res.cookies.set({
          name: key,
          value: '',
          path: '/',
          maxAge: 0,
          httpOnly: true
        })
      },
    }

    // Aplica o storage ao cliente
    Object.assign(supabase.auth, { storage })

    // Verifica cache de sessão
    const cachePerf = measurePerformance('Cache Check')
    const cachedSession = sessionCache.get(request.nextUrl.pathname)
    const now = Date.now()
    
    let session = null
    if (cachedSession && (now - cachedSession.timestamp) < CACHE_TTL) {
      logDebug('CACHE', 'Usando sessão do cache', {
        path: request.nextUrl.pathname,
        age: now - cachedSession.timestamp,
        ttl: CACHE_TTL
      })
      session = cachedSession.session
    } else {
      logDebug('AUTH', 'Verificando sessão no Supabase', {
        path: request.nextUrl.pathname,
        cacheMiss: true
      })
      const { data: { session: newSession } } = await supabase.auth.getSession()
      session = newSession
      if (session) {
        sessionCache.set(request.nextUrl.pathname, { session, timestamp: now })
        logDebug('CACHE', 'Sessão armazenada em cache', {
          path: request.nextUrl.pathname,
          timestamp: now
        })
      }
    }
    cachePerf.end()

    logDebug('AUTH', 'Resultado da verificação de sessão', {
      hasSession: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      sessionExpiry: session?.expires_at,
      sessionCreated: session?.created_at
    })

    // Verifica se a rota atual requer autenticação
    const routePerf = measurePerformance('Route Check')
    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))
    const isAdminRoute = adminRoutes.some(route => request.nextUrl.pathname.startsWith(route))
    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')

    logDebug('ROUTE', 'Verificação de rotas', {
      isProtectedRoute,
      isAdminRoute,
      isAuthRoute,
      currentPath: request.nextUrl.pathname,
      matchedProtectedRoute: protectedRoutes.find(route => request.nextUrl.pathname.startsWith(route)),
      matchedAdminRoute: adminRoutes.find(route => request.nextUrl.pathname.startsWith(route))
    })
    routePerf.end()

    // Redireciona usuários não autenticados para login
    if (isProtectedRoute && !session) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      logDebug('REDIRECT', 'Redirecionando para login', {
        from: request.nextUrl.pathname,
        to: redirectUrl.toString(),
        reason: 'ROTA_PROTEGIDA_SEM_SESSAO'
      })
      return NextResponse.redirect(redirectUrl)
    }

    // Redireciona usuários autenticados para perfil se tentarem acessar login/registro
    if (isAuthRoute && session) {
      const redirectParam = request.nextUrl.searchParams.get('redirect')
      const redirectUrl = redirectParam 
        ? new URL(redirectParam, request.url)
        : new URL('/profile', request.url)
      
      logDebug('REDIRECT', 'Redirecionando usuário autenticado', {
        from: request.nextUrl.pathname,
        to: redirectUrl.toString(),
        hasRedirectParam: !!redirectParam,
        reason: 'USUARIO_AUTENTICADO_EM_ROTA_AUTH'
      })
      return NextResponse.redirect(redirectUrl)
    }

    // Verifica permissões de admin
    if (isAdminRoute && session?.user?.id) {
      logDebug('AUTH', 'Verificando permissões de admin', {
        userId: session.user.id,
        path: request.nextUrl.pathname
      })

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single()

      logDebug('AUTH', 'Resultado da verificação de admin', {
        hasProfile: !!profile,
        userType: profile?.user_type,
        requiredType: 'admin'
      })

      if (!profile || profile.user_type !== 'admin') {
        const redirectUrl = new URL('/profile', request.url)
        logDebug('REDIRECT', 'Redirecionando usuário não-admin', {
          from: request.nextUrl.pathname,
          to: redirectUrl.toString(),
          reason: 'SEM_PERMISSAO_ADMIN'
        })
        return NextResponse.redirect(redirectUrl)
      }
    }

    perf.end()
    logDebug('REQUEST', `Finalizando requisição ${requestId} com sucesso`, {
      path: request.nextUrl.pathname,
      status: 'SUCCESS'
    })
    return res
  } catch (error) {
    perf.end()
    logDebug('ERROR', `Erro na requisição ${requestId}`, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      } : error,
      path: request.nextUrl.pathname,
      status: 'ERROR'
    })
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
