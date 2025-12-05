import { NextRequest, NextResponse } from 'next/server';

// Dados simulados de pedidos
let orders = [
  {
    id: 'ORD001',
    restaurantId: '1',
    customerName: 'João Silva',
    customerPhone: '(11) 99999-9999',
    customerAddress: 'Rua das Flores, 456 - Apartamento 12',
    items: [
      { id: 1, name: 'Pizza Margherita', price: 29.90, quantity: 1 },
      { id: 4, name: 'Hambúrguer Clássico', price: 24.90, quantity: 1 }
    ],
    total: 54.80,
    status: 'confirmed', // confirmed, preparing, ready, out_for_delivery, delivered, cancelled
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-20T10:30:00'),
    estimatedDelivery: new Date('2024-01-20T11:15:00'),
    location: {
      lat: -23.5505,
      lng: -46.6333
    },
    notes: 'Sem cebola no hambúrguer'
  },
  {
    id: 'ORD002',
    restaurantId: '1',
    customerName: 'Maria Santos',
    customerPhone: '(11) 88888-8888',
    customerAddress: 'Avenida Paulista, 1000 - Sala 501',
    items: [
      { id: 2, name: 'Pizza Pepperoni', price: 32.90, quantity: 1 }
    ],
    total: 32.90,
    status: 'preparing',
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-20T10:45:00'),
    estimatedDelivery: new Date('2024-01-20T11:30:00'),
    location: {
      lat: -23.5616,
      lng: -46.6565
    },
    notes: ''
  },
  {
    id: 'ORD003',
    restaurantId: '1',
    customerName: 'Pedro Costa',
    customerPhone: '(11) 77777-7777',
    customerAddress: 'Rua Augusta, 2000 - Casa',
    items: [
      { id: 6, name: 'Lasanha Bolonhesa', price: 35.90, quantity: 1 },
      { id: 8, name: 'Salada Caesar', price: 18.90, quantity: 1 }
    ],
    total: 54.80,
    status: 'ready',
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    createdAt: new Date('2024-01-20T11:00:00'),
    estimatedDelivery: new Date('2024-01-20T11:45:00'),
    location: {
      lat: -23.5489,
      lng: -46.6388
    },
    notes: 'Troco para R$ 100,00'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');

    let filteredOrders = orders;

    if (restaurantId) {
      filteredOrders = filteredOrders.filter(order => order.restaurantId === restaurantId);
    }

    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    if (orderId) {
      const order = filteredOrders.find(order => order.id === orderId);
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Pedido não encontrado' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: order
      });
    }

    return NextResponse.json({
      success: true,
      data: filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      restaurantId,
      customerName,
      customerPhone,
      customerAddress,
      items,
      paymentMethod,
      notes = ''
    } = body;

    // Validações básicas
    if (!restaurantId || !customerName || !customerPhone || !customerAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    // Calcular total
    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Criar novo pedido
    const newOrder = {
      id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
      restaurantId,
      customerName,
      customerPhone,
      customerAddress,
      items,
      total,
      status: 'confirmed',
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // 45 minutos
      location: {
        lat: -23.5505 + (Math.random() - 0.5) * 0.1,
        lng: -46.6333 + (Math.random() - 0.5) * 0.1
      },
      notes
    };

    orders.push(newOrder);

    // Simular integração WhatsApp (apenas log)
    console.log(`📱 WhatsApp: Novo pedido ${newOrder.id} para ${customerName}`);

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: 'Pedido criado com sucesso'
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, location } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'ID do pedido é obrigatório' },
        { status: 400 }
      );
    }

    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar pedido
    if (status) {
      orders[orderIndex].status = status;
    }

    if (location) {
      orders[orderIndex].location = location;
    }

    // Simular notificação WhatsApp
    const statusMessages: { [key: string]: string } = {
      'confirmed': 'Pedido confirmado! Iniciando preparo.',
      'preparing': 'Seu pedido está sendo preparado.',
      'ready': 'Pedido pronto! Saindo para entrega.',
      'out_for_delivery': 'Pedido a caminho!',
      'delivered': 'Pedido entregue com sucesso!'
    };

    if (status && statusMessages[status]) {
      console.log(`📱 WhatsApp: ${statusMessages[status]} - Pedido ${orderId}`);
    }

    return NextResponse.json({
      success: true,
      data: orders[orderIndex],
      message: 'Pedido atualizado com sucesso'
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'ID do pedido é obrigatório' },
        { status: 400 }
      );
    }

    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    // Cancelar pedido
    orders[orderIndex].status = 'cancelled';

    return NextResponse.json({
      success: true,
      message: 'Pedido cancelado com sucesso'
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}