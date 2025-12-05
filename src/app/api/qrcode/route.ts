import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, options = {} } = body;

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Texto é obrigatório' },
        { status: 400 }
      );
    }

    // Configurações padrão do QR Code
    const qrOptions = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256,
      ...options
    };

    // Gerar QR Code como Data URL
    const qrCodeDataURL = await QRCode.toDataURL(text, qrOptions);

    return NextResponse.json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        text: text,
        format: 'data-url'
      }
    });

  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao gerar QR Code' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');
    const size = parseInt(searchParams.get('size') || '256');

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Parâmetro text é obrigatório' },
        { status: 400 }
      );
    }

    const qrOptions = {
      errorCorrectionLevel: 'M' as const,
      type: 'png' as const,
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: size
    };

    // Gerar QR Code como buffer
    const qrCodeBuffer = await QRCode.toBuffer(text, qrOptions);

    return new NextResponse(qrCodeBuffer as any, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': qrCodeBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });

  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao gerar QR Code' 
      },
      { status: 500 }
    );
  }
}