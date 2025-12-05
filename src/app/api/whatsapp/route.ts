import { NextRequest, NextResponse } from 'next/server';

// Simulação da integração WhatsApp Business API
// Em produção, você integraria com a API oficial do WhatsApp Business

interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'interactive';
  content: string;
  templateName?: string;
  templateParams?: string[];
}

interface WhatsAppWebhook {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          text: {
            body: string;
          };
          type: string;
        }>;
        statuses?: Array<{
          id: string;
          status: string;
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

// Simulação de templates de mensagem
const messageTemplates = {
  order_confirmed: {
    name: 'order_confirmed',
    content: 'Olá {{customer_name}}! Seu pedido {{order_id}} foi confirmado. Total: R$ {{total}}. Tempo estimado: {{estimated_time}} minutos.'
  },
  order_preparing: {
    name: 'order_preparing',
    content: 'Seu pedido {{order_id}} está sendo preparado com carinho! 👨‍🍳'
  },
  order_ready: {
    name: 'order_ready',
    content: 'Pedido {{order_id}} pronto! Nosso entregador está a caminho. 🚗'
  },
  order_out_for_delivery: {
    name: 'order_out_for_delivery',
    content: 'Seu pedido {{order_id}} saiu para entrega! Acompanhe em tempo real: {{tracking_link}}'
  },
  order_delivered: {
    name: 'order_delivered',
    content: 'Pedido {{order_id}} entregue com sucesso! Obrigado por escolher nosso restaurante. ⭐'
  }
};

// Enviar mensagem WhatsApp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'send_message') {
      const { to, message, templateName, templateParams } = data;

      if (!to || !message) {
        return NextResponse.json(
          { success: false, error: 'Destinatário e mensagem são obrigatórios' },
          { status: 400 }
        );
      }

      // Simular envio de mensagem
      const messageId = `wamid.${Date.now()}`;
      
      // Log da mensagem enviada (em produção seria enviada via API do WhatsApp)
      console.log('📱 WhatsApp Message Sent:', {
        messageId,
        to,
        message,
        templateName,
        templateParams,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        data: {
          messageId,
          status: 'sent',
          timestamp: new Date().toISOString()
        },
        message: 'Mensagem enviada com sucesso'
      });
    }

    if (action === 'send_order_notification') {
      const { phone, orderData, notificationType } = data;

      if (!phone || !orderData || !notificationType) {
        return NextResponse.json(
          { success: false, error: 'Dados obrigatórios não fornecidos' },
          { status: 400 }
        );
      }

      const template = messageTemplates[notificationType as keyof typeof messageTemplates];
      if (!template) {
        return NextResponse.json(
          { success: false, error: 'Tipo de notificação inválido' },
          { status: 400 }
        );
      }

      // Substituir variáveis no template
      let message = template.content;
      message = message.replace('{{customer_name}}', orderData.customerName || 'Cliente');
      message = message.replace('{{order_id}}', orderData.id || '');
      message = message.replace('{{total}}', orderData.total?.toFixed(2) || '0.00');
      message = message.replace('{{estimated_time}}', '30-45');
      message = message.replace('{{tracking_link}}', `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/orders/${orderData.id}`);

      // Simular envio
      const messageId = `wamid.${Date.now()}`;
      
      console.log('📱 WhatsApp Order Notification:', {
        messageId,
        phone,
        notificationType,
        message,
        orderData: {
          id: orderData.id,
          total: orderData.total,
          status: orderData.status
        },
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        data: {
          messageId,
          status: 'sent',
          notificationType,
          timestamp: new Date().toISOString()
        },
        message: 'Notificação enviada com sucesso'
      });
    }

    if (action === 'get_templates') {
      return NextResponse.json({
        success: true,
        data: Object.values(messageTemplates)
      });
    }

    return NextResponse.json(
      { success: false, error: 'Ação não reconhecida' },
      { status: 400 }
    );

  } catch (error) {
    console.error('WhatsApp API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}

// Webhook para receber mensagens do WhatsApp
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Verificação do webhook (WhatsApp Business API)
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      console.log('WhatsApp webhook verified');
      return new NextResponse(challenge);
    }

    return NextResponse.json(
      { success: false, error: 'Verificação do webhook falhou' },
      { status: 403 }
    );

  } catch (error) {
    console.error('WhatsApp Webhook Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}

// Processar mensagens recebidas do WhatsApp
export async function PUT(request: NextRequest) {
  try {
    const webhookData: WhatsAppWebhook = await request.json();

    // Processar mensagens recebidas
    if (webhookData.entry) {
      for (const entry of webhookData.entry) {
        for (const change of entry.changes) {
          if (change.value.messages) {
            for (const message of change.value.messages) {
              // Processar mensagem recebida
              console.log('📱 WhatsApp Message Received:', {
                from: message.from,
                messageId: message.id,
                text: message.text.body,
                timestamp: message.timestamp
              });

              // Aqui você pode implementar lógica para responder automaticamente
              // Por exemplo, responder com o status do pedido quando o cliente enviar o número do pedido
              
              const messageText = message.text.body.toLowerCase();
              
              if (messageText.includes('pedido') || messageText.startsWith('ord')) {
                // Simular resposta automática
                console.log('📱 Auto-reply sent for order inquiry');
              }
            }
          }

          if (change.value.statuses) {
            for (const status of change.value.statuses) {
              // Processar status de entrega das mensagens
              console.log('📱 WhatsApp Message Status:', {
                messageId: status.id,
                status: status.status,
                timestamp: status.timestamp
              });
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processado com sucesso'
    });

  } catch (error) {
    console.error('WhatsApp Webhook Processing Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao processar webhook' 
      },
      { status: 500 }
    );
  }
}