"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [userType, setUserType] = useState<"user" | "business">("business");
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">("free");

  useEffect(() => {
    setIsClient(true); // Evita qualquer hidratação incorreta
  }, []);

  // Evita SSR — necessário para usar useAuth()
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  // Agora é seguro chamar
  const { login, register } = useAuth();

  // --- LOGIN ---
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setError("Email ou senha incorretos");
    } finally {
      setIsLoading(false);
    }
  };

  // --- REGISTER ---
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const userData: any = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      type: userType,
    };

    if (userType === "business") {
      userData.restaurantData = {
        name: formData.get("restaurantName"),
        description: formData.get("restaurantDescription"),
        address: formData.get("restaurantAddress"),
        phone: formData.get("restaurantPhone"),
        plan: selectedPlan,
      };
    }

    try {
      await register(userData);
      router.push("/dashboard");
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // RETORNO DO COMPONENTE
  // -------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-orange-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">RTA</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">RTA</h1>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>

          {/* --- LOGIN --- */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Entrar</CardTitle>
                <CardDescription>Acesse seu painel RTA</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input name="email" type="email" className="pl-10" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input name="password" type="password" className="pl-10" required />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 bg-red-50 p-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500"
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- REGISTER --- */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Criar conta</CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Tipo de conta */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={userType === "business" ? "default" : "outline"}
                      onClick={() => setUserType("business")}
                    >
                      <Building2 className="h-4 w-4 mr-2" /> Restaurante
                    </Button>

                    <Button
                      type="button"
                      variant={userType === "user" ? "default" : "outline"}
                      onClick={() => setUserType("user")}
                    >
                      <User className="h-4 w-4 mr-2" /> Cliente
                    </Button>
                  </div>

                  {/* Nome */}
                  <div>
                    <Label>Nome completo</Label>
                    <Input name="name" required />
                  </div>

                  {/* Email */}
                  <div>
                    <Label>Email</Label>
                    <Input name="email" type="email" required />
                  </div>

                  {/* Senha */}
                  <div>
                    <Label>Senha</Label>
                    <Input name="password" type="password" required />
                  </div>

                  {/* Dados do restaurante */}
                  {userType === "business" && (
                    <>
                      <h3 className="font-medium pt-4">Dados do restaurante</h3>

                      <Input
                        name="restaurantName"
                        placeholder="Nome do restaurante"
                        required
                      />
                      <Textarea
                        name="restaurantDescription"
                        placeholder="Descrição"
                        required
                      />
                      <Input
                        name="restaurantAddress"
                        placeholder="Endereço"
                        required
                      />
                      <Input
                        name="restaurantPhone"
                        placeholder="Telefone"
                        required
                      />

                      <Select
                        value={selectedPlan}
                        onValueChange={(v: "free" | "pro") => setSelectedPlan(v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha um plano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Grátis</SelectItem>
                          <SelectItem value="pro">Pró - R$49/mês</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}

                  {error && (
                    <div className="text-red-600 bg-red-50 p-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500"
                  >
                    {isLoading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
