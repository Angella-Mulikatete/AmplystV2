import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { SignedIn } from "@clerk/clerk-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Edit, Target, MessageSquare, Star, Calendar, Clock, CheckCircle } from "lucide-react";
import CampaignDiscovery from "@/components/influencer/CampaignDiscovery";
import BrandDiscovery from "@/components/influencer/BrandDiscovery";
import MyApplications from "@/components/influencer/MyApplications";

const InfluencerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Live data queries
  const profile = useQuery(api.users.getInfluencerProfile, {});
  const allCampaigns = useQuery(api.campaign.allCampaigns);
  const activeCampaigns = useQuery(api.campaign.activeForInfluencer);
  const applications = useQuery(api.applications.listInfluencerApplications);
  const allBrands = useQuery(api.brands.listBrands);

  if (!profile || !allCampaigns || !activeCampaigns || !applications || !allBrands) {
    return (
      <DashboardLayout userRole="influencer">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7CA5]"></div>
        </div>
      </DashboardLayout>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards using profile data */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-primary-800">
                  ${profile.totalEarnings?.toLocaleString() ?? '0'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-primary-800">
                  {activeCampaigns.length}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-primary-800">
                  {applications.length}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Campaigns</p>
                <p className="text-2xl font-bold text-primary-800">
                  {allCampaigns.length}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Campaigns</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab('discover')}
            >
              Find More
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeCampaigns.length > 0 ? (
            <div className="space-y-4">
              {activeCampaigns.map((campaign) => (
                <motion.div
                  key={campaign._id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{campaign.title}</h3>
                      <p className="text-sm text-gray-600">by {campaign.creatorUserId}</p>
                    </div>
                    <Badge 
                      variant={campaign.status === 'active' ? 'default' : 'secondary'}
                      className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span>${campaign.budget?.toLocaleString() ?? 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span>{campaign.targetAudience || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{campaign.contentTypes?.join(', ') || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">
                      Upload Content
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Campaigns</h3>
              <p className="text-gray-600 mb-4">Start exploring campaigns to find your next opportunity</p>
              <Button onClick={() => setActiveTab('discover')}>
                Discover Campaigns
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderApplications = () => (
    <Card>
      <CardHeader>
        <CardTitle>My Applications</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Track the status of your campaign applications
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications?.length > 0 ? (
            applications.map((application) => (
              <div 
                key={application._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      {application.brandName?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{application.campaignTitle}</h3>
                      <p className="text-sm text-gray-600">{application.brandName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={
                            application.status === 'pending' ? 'secondary' :
                            application.status === 'approved' ? 'default' :
                            'destructive'
                          }
                        >
                          {application.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(application._creationTime).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600">Your campaign applications will appear here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <SignedIn>
      <DashboardLayout userRole="influencer" userName={profile.name} userAvatar={profile.profilePictureUrl}>
        <div className="space-y-6">
          {/* Welcome Header */}
          <motion.div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome back, {profile.name}! 👋</h1>
                <p className="text-white/90">
                  {activeCampaigns.length > 0 
                    ? `You have ${activeCampaigns.length} active campaigns`
                    : "Discover new campaigns to join"}
                </p>
              </div>
              <Button variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="brands">Brands</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              {renderOverview()}
            </TabsContent>

            <TabsContent value="discover" className="mt-6">
              <CampaignDiscovery campaigns={allCampaigns} profile={profile} />
            </TabsContent>

            <TabsContent value="brands" className="mt-6">
              <BrandDiscovery brands={allBrands} campaigns={allCampaigns} />
            </TabsContent>

            <TabsContent value="applications" className="mt-6">
              {renderApplications()}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </SignedIn>
  );
};

export default InfluencerDashboard;













// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
//   Youtube,
//   Building
// } from "lucide-react";
// import { useState } from "react";
// import Header from "@/components/Header";
// import CampaignDiscovery from "@/components/influencer/CampaignDiscovery";
// import BrandDiscovery from "@/components/influencer/BrandDiscovery";
// import ProfileStats from "@/components/influencer/ProfileStats";
// import ActiveCampaigns from "../components/influencer/ActiveCampaign";
// import MyApplications from "@/components/influencer/MyApplications";
// import { api } from "../../convex/_generated/api";
// import { PortfolioItem } from "@/components/onboarding/steps/PortfolioSetup";
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
// import { useQuery } from "convex/react";

// const InfluencerDashboard = () => {
//   const [activeTab, setActiveTab] = useState("discover");
  
//   const profile = useQuery(api.users.getInfluencerProfile, {});
//   // Fetch all discoverable campaigns
//   const allCampaigns = useQuery(api.campaign.allCampaigns);
//   // Fetch campaigns the influencer is active in
//   const activeCampaigns = useQuery(api.campaign.activeForInfluencer);
//   // Fetch campaigns the influencer has applied to
//   const myApplications = useQuery(api.campaign.campaignsForInfluencer);
//   // Fetch all brands
//   const allBrands = useQuery(api.brands.listBrands);

//   if (!profile || !allCampaigns || !activeCampaigns || !myApplications || !allBrands) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#3A7CA5]/5 to-[#88B04B]/5">
//         <Header />
//         <div className="container mx-auto px-4 py-8">
//           <div className="flex items-center justify-center min-h-[200px]">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7CA5]"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#3A7CA5]/5 to-[#88B04B]/5">
//       <Header />
      
//       <div className="container mx-auto px-4 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Welcome back, {profile.name}! 👋
//           </h1>
//           <p className="text-gray-600">
//             Discover campaigns and manage your applications.
//           </p>
//         </div>

//         {/* Quick Stats */}
//         <ProfileStats profile={profile} />

//         {/* Navigation Tabs */}
//         <div className="mb-8">
//           <div className="border-b border-gray-200">
//             <nav className="-mb-px flex space-x-8">
//               <button
//                 onClick={() => setActiveTab("discover")}
//                 className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === "discover"
//                     ? "border-[#3A7CA5] text-[#3A7CA5]"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 Discover Campaigns
//               </button>
//               <button
//                 onClick={() => setActiveTab("brands")}
//                 className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === "brands"
//                     ? "border-[#3A7CA5] text-[#3A7CA5]"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 Browse Brands
//               </button>
//               <button
//                 onClick={() => setActiveTab("active")}
//                 className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === "active"
//                     ? "border-[#3A7CA5] text-[#3A7CA5]"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 Active Campaigns
//               </button>
//               <button
//                 onClick={() => setActiveTab("applications")}
//                 className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === "applications"
//                     ? "border-[#3A7CA5] text-[#3A7CA5]"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 My Applications
//               </button>
//             </nav>
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="space-y-6">
//           {activeTab === "discover" && (
//             <CampaignDiscovery campaigns={allCampaigns} profile={profile} />
//           )}
//           {activeTab === "brands" && (
//             <BrandDiscovery brands={allBrands} campaigns={allCampaigns} />
//           )}
//           {activeTab === "active" && (
//             <ActiveCampaigns campaigns={activeCampaigns} profile={profile} />
//           )}
//           {activeTab === "applications" && (
//             <MyApplications campaigns={myApplications} profile={profile} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InfluencerDashboard;
