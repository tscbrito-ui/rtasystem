"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Phone, Clock, ShoppingBag } from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  restaurantId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  estimatedDelivery: string;
  notes: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders?orderId=${orderId}`);

        if (!res.ok) {
          setError("Pedido não encontrado");
          setLoading(false);
          return;
        }

        const json = await res.json();

        if (!json.success) {
          setError(json.error || "Erro ao carregar pedido");
          setLoading(false);
          return;
        }

        setOrder(json.data);
      } catch (err) {
        setError("Erro ao conectar ao servidor");
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="mt-4">Carregando pedido...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 text-center">
          <h1 className="text-xl font-bold mb-2">Erro</h1>
          <p className="text-gray-600">{error || "Pedido não encontrado"}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pedido #{order.id}</span>
              <Badge className="bg-orange-500">{order.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            <p>
              <strong>Cliente:</strong> {order.customerName}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> {order.customerPhone}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {order.customerAddress}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Entrega estimada:{" "}
              {new Date(order.estimatedDelivery).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            {order.notes && (
              <p>
                <strong>Observações:</strong> {order.notes}
              </p>
            )}

            <p>
              <strong>Pagamento:</strong> {order.paymentMethod.toUpperCase()} (
              {order.paymentStatus})
            </p>
          </CardContent>
        </Card>

        {/* Itens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Itens do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantidade: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="border-t pt-4 flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>R$ {order.total.toFixed(2)}</span>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
