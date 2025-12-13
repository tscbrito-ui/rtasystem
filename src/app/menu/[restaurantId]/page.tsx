"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthService, Restaurant } from "@/lib/auth";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Search, 
  MapPin, 
  Phone, 
  Clock,
  Star,
  Filter
} from "lucide-react";

// Dados simulados do cardápio
const menuData = {
  categories: [
    {
      id: 'pizzas',
      name: 'Pizzas',
      items: [
        {
          id: 1,
          name: 'Pizza Margherita',
          description: 'Molho de tomate, mussarela, manjericão fresco e azeite',
          price: 29.90,
          image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e9765895-f297-4b75-8aca-cd9a5dc363ea.png',
          category: 'pizzas',
          available: true,
          preparationTime: '25-30 min'
        },
        {
          id: 2,
          name: 'Pizza Pepperoni',
          description: 'Molho de tomate, mussarela e pepperoni',
          price: 32.90,
          image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d6fc722b-956a-4385-b49a-ab8ed57062c1.png',
          category: 'pizzas',
          available: true,
          preparationTime: '25-30 min'
        },
        {
          id: 3,
          name: 'Pizza Quatro Queijos',
          description: 'Mussarela, gorgonzola, parmesão e provolone',
          price: 35.90,
          image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e48d5577-0a44-407e-aff7-e6ca8157db14.png',
          category: 'pizzas',
          available: true,
          preparationTime: '25-30 min'
        }
      ]
    },
    {
      id: 'hamburgueres',
      name: 'Hambúrgueres',
      items: [
        {
          id: 4,
          name: 'Hambúrguer Clássico',
          description: 'Pão brioche, hambúrguer 180g, alface, tomate, cebola e molho especial',
          price: 24.90,
          image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/292a53a8-327c-4a79-aad1-446f3490b964.png',
          category: 'hamburgueres',
          available: true,
          preparationTime: '15-20 min'
        },
        {
          id: 5,
          name: 'Hambúrguer Bacon',
          description: 'Pão brioche, hambúrguer 180g, bacon crocante, queijo cheddar e molho barbecue',
          price: 28.90,
          image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/63c29e0c-cfa8-45fa-8489-9d816953b8d7.png',
          category: 'hamburgueres',
          available: true,
          preparationTime: '15-20 min'
        }
      ]
    },
    {
      id: 'massas',
      name: 'Massas',
      items: [
        {
          id: 6,
          name: 'Lasanha Bolonhesa',
          description: 'Massa fresca, molho bolonhesa, bechamel e queijo gratinado',
          price: 35.90,
          image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f5dac908-0e15-4d32-a6ca-d31d57c45276.png',
          category: 'massas',
          available: true,
          preparationTime: '30-35 min'
        },
        {
          id: 7,
          name: 'Espaguete Carbonara',
          description: 'Massa al dente, bacon, ovos, parmesão e pimenta do reino',
          price: 28.90,
          image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b5ef183f-252e-4992-9a42-8454c3bb48d1.png',
          category: 'massas',
          available: true,
          preparationTime: '20-25 min'
        }
      ]
    },
    {
      id: 'saladas',
      name: 'Saladas',
      items: [
        {
          id: 8,
          name: 'Salada Caesar',
          description: 'Alface romana, croutons, parmesão, frango grelhado e molho caesar',
          price: 18.90,
          image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2f42285c-7c92-4869-8892-6da42e4a02df.png',
          category: 'saladas',
          available: true,
          preparationTime: '10-15 min'
        }
      ]
    }
  ]
};

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function MenuPage() {
  const params = useParams();
  const restaurantId = params.restaurantId as string;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restaurantData = AuthService.getRestaurantById(restaurantId);
    setRestaurant(restaurantData);
    setIsLoading(false);
  }, [restaurantId]);

  const addToCart = (item: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image
        }];
      }
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        return prevCart.filter(cartItem => cartItem.id !== itemId);
      }
    });
  };

  const getCartItemQuantity = (itemId: number) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredItems = menuData.categories.flatMap(category => 
    category.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">RTA</span>
          </div>
          <p className="text-gray-600">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurante não encontrado</h1>
          <p className="text-gray-600">O restaurante que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header do Restaurante */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">RTA</span>
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>4.8 (234 avaliações)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>25-40 min</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-3">{restaurant.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{restaurant.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* menu */}
          ... (restante do seu código continua idêntico)

        </div>
      </div>
    </div>
  );
}
