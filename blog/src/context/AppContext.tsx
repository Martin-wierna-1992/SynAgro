import React, { createContext, useContext, useState, ReactNode } from 'react';
import jwtDecode from 'jwt-decode'; // Importar jwt-decode

// Definir el tipo de los datos del contexto
interface AppContextData {
  isAuthenticated: boolean;
  login: (userId: number, name: string, email: string, token: string) => void; // Agregar el parámetro 'name'
  logout: () => void;
  user: { id: number; name: string;email: string;token: string } | null; // Agregar el tipo apropiado para el usuario
  posts: any[]; // Cambia 'any' por el tipo apropiado para tus publicaciones
  updatePosts: (newPosts: any[]) => void; // Cambia 'any' por el tipo apropiado para tus publicaciones
}

// Crear el contexto general
const AppContext = createContext<AppContextData | undefined>(undefined);

// Definir el tipo para el proveedor del contexto
interface AppContextProviderProps {
  children: ReactNode;
}

// Crea el proveedor de contexto
export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: number; name: string,email: string,token: string } | null>(null); // Inicialmente no hay usuario
  const [posts, setPosts] = useState<any[]>([]); // Cambia 'any' por el tipo apropiado para tus publicaciones

  const login = (userId: number, name: string,email: string,token: string) => { // Agregar el parámetro 'name'
    setIsAuthenticated(true);
    // Aquí puedes realizar una llamada a la API para obtener los detalles del usuario basados en userId
    // Por ahora, simularemos un usuario con un nombre
    setUser({ id: userId, name: name , email: email, token: token}); // Usar el nombre proporcionado
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const updatePosts = (newPosts: any[]) => {
    setPosts(newPosts);
  };

  const appContextValue: AppContextData = {
    isAuthenticated,
    login,
    logout,
    user,
    posts,
    updatePosts,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Función para usar el contexto
export const useAppContext = (): AppContextData => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext debe utilizarse dentro de un AppContextProvider');
  }
  return context;
};
