"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Smartphone, QrCode, BarChart3, MessageCircle, MapPin, ChefHat } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">("pro");

  const features = [
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "Cardápio com QR Code",
      description: "Cardápio digital acessível via QR Code para seus clientes"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Pedidos Online",
      description: "Sistema completo de pedidos online integrado"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Rastreamento GPS",
      description: "Acompanhamento em tempo real dos pedidos"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "WhatsApp Business",
      description: "Integração completa com WhatsApp para notificações"
    },
    {
      icon: <ChefHat className="h-6 w-6" />,
      title: "Tela da Cozinha",
      description: "Interface otimizada para gerenciar pedidos na cozinha"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Relatórios Avançados",
      description: "Analytics completos de vendas e performance"
    }
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
        "1 usuário"
      ],
      limitations: [
        "Sem integração WhatsApp",
        "Relatórios básicos",
        "Sem rastreamento GPS"
      ]
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
        "Customização avançada"
      ],
      popular: true
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ZAAP</h1>
                <p className="text-sm text-gray-600">Gestão de Restaurantes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-700 hover:text-orange-600" asChild>
                <Link href="/auth">Login</Link>
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" asChild>
                <Link href="/auth">Começar Grátis</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Transforme seu restaurante com o
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"> ZAAP</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Sistema completo de gestão para restaurantes com cardápio digital, pedidos online, 
              rastreamento GPS e integração WhatsApp Business. Tudo que você precisa em uma plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg px-8 py-3" asChild>
                <Link href="/auth">Começar Grátis Agora</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-orange-200 hover:bg-orange-50" asChild>
                <Link href="/menu/1">Ver Demonstração</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Tudo que seu restaurante precisa
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Funcionalidades completas para modernizar seu restaurante e aumentar suas vendas
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-orange-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center text-orange-600 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Escolha o plano ideal para seu restaurante
            </h3>
            <p className="text-lg text-gray-600">
              Comece grátis e evolua conforme seu negócio cresce
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Grátis */}
            <Card className={`relative ${selectedPlan === 'free' ? 'ring-2 ring-orange-500' : ''}`}>
              <CardHeader>
                <CardTitle className="text-2xl">{plans.free.name}</CardTitle>
                <CardDescription>{plans.free.description}</CardDescription>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">{plans.free.price}</span>
                  <span className="text-gray-600 ml-1">{plans.free.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plans.free.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plans.free.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center opacity-60">
                      <div className="h-5 w-5 mr-3 flex items-center justify-center">
                        <div className="h-0.5 w-3 bg-gray-400"></div>
                      </div>
                      <span className="text-gray-500">{limitation}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full" 
                  variant={selectedPlan === 'free' ? 'default' : 'outline'}
                  onClick={() => setSelectedPlan('free')}
                >
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>

            {/* Plano Pró */}
            <Card className={`relative ${selectedPlan === 'pro' ? 'ring-2 ring-orange-500' : ''}`}>
              {plans.pro.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1">
                    <Star className="h-4 w-4 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plans.pro.name}</CardTitle>
                <CardDescription>{plans.pro.description}</CardDescription>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">{plans.pro.price}</span>
                  <span className="text-gray-600 ml-1">{plans.pro.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plans.pro.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" 
                  onClick={() => setSelectedPlan('pro')}
                >
                  Começar Teste Grátis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h3 className="text-3xl font-bold mb-4">
              Pronto para revolucionar seu restaurante?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a milhares de restaurantes que já transformaram seu negócio com o ZAAP
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-3" asChild>
                <Link href="/auth">Começar Agora - É Grátis</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 text-lg px-8 py-3" asChild>
                <Link href="/auth">Falar com Especialista</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">Z</span>
                </div>
                <span className="text-xl font-bold">ZAAP</span>
              </div>
              <p className="text-gray-400">
                Sistema completo de gestão para restaurantes modernos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Funcionalidades</li>
                <li>Preços</li>
                <li>Demonstração</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Central de Ajuda</li>
                <li>Documentação</li>
                <li>Contato</li>
                <li>Status</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre</li>
                <li>Blog</li>
                <li>Carreiras</li>
                <li>Privacidade</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ZAAP. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}