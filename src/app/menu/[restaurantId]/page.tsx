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
    // Buscar dados do restaurante
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
            <span className="text-white font-bold text-2xl">Z</span>
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
                  <span className="text-white font-bold text-xl">Z</span>
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

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Menu Principal */}
          <div className="lg:col-span-3">
            {/* Busca e Filtros */}
            <div className="bg-white rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar pratos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">Todas as categorias</option>
                    {menuData.categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Categorias */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">Todos</TabsTrigger>
                {menuData.categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Itens do Menu */}
            <div className="space-y-6">
              {selectedCategory === "all" ? (
                // Mostrar por categoria
                menuData.categories.map(category => (
                  <div key={category.id}>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.items
                        .filter(item => 
                          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(item => (
                          <Card key={item.id} className="overflow-hidden">
                            <div className="flex">
                              <div className="flex-1 p-4">
                                <CardHeader className="p-0 mb-2">
                                  <CardTitle className="text-lg">{item.name}</CardTitle>
                                  <CardDescription className="text-sm">
                                    {item.description}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-lg font-bold text-gray-900">
                                        R$ {item.price.toFixed(2)}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {item.preparationTime}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {getCartItemQuantity(item.id) > 0 ? (
                                        <div className="flex items-center space-x-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => removeFromCart(item.id)}
                                          >
                                            <Minus className="h-4 w-4" />
                                          </Button>
                                          <span className="font-medium">
                                            {getCartItemQuantity(item.id)}
                                          </span>
                                          <Button
                                            size="sm"
                                            onClick={() => addToCart(item)}
                                          >
                                            <Plus className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <Button
                                          size="sm"
                                          onClick={() => addToCart(item)}
                                          className="bg-gradient-to-r from-orange-500 to-red-500"
                                        >
                                          <Plus className="h-4 w-4 mr-1" />
                                          Adicionar
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </div>
                              <div className="w-24 h-24 m-4">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                // Mostrar itens filtrados
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems.map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="flex">
                        <div className="flex-1 p-4">
                          <CardHeader className="p-0 mb-2">
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {item.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-lg font-bold text-gray-900">
                                  R$ {item.price.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.preparationTime}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getCartItemQuantity(item.id) > 0 ? (
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeFromCart(item.id)}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="font-medium">
                                      {getCartItemQuantity(item.id)}
                                    </span>
                                    <Button
                                      size="sm"
                                      onClick={() => addToCart(item)}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => addToCart(item)}
                                    className="bg-gradient-to-r from-orange-500 to-red-500"
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Adicionar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </div>
                        <div className="w-24 h-24 m-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Carrinho */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Seu Pedido</span>
                    {getCartItemsCount() > 0 && (
                      <Badge className="bg-orange-500">
                        {getCartItemsCount()}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Seu carrinho está vazio</p>
                      <p className="text-sm text-gray-400">Adicione itens do cardápio</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              R$ {item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => addToCart(item)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-medium">Total:</span>
                          <span className="text-lg font-bold">
                            R$ {getCartTotal().toFixed(2)}
                          </span>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500">
                          Finalizar Pedido
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}