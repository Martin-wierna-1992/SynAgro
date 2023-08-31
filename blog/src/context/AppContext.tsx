import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextData {
  isAuthenticated: boolean;
  login: (userId: number, name: string, email: string, token: string) => void; 
  logout: () => void;
  user: { id: number; name: string;email: string;token: string } | null; 
  posts: any[]; 
  updatePosts: (newPosts: any[]) => void; 
}

const AppContext = createContext<AppContextData | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: number; name: string,email: string,token: string } | null>(null); 
  const [posts, setPosts] = useState<any[]>([]); 

  const login = (userId: number, name: string,email: string,token: string) => { 
    setIsAuthenticated(true);
    setUser({ id: userId, name: name , email: email, token: token}); 
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

export const useAppContext = (): AppContextData => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext debe utilizarse dentro de un AppContextProvider');
  }
  return context;
};
