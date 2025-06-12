
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
  
  const profile = useQuery(api.users.getInfluencerProfile);
  // Fetch all discoverable campaigns
  const allCampaigns = useQuery(api.campaign.allCampaigns);
  // Fetch campaigns the influencer is active in
  const activeCampaigns = useQuery(api.campaign.activeForInfluencer);
  // Fetch campaigns the influencer has applied to
  const myApplications = useQuery(api.campaign.campaignsForInfluencer);

  // function CampaignListByNiche({ selectedNiche }) {
  //   const campaigns = useQuery(api.campaign.campaignsByNiche, selectedNiche ? { niche: selectedNiche } : undefined);
  
  //   if (!campaigns) return <div>Loading...</div>;
  
  //   return (
  //     <div>
  //       {campaigns.length === 0 && <div>No campaigns found for this niche.</div>}
  //       {campaigns.map(c => (
  //         <Card key={c._id}>
  //           <CardHeader>
  //             <CardTitle>{c.title}</CardTitle>
  //             <CardDescription>{c.description}</CardDescription>
  //           </CardHeader>
  //         </Card>
  //       ))}
  //     </div>
  //   );
  // }

  const [selectedNiche, setSelectedNiche] = useState("");

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
            Discover new campaigns and manage your influencer journey.
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
                Discover Campaigns
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




// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { 
//   TrendingUp, 
//   Users, 
//   Eye, 
//   Heart, 
//   DollarSign, 
//   Calendar,
//   Camera,
//   Star,
//   Bell,
//   Settings,
//   Plus,
//   Instagram,
//   Music,
//   Twitter,
//   Youtube
// } from "lucide-react";
// import { useQuery } from "convex/react";
// import { api } from "../../convex/_generated/api";
// import { PortfolioItem } from "@/components/onboarding/steps/PortfolioSetup";
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
// import Header from "@/components/Header";

// const InfluencerDashboard = () => {
//   const stats = [
//     {
//       title: "Total Followers",
//       value: "125.4K",
//       icon: Users,
//       change: "+12.5%",
//       color: "text-primary"
//     },
//     {
//       title: "Engagement Rate",
//       value: "4.8%",
//       icon: Heart,
//       change: "+0.3%",
//       color: "text-secondary"
//     },
//     {
//       title: "Monthly Views",
//       value: "2.1M",
//       icon: Eye,
//       change: "+8.7%",
//       color: "text-accent"
//     },
//     {
//       title: "Earnings (MTD)",
//       value: "$3,250",
//       icon: DollarSign,
//       change: "+15.2%",
//       color: "text-green-600"
//     }
//   ];

//   const activeCampaigns = [
//     {
//       id: 1,
//       brand: "EcoStyle",
//       title: "Sustainable Fashion Week",
//       status: "In Progress",
//       deadline: "2024-06-15",
//       payment: "$850",
//       completion: 65
//     },
//     {
//       id: 2,
//       brand: "TechFlow",
//       title: "Smart Home Review",
//       status: "Pending",
//       deadline: "2024-06-20",
//       payment: "$1,200",
//       completion: 25
//     },
//     {
//       id: 3,
//       brand: "FitLife",
//       title: "Wellness Challenge",
//       status: "Review",
//       deadline: "2024-06-10",
//       payment: "$650",
//       completion: 90
//     }
//   ];

//   const recentActivity = [
//     {
//       type: "campaign",
//       message: "New campaign invitation from EcoStyle",
//       time: "2 hours ago",
//       icon: Calendar
//     },
//     {
//       type: "payment",
//       message: "Payment received: $850 from TechFlow",
//       time: "1 day ago",
//       icon: DollarSign
//     },
//     {
//       type: "content",
//       message: "Content approved for FitLife campaign",
//       time: "2 days ago",
//       icon: Camera
//     },
//     {
//       type: "milestone",
//       message: "Reached 125K followers milestone!",
//       time: "3 days ago",
//       icon: Star
//     }
//   ];

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "In Progress":
  //       return "bg-blue-100 text-blue-800";
  //     case "Pending":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "Review":
  //       return "bg-purple-100 text-purple-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  // const profile = useQuery(api.users.getInfluencerProfile);
  // console.log("Profile data in influencer dashboard:", profile);
  // if (!profile) {
  //   return <div>Loading profile...</div>;
  // }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
//       <Header />
//       <div className="container mx-auto px-4 py-8">
//           {/* Welcome Section */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
//               Welcome, {profile.name}👋
//             </h1>
//             <p className="text-gray-600 font-sofia">
//               Here's what's happening with your influencer journey today.
//             </p>
//           </div>

      //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      //       {/* Profile Overview */}
      //       <div className="bg-white rounded-lg shadow p-6">
      //         <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
      //         <div className="space-y-2">
      //           <p><strong>Niche:</strong> {profile.niche}</p>
      //           <p><strong>Location:</strong> {profile.location}</p>
      //           <p><strong>Followers:</strong> {profile.followerCount}</p>
      //         </div>
      //       </div>
            
      //       {/* Social Media */}
      //       <div className="bg-white rounded-lg shadow p-6">
      //         <h2 className="text-xl font-semibold mb-4">Social Media</h2>
      //         <div className="space-y-2">
      //           {profile.socialAccounts && Object.entries(profile.socialAccounts).map(([platform, username]) => (
      //             username && (
      //               <div key={platform} className="flex items-center space-x-2">
      //                 {platform === "instagram" && <Instagram className="h-5 w-5 text-pink-600" />}
      //                 {platform === "tiktok" && <Music className="h-5 w-5 text-black" />}
      //                 {platform === "youtube" && <Youtube className="h-5 w-5 text-red-600" />}
      //                 {platform === "twitter" && <Twitter className="h-5 w-5 text-blue-600" />}
      //                 <span>{username}</span>
      //                 {platform === profile.primaryPlatform && (
      //                   <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Primary</span>
      //                 )}
      //               </div>
      //             )
      //           ))}
      //         </div>
      //       </div>
            
      //       {/* Portfolio */}
      //       <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
      //         <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
      //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      //           {profile.portfolio && profile.portfolio.map((item: PortfolioItem) => (
      //             <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      //               <div className="p-4">
      //                 <h3 className="font-medium">{item.title}</h3>
      //                 <p className="text-sm text-gray-600 mt-1">{item.description}</p>
      //                 <div className="flex justify-between text-xs text-gray-500 mt-2">
      //                   <span>{item.metrics.followers} views</span>
      //                   <span>{item.metrics.likes} likes</span>
      //                 </div>
      //               </div>
      //             </div>
      //           ))}
      //         </div>
      //       </div>
      //   </div>
      // </div>
//     </div>
//   );
// };

// export default InfluencerDashboard;
