
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InfluencerOnboarding from "./pages/InfluencerOnboarding";
import BrandDashboard from "./pages/BrandDashboard";
import CampaignCreation from "./pages/CampaignCreation";
import InfluencerDiscovery from "./pages/InfluencerDiscovery";
import NotFound from "./pages/NotFound";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import InfluencerDashboard from "./pages/InfluencerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BrandOnboarding from "./pages/BrandOnboarding";

const queryClient = new QueryClient();



const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding/influencer" element={<InfluencerOnboarding />} />
           <Route path="/onboarding/brand" element={<BrandOnboarding />} />
           {/* <Route path="/onboarding/brand" element={<CampaignCreation />} /> */}
          <Route path="/brand/dashboard" element={<BrandDashboard />} />
          <Route path="/brand/campaigns/create" element={<CampaignCreation />} />
          <Route path="/brand/discover" element={<InfluencerDiscovery />} />
          <Route path="/influencer/dashboard" element={<InfluencerDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
