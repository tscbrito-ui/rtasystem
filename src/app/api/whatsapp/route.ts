import { NextRequest, NextResponse } from "next/server";

/* =========================
   TIPAGEM DO WEBHOOK
========================= */
interface WhatsAppWebhook {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      field: string;
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
          text?: {
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
    }>;
  }>;
}

/* =========================
   TEMPLATES DE MENSAGEM
========================= */
const messageTemplates = {
  order_confirmed: {
    name: "order_confirmed",
    content:
      "Olá {{customer_name}}! Seu pedido {{order_id}} foi confirmado. Total: R$ {{total}}. Tempo estimado: {{estimated_time}} minutos.",
  },
  order_preparing: {
    name: "order_preparing",
    content: "Seu pedido {{order_id}} está sendo preparado! 👨‍🍳",
  },
  order_ready: {
    name: "order_ready",
    content: "Pedido {{order_id}} pronto! 🚗",
  },
  order_out_for_delivery: {
    name: "order_out_for_delivery",
    content:
      "Seu pedido {{order_id}} saiu para entrega! Acompanhe aqui: {{tracking_link}}",
  },
  order_delivered: {
    name: "order_delivered",
    content:
      "Pedido {{order_id}} entregue com sucesso! Obrigado pela preferência! ⭐",
  },
};

/* =========================
   POST – ENVIO DE MENSAGENS
========================= */
export async function POST(request: NextRequest) {
  try {
    const body: {
      action?: string;
      to?: string;
      message?: string;
      phone?: string;
      orderData?: {
        id?: string;
        total?: number;
        customerName?: string;
      };
      notificationType?: keyof typeof messageTemplates;
    } = await request.json();

    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Ação não especificada" },
        { status: 400 }
      );
    }

    /* ===== Enviar mensagem simples ===== */
    if (action === "send_message") {
      if (!body.to || !body.message) {
        return NextResponse.json(
          {
            success: false,
            error: "Destinatário e mensagem são obrigatórios",
          },
          { status: 400 }
        );
      }

      const messageId = `wamid.${Date.now()}`;

      console.log("[RTA] WhatsApp enviado:", {
        to: body.to,
        message: body.message,
      });

      return NextResponse.json({
        success: true,
        data: {
          messageId,
          status: "sent",
          timestamp: new Date().toISOString(),
        },
      });
    }

    /* ===== Enviar notificação de pedido ===== */
    if (action === "send_order_notification") {
      const { phone, orderData, notificationType } = body;

      if (!phone || !orderData || !notificationType) {
        return NextResponse.json(
          { success: false, error: "Dados obrigatórios não fornecidos" },
          { status: 400 }
        );
      }

      const template = messageTemplates[notificationType];

      if (!template) {
        return NextResponse.json(
          { success: false, error: "Template inválido" },
          { status: 400 }
        );
      }

      let message = template.content;
      message = message.replace(
        "{{customer_name}}",
        orderData.customerName ?? "Cliente"
      );
      message = message.replace("{{order_id}}", orderData.id ?? "");
      message = message.replace(
        "{{total}}",
        orderData.total?.toFixed(2) ?? "0.00"
      );
      message = message.replace("{{estimated_time}}", "30-45");
      message = message.replace(
        "{{tracking_link}}",
        `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/orders/${
          orderData.id ?? ""
        }`
      );

      const messageId = `wamid.${Date.now()}`;

      console.log("[RTA] Notificação enviada:", {
        phone,
        notificationType,
        message,
      });

      return NextResponse.json({
        success: true,
        data: {
          messageId,
          status: "sent",
          timestamp: new Date().toISOString(),
        },
      });
    }

    /* ===== Listar templates ===== */
    if (action === "get_templates") {
      return NextResponse.json({
        success: true,
        data: Object.values(messageTemplates),
      });
    }

    return NextResponse.json(
      { success: false, error: "Ação não reconhecida" },
      { status: 400 }
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
   GET – VERIFICAÇÃO WEBHOOK
========================= */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }

  return NextResponse.json(
    { success: false, error: "Verificação falhou" },
    { status: 403 }
  );
}

/* =========================
   PUT – RECEBER WEBHOOK
========================= */
export async function PUT(request: NextRequest) {
  try {
    const webhookData: WhatsAppWebhook = await request.json();

    webhookData.entry?.forEach((entry) => {
      entry.changes.forEach((change) => {
        change.value.messages?.forEach((msg) => {
          if (msg.text?.body) {
            console.log("[RTA] Mensagem recebida:", {
              from: msg.from,
              body: msg.text.body,
            });
          }
        });

        change.value.statuses?.forEach((status) => {
          console.log("[RTA] Status mensagem:", status);
        });
      });
    });

    return NextResponse.json({
      success: true,
      message: "Webhook processado com sucesso",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro ao processar webhook",
      },
      { status: 500 }
    );
  }
}

