import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RTA - Sistema de Gestão de Restaurantes",
  description:
    "Plataforma completa para gestão de restaurantes com cardápio online, pedidos e integração WhatsApp Business",
  keywords:
    "restaurante, cardápio online, pedidos, gestão, whatsapp business, qr code",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
