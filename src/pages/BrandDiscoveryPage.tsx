// BrandDiscoveryPage.tsx
import BrandDiscovery from "@/components/influencer/BrandDiscovery";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

const BrandDiscoveryPage = () => {
  const brands = useQuery(api.brands.listBrands);
  const campaigns = useQuery(api.campaign.allCampaigns, {});

  if (!brands || !campaigns) {
    return <div>Loading...</div>;
  }

  return <BrandDiscovery brands={brands} campaigns={campaigns} />;
};

export default BrandDiscoveryPage;
