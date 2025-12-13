import { NextRequest, NextResponse } from "next/server";

/* =========================
   TIPOS
========================= */
interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderLocation {
  lat: number;
  lng: number;
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
  createdAt: Date;
  estimatedDelivery: Date;
  location: OrderLocation;
  notes: string;
}

/* =========================
   DADOS SIMULADOS
========================= */
const orders: Order[] = [
  {
    id: "ORD001",
    restaurantId: "1",
    customerName: "João Silva",
    customerPhone: "(11) 99999-9999",
    customerAddress: "Rua das Flores, 456 - Apartamento 12",
    items: [
      { id: 1, name: "Pizza Margherita", price: 29.9, quantity: 1 },
      { id: 4, name: "Hambúrguer Clássico", price: 24.9, quantity: 1 },
    ],
    total: 54.8,
    status: "confirmed",
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    createdAt: new Date("2024-01-20T10:30:00"),
    estimatedDelivery: new Date("2024-01-20T11:15:00"),
    location: { lat: -23.5505, lng: -46.6333 },
    notes: "Sem cebola no hambúrguer",
  },
];

/* =========================
   GET
========================= */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");
    const status = searchParams.get("status");
    const orderId = searchParams.get("orderId");

    let filteredOrders = orders;

    if (restaurantId) {
      filteredOrders = filteredOrders.filter(
        (order) => order.restaurantId === restaurantId
      );
    }

    if (status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === status
      );
    }

    if (orderId) {
      const order = filteredOrders.find((o) => o.id === orderId);
      if (!order) {
        return NextResponse.json(
          { success: false, error: "Pedido não encontrado" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: order });
    }

    return NextResponse.json({
      success: true,
      data: filteredOrders.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      ),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

/* =========================
   POST
========================= */
export async function POST(request: NextRequest) {
  try {
    const body: {
      restaurantId: string;
      customerName: string;
      customerPhone: string;
      customerAddress: string;
      items: OrderItem[];
      paymentMethod: string;
      notes?: string;
    } = await request.json();

    const {
      restaurantId,
      customerName,
      customerPhone,
      customerAddress,
      items,
      paymentMethod,
      notes = "",
    } = body;

    if (
      !restaurantId ||
      !customerName ||
      !customerPhone ||
      !customerAddress ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Dados obrigatórios não fornecidos" },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder: Order = {
      id: `ORD${String(orders.length + 1).padStart(3, "0")}`,
      restaurantId,
      customerName,
      customerPhone,
      customerAddress,
      items,
      total,
      status: "confirmed",
      paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000),
      location: {
        lat: -23.5505 + (Math.random() - 0.5) * 0.1,
        lng: -46.6333 + (Math.random() - 0.5) * 0.1,
      },
      notes,
    };

    orders.push(newOrder);

    console.log(`📱 Novo pedido ${newOrder.id} para ${customerName}`);

    return NextResponse.json(
      { success: true, data: newOrder },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

/* =========================
   PUT
========================= */
export async function PUT(request: NextRequest) {
  try {
    const body: {
      orderId: string;
      status?: string;
      location?: OrderLocation;
    } = await request.json();

    const { orderId, status, location } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "ID do pedido é obrigatório" },
        { status: 400 }
      );
    }

    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    if (status) order.status = status;
    if (location) order.location = location;

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE
========================= */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "ID do pedido é obrigatório" },
        { status: 400 }
      );
    }

    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    order.status = "cancelled";

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

