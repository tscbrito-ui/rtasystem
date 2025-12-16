"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";
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

import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Lock,
} from "lucide-react";

/* =========================
   TIPOS
========================= */
interface RegisterData {
  name: string;
  email: string;
  password: string;
  type: "user" | "business";
  restaurantData?: {
    name: string;
    description: string;
    address: string;
    phone: string;
    plan: "free" | "pro";
  };
}

export default function AuthPage() {
  const router = useRouter();

  /* ✅ HOOKS SEMPRE NO TOPO */
  const { login, register } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [userType, setUserType] = useState<"user" | "business">("business");
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">("free");

  /* ✅ evita problemas de hidratação */
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  /* =========================
     LOGIN
  ========================= */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await login(
        String(formData.get("email")),
        String(formData.get("password"))
      );
      router.push("/dashboard");
    } catch {
      setError("Email ou senha incorretos");
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     REGISTER
  ========================= */
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const userData: RegisterData = {
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      type: userType,
    };

    if (userType === "business") {
      userData.restaurantData = {
        name: String(formData.get("restaurantName")),
        description: String(formData.get("restaurantDescription")),
        address: String(formData.get("restaurantAddress")),
        phone: String(formData.get("restaurantPhone")),
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

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-orange-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>

          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">
              RTA
            </div>
            <h1 className="text-2xl font-bold">RTA</h1>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Entrar</CardTitle>
                <CardDescription>Acesse seu painel RTA</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input name="email" type="email" className="pl-10" required />
                    </div>
                  </div>

                  <div>
                    <Label>Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input name="password" type="password" className="pl-10" required />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 bg-red-50 p-3 rounded text-sm">
                      {error}
                    </div>
                  )}

                  <Button disabled={isLoading} className="w-full">
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REGISTER */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={userType === "business" ? "default" : "outline"}
                      onClick={() => setUserType("business")}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Restaurante
                    </Button>

                    <Button
                      type="button"
                      variant={userType === "user" ? "default" : "outline"}
                      onClick={() => setUserType("user")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Cliente
                    </Button>
                  </div>

                  <Input name="name" placeholder="Nome completo" required />
                  <Input name="email" type="email" placeholder="Email" required />
                  <Input name="password" type="password" placeholder="Senha" required />

                  {userType === "business" && (
                    <>
                      <Input name="restaurantName" placeholder="Nome do restaurante" required />
                      <Textarea name="restaurantDescription" placeholder="Descrição" required />
                      <Input name="restaurantAddress" placeholder="Endereço" required />
                      <Input name="restaurantPhone" placeholder="Telefone" required />

                      <Select value={selectedPlan} onValueChange={(v) => setSelectedPlan(v as "free" | "pro")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Plano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Grátis</SelectItem>
                          <SelectItem value="pro">Pró - R$49/mês</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}

                  {error && (
                    <div className="text-red-600 bg-red-50 p-3 rounded text-sm">
                      {error}
                    </div>
                  )}

                  <Button disabled={isLoading} className="w-full">
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


