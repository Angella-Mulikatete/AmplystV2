import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  DollarSign, 
  Calendar,
  Camera,
  Star,
  Bell,
  Settings,
  Plus,
  Instagram,
  Music,
  Twitter,
  Youtube
} from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import CampaignDiscovery from "@/components/influencer/CampaignDiscovery";
import ProfileStats from "@/components/influencer/ProfileStats";
import ActiveCampaigns from "../components/influencer/ActiveCampaign";
import MyApplications from "@/components/influencer/MyApplications";
import { api } from "../../convex/_generated/api";
import { PortfolioItem } from "@/components/onboarding/steps/PortfolioSetup";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useQuery } from "convex/react";

const InfluencerDashboard = () => {
  const [activeTab, setActiveTab] = useState("discover");
  
  const profile = useQuery(api.users.getInfluencerProfile, {});
  // Fetch all discoverable campaigns
  const allCampaigns = useQuery(api.campaign.allCampaigns);
  // Fetch campaigns the influencer is active in
  const activeCampaigns = useQuery(api.campaign.activeForInfluencer);
  // Fetch campaigns the influencer has applied to
  const myApplications = useQuery(api.campaign.campaignsForInfluencer);

  const [selectedNiche, setSelectedNiche] = useState("");
  const allBrands = useQuery(api.brands.listBrands);

  console.log("Profile data in influencer dashboard:", profile);
  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3A7CA5]/5 to-[#88B04B]/5">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile.name}! 👋
          </h1>
          <p className="text-gray-600">
            Discover campaigns and manage your applications.
          </p>
        </div>

        {/* Quick Stats */}
        <ProfileStats profile={profile} />

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("discover")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "discover"
                    ? "border-[#3A7CA5] text-[#3A7CA5]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Discover
              </button>
              <button
                onClick={() => setActiveTab("active")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "active"
                    ? "border-[#3A7CA5] text-[#3A7CA5]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Active Campaigns
              </button>
              <button
                onClick={() => setActiveTab("applications")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "applications"
                    ? "border-[#3A7CA5] text-[#3A7CA5]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Applications
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "discover" && (
            <CampaignDiscovery campaigns={allCampaigns ?? []} profile={profile} />
          )}
          {activeTab === "active" && (
            <ActiveCampaigns campaigns={activeCampaigns ?? []} profile={profile} />
          )}
          {activeTab === "applications" && (
            <MyApplications campaigns={myApplications ?? []} profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
};

export default InfluencerDashboard;
