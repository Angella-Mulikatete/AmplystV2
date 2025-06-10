
// import { useQuery, useMutation } from "convex/react";
// import { api } from "../../convex/_generated/api";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import BrandNavbar from "@/components/brand/BrandNavbar";

// // Optional: Add your own loading and error components
// const Loading = () => <div>Loading...</div>;

// export default function BrandDashboard() {
//   // Fetch brand profile and campaigns
//   const brandProfile = useQuery(api.brands.getMyBrandProfile);
//   const campaigns = useQuery(api.campaign.listMyCampaigns);
//   const influencers = useQuery(api.influencers.listInfluencers);

//   // State for AI matches per campaign
//   const [matchedInfluencersMap, setMatchedInfluencersMap] = useState({});
//   const [loadingMatch, setLoadingMatch] = useState(null);

//   // Helper: Call your AI server for influencer matching
//   // async function fetchMatchedInfluencers(campaign, influencers) {
//   //   const response = await fetch("http://localhost:3001/api/ai-match", {
//   //     method: "POST",
//   //     headers: { "Content-Type": "application/json" },
//   //     body: JSON.stringify({ campaign, influencers }),
//   //   });
//   //   const data = await response.json();
//   //   return data.influencerIds || [];
//   // }

//   // Handle AI matching for a campaign
//   // const handleMatchClick = async (campaign) => {
//   //   setLoadingMatch(campaign._id);
//   //   const ids = await fetchMatchedInfluencers(campaign, influencers);
//   //   console.log("Matched Influencers IDs:", ids);
//   //   setMatchedInfluencersMap((prev) => ({ ...prev, [campaign._id]: ids }));
//   //   setLoadingMatch(null);
//   // };

//   if (!brandProfile || !campaigns || !influencers) return <Loading />;

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-8">
//       <BrandNavbar/>
//       {/* Brand Profile Overview */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Welcome, {brandProfile.companyName}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <p><strong>Industry:</strong> {brandProfile.industry}</p>
//               <p><strong>Contact:</strong> {brandProfile.contactPerson} ({brandProfile.businessEmail})</p>
//               <p><strong>Location:</strong> {brandProfile.location}</p>
//               <p><strong>Description:</strong> {brandProfile.description}</p>
//             </div>
//             <div>
//               <p><strong>Campaign Goal:</strong> {brandProfile.campaignGoal}</p>
//               <p><strong>Target Audience:</strong> {brandProfile.targetAudience}</p>
//               <p><strong>Preferred Influencer Type:</strong> {brandProfile.influencerType}</p>
//               <p><strong>Budget Range:</strong> {brandProfile.budgetRange}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Campaign Management Section */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Your Campaigns</h2>
//         <Link to="/brand/campaigns/create">
//           <Button>Create New Campaign</Button>
//         </Link>
//       </div>
//       {campaigns.length === 0 ? (
//         <div className="text-gray-500 text-center py-8">No campaigns yet.</div>
//       ) : (
//         <div className="grid md:grid-cols-2 gap-6">
//           {campaigns.map((campaign) => {
//             const matchedIds = matchedInfluencersMap[campaign._id] || [];
//             const matchedInfluencers = influencers.filter((i) =>
//               matchedIds.includes(i._id)
//             );
//             return (
//               <Card key={campaign._id}>
//                 <CardHeader>
//                   <CardTitle>{campaign.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="mb-2">{campaign.description}</p>
//                   <div className="flex gap-2 mb-2">
//                     <Badge>{campaign.status}</Badge>
//                     <Badge>
//                       {campaign.budget ? `$${campaign.budget}` : "No Budget"}
//                     </Badge>
//                     <Badge>{campaign.duration}</Badge>
//                   </div>
//                   <div className="flex gap-2 mb-4">
//                     {campaign.contentTypes?.map((type) => (
//                       <Badge key={type}>{type}</Badge>
//                     ))}
//                   </div>
//                   <div className="flex gap-2">
//                     <Button size="sm" variant="outline">
//                       Edit
//                     </Button>
//                     <Button size="sm" variant="outline">
//                       View Applications
//                     </Button>
//                     <Link to="/brand/discover">
//                       <Button size="sm" variant="outline">
//                         Discover Influencers
//                       </Button>
//                     </Link>
//                     <Button
//                       size="sm"
//                       variant="default"
//                       // onClick={() => handleMatchClick(campaign)}
//                       disabled={loadingMatch === campaign._id}
//                     >
//                       {loadingMatch === campaign._id
//                         ? "Matching..."
//                         : "AI Match Influencers"}
//                     </Button>
//                   </div>
//                   {/* AI Matched Influencers */}
//                   {/* {matchedInfluencers.length > 0 && (
//                     <div className="mt-4">
//                       <h4 className="font-semibold mb-2">
//                         AI Recommended Influencers:
//                       </h4>
//                       <div className="grid grid-cols-1 gap-2">
//                         {matchedInfluencers.map((influencer) => (
//                           <div
//                             key={influencer._id}
//                             className="p-2 border rounded flex flex-col"
//                           >
//                             <span className="font-medium">
//                               {influencer.name}
//                             </span>
//                             <span className="text-xs text-gray-600">
//                               {influencer.niche} • {influencer.location}
//                             </span>
//                             <span className="text-xs text-gray-500">
//                               Followers: {influencer.followerCount}
//                             </span>
//                             <Button size="sm" variant="outline" className="mt-2">
//                               View Profile
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )} */}
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}

//       {/* Influencer Discovery Section */}
//       <div>
//         <div className="flex justify-between items-center mt-12 mb-4">
//           <h2 className="text-2xl font-bold">Discover Influencers</h2>
//           <Link to="/brand/discover">
//             <Button variant="outline">Advanced Search</Button>
//           </Link>
//         </div> 
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {influencers.slice(0, 6).map((influencer) => (
//             <Card key={influencer._id}>
//               <CardContent className="p-4">
//                 <div className="flex items-center space-x-4">
//                   <img
//                     src={influencer.profilePictureUrl || "/placeholder.jpg"}
//                     alt={influencer.name}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                   <div>
//                     <h3 className="font-semibold">{influencer.name}</h3>
//                     <p className="text-sm text-gray-500">
//                       {influencer.niche} • {influencer.location}
//                     </p>
//                     <span className="text-xs text-gray-600">
//                       Followers: {influencer.followerCount}
//                     </span>
//                   </div>
//                 </div>
//                 <Button size="sm" variant="outline" className="mt-4">
//                   View Profile
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* Analytics Placeholder */}
//       <Card className="mt-12">
//         <CardHeader>
//           <CardTitle>Analytics & Reporting</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-gray-600">
//             Track your campaign performance, influencer engagement, and ROI here.
//             (Coming soon)
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Search,
  Filter,
  BarChart3,
  Target,
  MapPin,
  Building,
  Mail,
  User
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import BrandNavbar from "@/components/brand/BrandNavbar";

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7CA5]"></div>
  </div>
);

export default function BrandDashboard() {
  const brandProfile = useQuery(api.brands.getMyBrandProfile);
  const campaigns = useQuery(api.campaign.listMyCampaigns);
  const influencers = useQuery(api.influencers.listInfluencers);

  const [matchedInfluencersMap, setMatchedInfluencersMap] = useState({});
  const [loadingMatch, setLoadingMatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  if (!brandProfile || !campaigns || !influencers) return <Loading />;

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  // const totalApplications = campaigns.reduce((acc, campaign) => acc + (campaign.applications?.length || 0), 0);
  const totalBudget = campaigns.reduce((acc, campaign) => acc + (campaign.budget || 0), 0);

  const filteredInfluencers = influencers.filter(influencer =>
    influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.niche.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3A7CA5]/5 to-[#88B04B]/5">
      <BrandNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {brandProfile.companyName}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your campaigns and discover talented influencers for your brand.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                  <p className="text-3xl font-bold text-gray-900">{activeCampaigns}</p>
                </div>
                <div className="p-3 bg-[#3A7CA5]/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-[#3A7CA5]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{totalApplications}</p>
                </div>
                <div className="p-3 bg-[#88B04B]/10 rounded-full">
                  <Users className="h-6 w-6 text-[#88B04B]" />
                </div>
              </div>
            </CardContent>
          </Card> */}
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Budget</p>
                  <p className="text-3xl font-bold text-gray-900">${totalBudget.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Influencers Found</p>
                  <p className="text-3xl font-bold text-gray-900">{influencers.length}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Brand Profile Overview */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-[#3A7CA5]" />
              Brand Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-900">{brandProfile.industry}</p>
                    <p className="text-sm text-gray-600">Industry</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-900">{brandProfile.contactPerson}</p>
                    <p className="text-sm text-gray-600">Contact Person</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-900">{brandProfile.businessEmail}</p>
                    <p className="text-sm text-gray-600">Business Email</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-900">{brandProfile.location}</p>
                    <p className="text-sm text-gray-600">Location</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-900">{brandProfile.campaignGoal}</p>
                    <p className="text-sm text-gray-600">Campaign Goal</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-900">{brandProfile.targetAudience}</p>
                    <p className="text-sm text-gray-600">Target Audience</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-900">{brandProfile.influencerType}</p>
                    <p className="text-sm text-gray-600">Preferred Influencer Type</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-900">{brandProfile.budgetRange}</p>
                    <p className="text-sm text-gray-600">Budget Range</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Management Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Campaigns</h2>
            <Link to="/brand/campaigns/create">
              <Button className="bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/90 hover:to-[#88B04B]/90">
                <Plus className="h-4 w-4 mr-2" />
                Create New Campaign
              </Button>
            </Link>
          </div>
          
          {campaigns.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                <p className="text-gray-600 mb-6">Create your first campaign to start connecting with influencers.</p>
                <Link to="/brand/campaigns/create">
                  <Button className="bg-gradient-to-r from-[#3A7CA5] to-[#88B04B]">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign._id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm line-clamp-2">{campaign.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant={campaign.status === 'active' ? 'default' : 'secondary'}
                        className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {campaign.status}
                      </Badge>
                      {campaign.budget && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          ${campaign.budget.toLocaleString()}
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {campaign.duration}
                      </Badge>
                    </div>
                    
                    {campaign.contentTypes && (
                      <div className="flex flex-wrap gap-1">
                        {campaign.contentTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 min-w-0">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 min-w-0">
                        Applications
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Link to="/brand/discover" className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          <Search className="h-3 w-3 mr-1" />
                          Discover
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/90 hover:to-[#88B04B]/90"
                        disabled={loadingMatch === campaign._id}
                      >
                        {loadingMatch === campaign._id ? "Matching..." : "AI Match"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Influencer Discovery Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Discover Influencers</h2>
            <Link to="/brand/discover">
              <Button variant="outline" className="border-[#3A7CA5] text-[#3A7CA5] hover:bg-[#3A7CA5] hover:text-white">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Search
              </Button>
            </Link>
          </div>
          
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search influencers by name or niche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-md"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfluencers.slice(0, 6).map((influencer) => (
              <Card key={influencer._id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={influencer.profilePictureUrl || "/placeholder.svg"}
                      alt={influencer.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{influencer.name}</h3>
                      <p className="text-sm text-gray-600">{influencer.niche}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{influencer.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-[#3A7CA5]" />
                      <span className="text-sm font-medium text-gray-900">
                        {influencer.followerCount?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">4.8</span>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full border-[#3A7CA5] text-[#3A7CA5] hover:bg-[#3A7CA5] hover:text-white"
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Analytics Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#3A7CA5]" />
              Analytics & Reporting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Track your campaign performance, influencer engagement metrics, and ROI analytics all in one place.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
