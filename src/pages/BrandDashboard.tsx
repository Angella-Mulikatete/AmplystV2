
import { useQuery,useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import Header from "@/components/Header";
import BrandNavbar from "@/components/brand/BrandNavbar";

export default function BrandDashboard() {
  const campaigns = useQuery(api.campaign.listMyCampaigns);
  const influencers = useQuery(api.influencers.listInfluencers);
  const [matchedInfluencersMap, setMatchedInfluencersMap] = useState({});
  const [loadingCampaignId, setLoadingCampaignId] = useState(null);


  async function fetchMatchedInfluencers(campaign, influencers) {
    const response = await fetch('http://localhost:3001/api/ai-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaign, influencers }),
    });
    const data = await response.json();
    return data.influencerIds || [];
  }

  if (!campaigns || !influencers) return <div>Loading...</div>;

  return (
    <div>
      {/* <Header /> */}
      <BrandNavbar />
      <div className="max-w-4xl mx-auto p-6">
     
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Campaigns</h2>
          <Link to="/brand/campaigns/create">
            <Button>Create New Campaign</Button>
          </Link>
        </div>
        {campaigns.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No campaigns yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {campaigns.map(campaign => {
              const matchedIds = matchedInfluencersMap[campaign._id] || [];
              const matchedInfluencers = influencers.filter(i => matchedIds.includes(i._id));

              const handleMatchClick = async () => {
                setLoadingCampaignId(campaign._id);
                const ids = await fetchMatchedInfluencers(campaign, influencers);
                console.log("Matched Influencers IDs:", ids);
                setMatchedInfluencersMap(prev => ({ ...prev, [campaign._id]: ids }));
                setLoadingCampaignId(null);
              };

              return (
                <Card key={campaign._id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">{campaign.title}</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{campaign.status}</span>
                    </div>
                    <div className="text-sm text-gray-700">{campaign.description}</div>
                    <div className="flex gap-4 text-xs text-gray-500 mt-2">
                      <span><strong>Budget:</strong> ${campaign.budget || "N/A"}</span>
                      <span><strong>Duration:</strong> {campaign.duration || "N/A"}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {campaign.contentTypes?.map(type => (
                        <span key={type} className="bg-gray-200 px-2 py-1 rounded text-xs">{type}</span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">View Applications</Button>
                    
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Link to="/brand/discover">
                        <Button variant="outline">Discover Influencers</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={handleMatchClick}
                        disabled={loadingCampaignId === campaign._id}
                      >
                        {loadingCampaignId === campaign._id ? "Matching..." : "AI Match Influencers"}
                      </Button>
                    </div>

                    {matchedInfluencers.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">AI Recommended Influencers:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {matchedInfluencers.map(influencer => (
                            <div key={influencer._id} className="p-2 border rounded">
                              <p className="font-medium">{influencer.name}</p>
                              <p className="text-sm text-gray-600">{influencer.niche} • {influencer.location}</p>
                              <p className="text-xs text-gray-500">Followers: {influencer.followerCount}</p>
                              <Button 
                                size="sm"   
                                // onClick={() => handleViewProfile(influencer._id)}
                              >
                                View Profile
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
  
      </div>
    </div>
   
  );
}




















// import { useQuery } from "convex/react";
// import { api } from "../../convex/_generated/api";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { useState } from "react";

// export default function BrandDashboard() {
//   const [matchedInfluencersMap, setMatchedInfluencersMap] = useState({});
//   const [loadingCampaignId, setLoadingCampaignId] = useState(null);
//   const campaigns = useQuery(api.campaign.listMyCampaigns);
//   const influencers = useQuery(api.influencers.listInfluencers);

//   async function fetchMatchedInfluencers(campaign, influencers) {
//     const response = await fetch('http://localhost:3001/api/ai-match', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ campaign, influencers }),
//     });
//     const data = await response.json();
//     console.log("data for matched Influencers in brandDashboard component:", data);
//     return data.influencerIds || [];
//   }

  

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Your Campaigns</h2>
//         <Link to="/brand/campaigns/create">
//           <Button>Create New Campaign</Button>
//         </Link>
//       </div>
//       {(!campaigns || campaigns.length === 0) ? (
//         <div className="text-gray-500 text-center py-8">No campaigns yet.</div>
//       ) : (
//         <div className="grid md:grid-cols-2 gap-6">
//           {campaigns.map(campaign => (
//             <Card key={campaign._id}>
//               <CardContent className="p-4 space-y-2">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-lg font-semibold">{campaign.title}</h3>
//                   <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{campaign.status}</span>
//                 </div>
//                 <div className="text-sm text-gray-700">{campaign.description}</div>
//                 <div className="flex gap-4 text-xs text-gray-500 mt-2">
//                   <span><strong>Budget:</strong> ${campaign.budget || "N/A"}</span>
//                   <span><strong>Duration:</strong> {campaign.duration || "N/A"}</span>
//                 </div>
//                 <div className="flex gap-2 mt-2">
//                   {campaign.contentTypes?.map(type => (
//                     <span key={type} className="bg-gray-200 px-2 py-1 rounded text-xs">{type}</span>
//                   ))}
//                 </div>
//                 <div className="flex gap-2 mt-4">
//                   <Button size="sm" variant="outline">Edit</Button>
//                   <Button size="sm" variant="outline">View Applications</Button>
//                   <Link to="/brand/discover">
//                     <Button variant="outline">Discover Influencers</Button>
//                   </Link>

//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }











// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Plus, TrendingUp, Users, DollarSign, Eye } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import BrandNavbar from "@/components/brand/BrandNavbar";
// import CampaignOverview from "@/components/brand/CampaignOverview";
// import RecentActivity from "@/components/brand/RecentActivity";

// const BrandDashboard = () => {
//   const navigate = useNavigate();
//   const [stats] = useState({
//     totalCampaigns: 12,
//     activeCampaigns: 5,
//     totalInfluencers: 48,
//     totalSpent: 25000,
//     totalReach: 2400000,
//     engagement: 4.2
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
//       <BrandNavbar />
      
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 font-poppins">Dashboard</h1>
//             <p className="text-gray-600 mt-2 font-sofia">Manage your influencer campaigns</p>
//           </div>
//           <Button 
//             onClick={() => navigate("/brand/campaigns/create")}
//             className="bg-primary hover:bg-primary-600 shadow-lg hover-lift"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Create Campaign
//           </Button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card className="hover-lift animate-fade-in">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
//               <TrendingUp className="h-4 w-4 text-primary" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
//               <p className="text-xs text-muted-foreground">
//                 +2 from last month
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.1s' }}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
//               <Users className="h-4 w-4 text-secondary" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
//               <p className="text-xs text-muted-foreground">
//                 Running this month
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.2s' }}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
//               <DollarSign className="h-4 w-4 text-accent" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">${stats.totalSpent.toLocaleString()}</div>
//               <p className="text-xs text-muted-foreground">
//                 +12% from last month
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.3s' }}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
//               <Eye className="h-4 w-4 text-primary" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{(stats.totalReach / 1000000).toFixed(1)}M</div>
//               <p className="text-xs text-muted-foreground">
//                 Across all campaigns
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <CampaignOverview />
//           </div>
//           <div>
//             <RecentActivity />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BrandDashboard;
