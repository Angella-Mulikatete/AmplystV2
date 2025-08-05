// BrandDiscoveryPage.tsx
import { useNavigate } from "react-router-dom";
import BrandDiscovery from "@/components/influencer/BrandDiscovery";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Button } from "@/components/ui/button";

const BrandDiscoveryPage = () => {
  const navigate = useNavigate();
  const brands = useQuery(api.brands.listBrands);
  const campaigns = useQuery(api.campaign.allCampaigns, {});

  if (!brands || !campaigns) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7CA5] mx-auto"></div>
        <span className="ml-4 text-gray-600">Loading brands...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/influencer/dashboard")}
        >
          ← Back to Dashboard
        </Button>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Discover Brands</h1>
      <BrandDiscovery brands={brands} campaigns={campaigns} />
    </div>
  );
};

export default BrandDiscoveryPage;
