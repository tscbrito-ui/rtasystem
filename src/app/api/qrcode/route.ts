import { NextRequest, NextResponse } from "next/server";
import QRCode, {
  QRCodeToDataURLOptions,
  QRCodeToBufferOptions,
} from "qrcode";

/**
 * Força runtime Node.js
 * Necessário para Buffer funcionar corretamente
 */
export const runtime = "nodejs";

/* =========================
   POST – Retorna Data URL
========================= */
export async function POST(request: NextRequest) {
  try {
    const body: {
      text?: string;
      options?: QRCodeToDataURLOptions;
    } = await request.json();

    const { text, options } = body;

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Texto é obrigatório" },
        { status: 400 }
      );
    }

    const qrOptions: QRCodeToDataURLOptions = {
      errorCorrectionLevel: "M",
      type: "image/png",
      margin: 1,
      width: 256,
      color: {
        dark: "#000000ff",
        light: "#ffffffff",
      },
      ...(options ?? {}),
    };

    const qrCodeDataURL = await QRCode.toDataURL(text, qrOptions);

    return NextResponse.json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        text,
        format: "data-url",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro ao gerar QR Code",
      },
      { status: 500 }
    );
  }
}

/* =========================
   GET – Retorna PNG
========================= */
export async function GET() {
  try {
    const text = "meu texto de teste";

    const qrOptions: QRCodeToBufferOptions = {
      color: {
        light: "#ffffff",
      },
    };

    const qrCodeBuffer = await QRCode.toBuffer(text, qrOptions);

    return new Response(new Uint8Array(qrCodeBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": qrCodeBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro ao gerar QR Code",
      },
      { status: 500 }
    );
  }
}
