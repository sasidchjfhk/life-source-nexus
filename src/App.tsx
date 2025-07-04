
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Web3Provider } from "./contexts/Web3Context";
import Index from "./pages/Index";
import Register from "./pages/Register";
import DonorRegistration from "./pages/DonorRegistration";
import DonorDashboard from "./pages/DonorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import DonorDetails from "./pages/DonorDetails";
import { useState, createContext, useContext } from "react";

// Create auth context to manage authentication state
interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  userRole: "donor" | "hospital" | "admin" | null;
  login: (name: string, role: "donor" | "hospital" | "admin") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userName: "",
  userRole: null,
  login: () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

// Create wallet context to manage wallet connection state
interface WalletContextType {
  isConnected: boolean;
  address: string;
  connect: (address: string) => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: "",
  connect: () => {},
  disconnect: () => {}
});

export const useWallet = () => useContext(WalletContext);

const queryClient = new QueryClient();

const App = () => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState<"donor" | "hospital" | "admin" | null>(null);
  
  // Wallet state
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  
  // Auth functions
  const login = (name: string, role: "donor" | "hospital" | "admin") => {
    setIsLoggedIn(true);
    setUserName(name);
    setUserRole(role);
  };
  
  const logout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserRole(null);
  };
  
  // Wallet functions
  const connect = (address: string) => {
    setIsConnected(true);
    setAddress(address);
  };
  
  const disconnect = () => {
    setIsConnected(false);
    setAddress("");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isLoggedIn, userName, userRole, login, logout }}>
        <WalletContext.Provider value={{ isConnected, address, connect, disconnect }}>
          <Web3Provider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/donor-registration" element={<DonorRegistration />} />
                  <Route path="/donor-dashboard" element={<DonorDashboard />} />
                  <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/donor/:id" element={<DonorDetails />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </Web3Provider>
        </WalletContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
