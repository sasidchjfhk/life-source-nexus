
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </Web3Provider>
  </QueryClientProvider>
);

export default App;
