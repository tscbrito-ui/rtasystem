// Sistema de autenticação simulado para demonstração - RTA

// ---------------------- REGISTER DATA ----------------------
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  type: "user" | "business";   // <-- Campo obrigatório
  restaurantData?: {
    name: string;
    description: string;
    address: string;
    phone: string;
    plan: "free" | "pro";
  };
}

// ---------------------- USER MODEL -------------------------
export interface User {
  id: string;
  name: string;
  email: string;
  type: "user" | "business";
  restaurantId?: string;
  plan?: "free" | "pro";
  createdAt: Date;
}

// ---------------------- RESTAURANT MODEL -------------------
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  ownerId: string;
  plan: "free" | "pro";
  settings: {
    whatsappEnabled: boolean;
    gpsTrackingEnabled: boolean;
    kitchenDisplayEnabled: boolean;
  };
  createdAt: Date;
}

// ---------------------- MOCK DATA --------------------------
const mockUsers: User[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@restaurante.com",
    type: "business",
    restaurantId: "1",
    plan: "pro",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@cliente.com",
    type: "user",
    createdAt: new Date("2024-01-15"),
  },
];

const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Restaurante do João",
    description: "Comida caseira e deliciosa",
    address: "Rua das Flores, 123 - Centro",
    phone: "(11) 99999-9999",
    email: "contato@restaurantedojoao.com",
    ownerId: "1",
    plan: "pro",
    settings: {
      whatsappEnabled: true,
      gpsTrackingEnabled: true,
      kitchenDisplayEnabled: true,
    },
    createdAt: new Date("2024-01-01"),
  },
];

// ---------------------- AUTH SERVICE ------------------------
export class AuthService {
  private static currentUser: User | null = null;

  // --------------------- LOGIN ----------------------
  static async login(
    email: string,
    password: string
  ): Promise<{ user: User; restaurant?: Restaurant }> {

    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    this.currentUser = user;

    if (typeof window !== "undefined") {
      localStorage.setItem("rta_user", JSON.stringify(user));
    }

    const result: { user: User; restaurant?: Restaurant } = { user };

    if (user.type === "business" && user.restaurantId) {
      const restaurant = mockRestaurants.find((r) => r.id === user.restaurantId);
      if (restaurant) {
        result.restaurant = restaurant;

        if (typeof window !== "undefined") {
          localStorage.setItem("rta_restaurant", JSON.stringify(restaurant));
        }
      }
    }

    return result;
  }

  // --------------------- REGISTER ----------------------
  static async register(userData: RegisterData): Promise<{ user: User; restaurant?: Restaurant }> {

    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      type: userData.type,
      plan: userData.restaurantData?.plan || "free",
      createdAt: new Date(),
    };

    let newRestaurant: Restaurant | undefined;

    if (userData.type === "business" && userData.restaurantData) {
      newRestaurant = {
        id: Date.now().toString(),
        name: userData.restaurantData.name,
        description: userData.restaurantData.description,
        address: userData.restaurantData.address,
        phone: userData.restaurantData.phone,
        email: userData.email,
        ownerId: newUser.id,
        plan: userData.restaurantData.plan,
        settings: {
          whatsappEnabled: userData.restaurantData.plan === "pro",
          gpsTrackingEnabled: userData.restaurantData.plan === "pro",
          kitchenDisplayEnabled: true,
        },
        createdAt: new Date(),
      };

      newUser.restaurantId = newRestaurant.id;
      mockRestaurants.push(newRestaurant);
    }

    mockUsers.push(newUser);
    this.currentUser = newUser;

    if (typeof window !== "undefined") {
      localStorage.setItem("rta_user", JSON.stringify(newUser));

      if (newRestaurant) {
        localStorage.setItem("rta_restaurant", JSON.stringify(newRestaurant));
      }
    }

    return { user: newUser, restaurant: newRestaurant };
  }

  // --------------------- GET CURRENT USER ----------------------
  static getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("rta_user");
      if (stored) {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      }
    }

    return null;
  }

  // --------------------- GET CURRENT RESTAURANT ----------------------
  static getCurrentRestaurant(): Restaurant | null {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("rta_restaurant");
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return null;
  }

  // --------------------- LOGOUT ----------------------
  static logout(): void {
    this.currentUser = null;

    if (typeof window !== "undefined") {
      localStorage.removeItem("rta_user");
      localStorage.removeItem("rta_restaurant");
    }
  }

  // Helpers
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static hasBusinessAccess(): boolean {
    const user = this.getCurrentUser();
    return user?.type === "business";
  }

  static getRestaurantById(id: string): Restaurant | null {
    return mockRestaurants.find((r) => r.id === id) || null;
  }

  static getAllRestaurants(): Restaurant[] {
    return mockRestaurants;
  }
}
