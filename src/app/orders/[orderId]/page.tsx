"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Clock, 
  ChefHat, 
  Truck, 
  MapPin, 
  Phone, 
  MessageCircle,
  Star,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

// Dados simulados do pedido
const orderData = {
  id: 'ORD001',
  restaurantName: 'Restaurante do João',
  restaurantPhone: '(11) 99999-9999',
  customerName: 'João Silva',
  customerPhone: '(11) 88888-8888',
  customerAddress: 'Rua das Flores, 456 - Apartamento 12',
  items: [
    { 
      id: 1, 
      name: 'Pizza Margherita', 
      price: 29.90, 
      quantity: 1,
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f84491c3-e09f-4efd-87df-eebb82895d50.png'
    },
    { 
      id: 4, 
      name: 'Hambúrguer Clássico', 
      price: 24.90, 
      quantity: 1,
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cac3f62e-6cfd-44ec-ba5a-2eb6bc689e5a.png'
    }
  ],
  total: 54.80,
  status: 'preparing', // confirmed, preparing, ready, out_for_delivery, delivered
  paymentMethod: 'credit_card',
  paymentStatus: 'paid',
  createdAt: new Date('2024-01-20T10:30:00'),
  estimatedDelivery: new Date('2024-01-20T11:15:00'),
  currentLocation: {
    lat: -23.5505,
    lng: -46.6333
  },
  deliveryLocation: {
    lat: -23.5489,
    lng: -46.6388
  },
  notes: 'Sem cebola no hambúrguer',
  timeline: [
    {
      status: 'confirmed',
      title: 'Pedido Confirmado',
      description: 'Seu pedido foi confirmado e está na fila de preparo',
      timestamp: new Date('2024-01-20T10:30:00'),
      completed: true
    },
    {
      status: 'preparing',
      title: 'Preparando',
      description: 'Nossos chefs estão preparando seu pedido com carinho',
      timestamp: new Date('2024-01-20T10:35:00'),
      completed: true
    },
    {
      status: 'ready',
      title: 'Pronto para Entrega',
      description: 'Pedido finalizado e pronto para sair',
      timestamp: null,
      completed: false
    },
    {
      status: 'out_for_delivery',
      title: 'Saiu para Entrega',
      description: 'Entregador a caminho do seu endereço',
      timestamp: null,
      completed: false
    },
    {
      status: 'delivered',
      title: 'Entregue',
      description: 'Pedido entregue com sucesso',
      timestamp: null,
      completed: false
    }
  ]
};

const statusConfig = {
  confirmed: { color: 'bg-blue-500', progress: 20 },
  preparing: { color: 'bg-yellow-500', progress: 40 },
  ready: { color: 'bg-green-500', progress: 60 },
  out_for_delivery: { color: 'bg-purple-500', progress: 80 },
  delivered: { color: 'bg-gray-500', progress: 100 }
};

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState(orderData);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Atualizar horário atual a cada minuto
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simular atualizações em tempo real do pedido
    const interval = setInterval(() => {
      // Aqui você faria uma chamada para a API para buscar atualizações
      // fetch(`/api/orders?orderId=${orderId}`)
      console.log('Checking for order updates...');
    }, 30000); // Verificar a cada 30 segundos

    return () => clearInterval(interval);
  }, [orderId]);

  const getStatusIcon = (status: string, completed: boolean) => {
    const iconClass = `h-5 w-5 ${completed ? 'text-green-600' : 'text-gray-400'}`;
    
    switch (status) {
      case 'confirmed':
        return <CheckCircle className={iconClass} />;
      case 'preparing':
        return <ChefHat className={iconClass} />;
      case 'ready':
        return <Clock className={iconClass} />;
      case 'out_for_delivery':
        return <Truck className={iconClass} />;
      case 'delivered':
        return <CheckCircle className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      case 'out_for_delivery': return 'A Caminho';
      case 'delivered': return 'Entregue';
      default: return status;
    }
  };

  const getEstimatedTime = () => {
    const now = currentTime;
    const estimated = order.estimatedDelivery;
    const diffMinutes = Math.ceil((estimated.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffMinutes <= 0) {
      return 'Chegando agora';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}min`;
    }
  };

  const currentProgress = statusConfig[order.status as keyof typeof statusConfig]?.progress || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-orange-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pedido {order.id}</h1>
                <p className="text-sm text-gray-600">{order.restaurantName}</p>
              </div>
            </div>
            <Badge className={`${statusConfig[order.status as keyof typeof statusConfig]?.color} text-white`}>
              {getStatusText(order.status)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status e Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Bar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Status do Pedido</span>
                  <span className="text-sm font-normal text-gray-600">
                    Previsão: {getEstimatedTime()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={currentProgress} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Confirmado</span>
                    <span>Preparando</span>
                    <span>Pronto</span>
                    <span>A Caminho</span>
                    <span>Entregue</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Acompanhe seu Pedido</CardTitle>
                <CardDescription>
                  Histórico detalhado do seu pedido em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.timeline.map((step, index) => (
                    <div key={step.status} className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {getStatusIcon(step.status, step.completed)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            step.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.title}
                          </p>
                          {step.timestamp && (
                            <p className="text-xs text-gray-500">
                              {step.timestamp.toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          )}
                        </div>
                        <p className={`text-sm ${
                          step.completed ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mapa (Simulado) */}
            {(order.status === 'out_for_delivery' || order.status === 'delivered') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Localização em Tempo Real</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Mapa de rastreamento</p>
                      <p className="text-sm text-gray-500">
                        Entregador a {Math.floor(Math.random() * 5) + 1} km de distância
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Detalhes do Pedido */}
          <div className="space-y-6">
            {/* Itens do Pedido */}
            <Card>
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity}x R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span className="text-lg font-bold">
                        R$ {order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Entrega */}
            <Card>
              <CardHeader>
                <CardTitle>Informações de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Endereço:</p>
                  <p className="text-sm text-gray-600">{order.customerAddress}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Telefone:</p>
                  <p className="text-sm text-gray-600">{order.customerPhone}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Pagamento:</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                      {order.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {order.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 
                       order.paymentMethod === 'pix' ? 'PIX' : 'Dinheiro'}
                    </span>
                  </div>
                </div>

                {order.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Observações:</p>
                    <p className="text-sm text-gray-600">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ações */}
            <Card>
              <CardHeader>
                <CardTitle>Precisa de Ajuda?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Ligar para o Restaurante
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat via WhatsApp
                </Button>

                {order.status === 'delivered' && (
                  <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-500">
                    <Star className="h-4 w-4 mr-2" />
                    Avaliar Pedido
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}