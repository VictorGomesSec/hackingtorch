"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/hooks/use-auth"
import { getProfile, updateProfile, uploadAvatar, type Profile } from "@/lib/services/user-service"
import {
  Flame,
  User,
  Mail,
  MapPin,
  Briefcase,
  Github,
  Globe,
  Twitter,
  Linkedin,
  Edit,
  Award,
  Calendar,
  Users,
  Trophy,
  Settings,
  Bell,
  LogOut,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

// Componente de loading
function ProfileLoading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p>Carregando perfil...</p>
      </div>
    </div>
  )
}

// Componente de header
function ProfileHeader({ profile, onEditClick }: { profile: Profile, onEditClick: () => void }) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-lg bg-black/80 border-b border-zinc-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" />
          <span className="font-bold text-xl bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            HackingTorch
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Buscar eventos..."
              className="w-64 bg-zinc-900/80 border-zinc-800 pl-9 h-9 rounded-full text-sm"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 border border-zinc-700 hover:border-orange-500 transition-colors cursor-pointer">
                <AvatarImage src={profile.avatar_url || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback className="bg-gradient-to-br from-red-600 to-orange-500">
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800 text-white">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <Link href="/profile" className="w-full">
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                <Calendar className="mr-2 h-4 w-4" />
                <Link href="/dashboard" className="w-full">
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <Link href="/settings" className="w-full">
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer text-red-400 hover:text-red-300">
                <LogOut className="mr-2 h-4 w-4" />
                <Link href="/" className="w-full">
                  Sair
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Profile>>({})

  useEffect(() => {
    if (user?.id) {
      loadProfile()
    }
  }, [user?.id])

  const loadProfile = async () => {
    if (!user?.id) return
    const profileData = await getProfile(user.id)
    if (profileData) {
      setProfile(profileData)
      setFormData(profileData)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    const updatedProfile = await updateProfile(user.id, formData)
    if (updatedProfile) {
      setProfile(updatedProfile)
      setIsEditing(false)
      toast.success("Perfil atualizado com sucesso!")
    } else {
      toast.error("Erro ao atualizar perfil")
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return

    const avatarUrl = await uploadAvatar(user.id, file)
    if (avatarUrl) {
      setProfile((prev) => prev ? { ...prev, avatar_url: avatarUrl } : null)
      toast.success("Avatar atualizado com sucesso!")
    } else {
      toast.error("Erro ao atualizar avatar")
    }
  }

  if (!profile) {
    return <ProfileLoading />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Suspense fallback={<ProfileLoading />}>
        <ProfileHeader profile={profile} onEditClick={() => setIsEditing(!isEditing)} />
      </Suspense>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="relative mb-8">
          <div className="h-48 rounded-xl overflow-hidden bg-gradient-to-r from-red-900/30 to-orange-900/30">
            <Image
              src="/placeholder.svg?height=192&width=1200&text=Cover"
              alt="Cover"
              width={1200}
              height={192}
              className="w-full h-full object-cover opacity-50"
              priority
            />
          </div>
          <div className="absolute bottom-0 left-8 transform translate-y-1/2 flex items-end">
            <Avatar className="h-24 w-24 border-4 border-black">
              <AvatarImage src={profile.avatar_url || "/placeholder.svg?height=96&width=96"} />
              <AvatarFallback className="bg-gradient-to-br from-red-600 to-orange-500 text-2xl">
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" size="sm" className="border-zinc-700" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-4 w-4 mr-1.5" /> {isEditing ? "Cancelar" : "Editar Perfil"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        name="first_name"
                        value={formData.first_name || ""}
                        onChange={handleInputChange}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder="Nome"
                      />
                      <Input
                        name="last_name"
                        value={formData.last_name || ""}
                        onChange={handleInputChange}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder="Sobrenome"
                      />
                    </div>
                  ) : (
                    `${profile.first_name} ${profile.last_name}`
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Briefcase className="h-4 w-4" />
                  <span>{profile.user_type === "organizer" ? "Organizador" : "Participante"}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Globe className="h-4 w-4" />
                    <Link href={profile.website} className="text-orange-400 hover:text-orange-300">
                      {profile.website}
                    </Link>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="icon" className="rounded-full border-zinc-700">
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-zinc-700">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-zinc-700">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>

                {isEditing && (
                  <div className="pt-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label htmlFor="avatar-upload">
                      <Button variant="outline" className="w-full border-zinc-700">
                        Alterar foto
                      </Button>
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle>Habilidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                    React
                  </Badge>
                  <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                    TypeScript
                  </Badge>
                  <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                    Next.js
                  </Badge>
                  <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                    Node.js
                  </Badge>
                  <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                    UI/UX
                  </Badge>
                  <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                    TailwindCSS
                  </Badge>
                  <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                    GraphQL
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle>Certificados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((cert) => (
                  <div key={cert} className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-800/50">
                    <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Award className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="font-medium">Hackathon Future Tech {cert}</div>
                      <div className="text-sm text-zinc-400">Emitido em Nov, 2024</div>
                    </div>
                  </div>
                ))}
                <Link
                  href="/event/certificate"
                  className="text-sm text-orange-400 hover:text-orange-300 flex justify-end"
                >
                  Ver todos →
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle>Sobre</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                    className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-md p-2 text-white"
                    placeholder="Conte um pouco sobre você..."
                  />
                ) : (
                  <p className="text-zinc-300">{profile.bio || "Nenhuma biografia adicionada."}</p>
                )}
              </CardContent>
              {isEditing && (
                <CardContent className="flex justify-end border-t border-zinc-800 pt-4">
                  <Button
                    className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400"
                    onClick={handleSubmit}
                  >
                    Salvar alterações
                  </Button>
                </CardContent>
              )}
            </Card>

            <Tabs defaultValue="events">
              <TabsList className="bg-zinc-900/50">
                <TabsTrigger value="events">Eventos</TabsTrigger>
                <TabsTrigger value="teams">Times</TabsTrigger>
                <TabsTrigger value="achievements">Conquistas</TabsTrigger>
              </TabsList>

              <TabsContent value="events" className="mt-6 space-y-4">
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                    <Calendar className="h-12 w-12 text-zinc-600 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Nenhum evento encontrado</h3>
                    <p className="text-zinc-400 mb-6">Você ainda não participou de nenhum evento.</p>
                    <Button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400">
                      Explorar eventos
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="teams" className="mt-6 space-y-4">
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                    <Users className="h-12 w-12 text-zinc-600 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Nenhum time encontrado</h3>
                    <p className="text-zinc-400 mb-6">Você ainda não participou de nenhum time.</p>
                    <Button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400">
                      Explorar times
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Hackathons", value: "0", icon: <Calendar className="h-5 w-5 text-orange-400" /> },
                    { title: "Times", value: "0", icon: <Users className="h-5 w-5 text-orange-400" /> },
                    { title: "Prêmios", value: "0", icon: <Trophy className="h-5 w-5 text-orange-400" /> },
                  ].map((stat, index) => (
                    <Card key={index} className="bg-zinc-900/50 border-zinc-800">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-3">
                          {stat.icon}
                        </div>
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-zinc-400">{stat.title}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <footer className="border-t border-zinc-800 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                HackingTorch
              </span>
            </div>
            <div className="flex gap-4 text-zinc-500 text-sm">
              <Link href="#" className="hover:text-orange-400">
                Sobre
              </Link>
              <Link href="#" className="hover:text-orange-400">
                Contato
              </Link>
              <Link href="#" className="hover:text-orange-400">
                Termos
              </Link>
              <Link href="#" className="hover:text-orange-400">
                Privacidade
              </Link>
            </div>
            <div className="text-zinc-500 text-sm">© 2025 HackingTorch. Todos os direitos reservados.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
