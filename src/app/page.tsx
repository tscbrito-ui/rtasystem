"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Star,
  Smartphone,
  QrCode,
  BarChart3,
  MessageCircle,
  MapPin,
  ChefHat,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">("pro");

  const features = [
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "Cardápio com QR Code",
      description: "Cardápio digital acessível via QR Code para seus clientes",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Pedidos Online",
      description: "Sistema completo de pedidos online integrado",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Rastreamento GPS",
      description: "Acompanhamento em tempo real dos pedidos",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "WhatsApp Business",
      description: "Integração completa com WhatsApp para notificações",
    },
    {
      icon: <ChefHat className="h-6 w-6" />,
      title: "Tela da Cozinha",
      description: "Interface otimizada para gerenciar pedidos na cozinha",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Relatórios Avançados",
      description: "Analytics completos de vendas e performance",
    },
  ];

  const plans = {
    free: {
      name: "Plano Grátis",
      price: "R$ 0",
      period: "/mês",
      description: "Ideal para começar",
      features: [
        "Cardápio digital básico",
        "Até 50 pedidos por mês",
        "QR Code personalizado",
        "Suporte por email",
        "1 usuário",
      ],
      limitations: [
        "Sem integração WhatsApp",
        "Relatórios básicos",
        "Sem rastreamento GPS",
      ],
    },
    pro: {
      name: "Plano Pró",
      price: "R$ 49",
      period: "/mês",
      description: "Para restaurantes profissionais",
      features: [
        "Cardápio digital completo",
        "Pedidos ilimitados",
        "Integração WhatsApp Business",
        "Rastreamento GPS em tempo real",
        "Tela da cozinha avançada",
        "Relatórios completos",
        "Controle de estoque",
        "Usuários ilimitados",
        "Suporte prioritário",
        "Customização avançada",
      ],
      popular: true,
    },
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RTA</h1>
                <p className="text-sm text-gray-600">
                  Gestão de Restaurantes
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/auth">Login</Link>
              </Button>
              <Button
                className="bg-gradient-to-r from-orange-500 to-red-500"
                asChild
              >
                <Link href="/auth">Começar Grátis</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Transforme seu restaurante com o
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              {" "}
              RTA
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema completo de gestão para restaurantes com cardápio digital,
            pedidos online, rastreamento GPS e integração com WhatsApp Business.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth">Começar Grátis Agora</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/menu/1">Ver Demonstração</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">
          Pronto para revolucionar seu restaurante?
        </h3>
        <p className="text-xl mb-8">
          Junte-se a milhares de restaurantes que já usam o RTA
        </p>
        <Button size="lg" className="bg-white text-orange-600" asChild>
          <Link href="/auth">Começar Agora</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <p className="text-gray-400">
          &copy; 2024 RTA. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
