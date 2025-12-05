import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'login') {
      const { email, password } = data;
      const result = await AuthService.login(email, password);
      
      return NextResponse.json({
        success: true,
        data: result
      });
    }

    if (action === 'register') {
      const result = await AuthService.register(data);
      
      return NextResponse.json({
        success: true,
        data: result
      });
    }

    if (action === 'logout') {
      AuthService.logout();
      
      return NextResponse.json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Ação não reconhecida' },
      { status: 400 }
    );

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

export async function GET() {
  try {
    const currentUser = AuthService.getCurrentUser();
    const currentRestaurant = AuthService.getCurrentRestaurant();

    return NextResponse.json({
      success: true,
      data: {
        user: currentUser,
        restaurant: currentRestaurant,
        isAuthenticated: AuthService.isAuthenticated(),
        hasBusinessAccess: AuthService.hasBusinessAccess()
      }
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