import { motion } from "framer-motion";
import { api } from "../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { SignedIn } from "@clerk/clerk-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Edit, Target, MessageSquare, Star, Calendar, Clock, CheckCircle, Users } from "lucide-react";
import CampaignDiscovery from "@/components/influencer/CampaignDiscovery";
import BrandDiscovery from "@/components/influencer/BrandDiscovery";
import MyApplications from "@/components/influencer/MyApplications";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const InfluencerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [showViewProfile, setShowViewProfile] = useState(false);
  const { toast } = useToast();
  
  // Live data queries
  const profile = useQuery(api.users.getInfluencerProfile, {});
  const allCampaigns = useQuery(api.campaign.allCampaigns);
  // const allCampaigns = useQuery(api.campaign.allCampaignsWithCreators);
  const activeCampaigns = useQuery(api.campaign.activeForInfluencer);
  const applications = useQuery(api.applications.listInfluencerApplications);
  const allBrands = useQuery(api.brands.listBrands);

  // Mutations
  const updateProfile = useMutation(api.users.insertProfile);

  const handleViewProfile = () => {
    setShowViewProfile(true);
  };

  const handleEditProfile = () => {
    setEditingProfile({
      name: profile?.name || '',
      bio: profile?.bio || '',
      niche: profile?.niche || '',
      location: profile?.location || '',
      portfolio: profile?.portfolio || [],
      socialAccounts: profile?.socialAccounts || {
        instagram: '',
        tiktok: '',
        youtube: '',
        twitter: '',
      },
    });
    setShowEditProfile(true);
    setShowViewProfile(false);
  };

  const handleSaveProfile = async () => {
    try {
      // Update the first portfolio item's followers if it exists, or create a new one
      const updatedPortfolio = editingProfile.portfolio.length > 0 
        ? [
            {
              ...editingProfile.portfolio[0],
              metrics: {
                ...editingProfile.portfolio[0].metrics,
                followers: editingProfile.followerCount
              }
            },
            ...editingProfile.portfolio.slice(1)
          ]
        : [{
            type: "image",
            title: "Profile",
            description: "Profile metrics",
            url: "",
            metrics: {
              followers: editingProfile.followerCount,
              likes: "0",
              comments: "0",
              shares: "0"
            }
          }];

      await updateProfile({
        role: "influencer",
        ...editingProfile,
        portfolio: updatedPortfolio
      });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
        variant: "success"
      });
      setShowEditProfile(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const renderEditProfileModal = () => (
    <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editingProfile?.name || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                name: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={editingProfile?.bio || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                bio: e.target.value
              })}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="niche">Niche</Label>
            <Input
              id="niche"
              value={editingProfile?.niche || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                niche: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={editingProfile?.location || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                location: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="followerCount">Follower Count</Label>
            <Input
              id="followerCount"
              value={editingProfile?.portfolio?.[0]?.metrics?.followers || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                followerCount: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>Social Media Accounts</Label>
            <div className="grid gap-2">
              <Input
                placeholder="Instagram"
                value={editingProfile?.socialAccounts?.instagram || ''}
                onChange={(e) => setEditingProfile({
                  ...editingProfile,
                  socialAccounts: {
                    ...editingProfile.socialAccounts,
                    instagram: e.target.value
                  }
                })}
              />
              <Input
                placeholder="TikTok"
                value={editingProfile?.socialAccounts?.tiktok || ''}
                onChange={(e) => setEditingProfile({
                  ...editingProfile,
                  socialAccounts: {
                    ...editingProfile.socialAccounts,
                    tiktok: e.target.value
                  }
                })}
              />
              <Input
                placeholder="YouTube"
                value={editingProfile?.socialAccounts?.youtube || ''}
                onChange={(e) => setEditingProfile({
                  ...editingProfile,
                  socialAccounts: {
                    ...editingProfile.socialAccounts,
                    youtube: e.target.value
                  }
                })}
              />
              <Input
                placeholder="Twitter"
                value={editingProfile?.socialAccounts?.twitter || ''}
                onChange={(e) => setEditingProfile({
                  ...editingProfile,
                  socialAccounts: {
                    ...editingProfile.socialAccounts,
                    twitter: e.target.value
                  }
                })}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 sticky bottom-0 bg-white pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => setShowEditProfile(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveProfile}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Update Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderViewProfileModal = () => (
    <Dialog open={showViewProfile} onOpenChange={setShowViewProfile}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
              {profile?.name?.charAt(0)}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{profile?.name}</h3>
                <p className="text-sm text-gray-600">{profile?.bio}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Niche</p>
                  <p className="font-medium">{profile?.niche || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{profile?.location || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Followers</p>
                  <p className="font-medium">
                    {profile?.portfolio?.find(item => item.type === 'image')?.metrics?.followers || '0'}
                  </p>
                </div>
              </div>
              {profile?.socialAccounts && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Social Media</p>
                  <div className="flex gap-4">
                    {profile.socialAccounts.instagram && (
                      <a href={profile.socialAccounts.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        Instagram
                      </a>
                    )}
                    {profile.socialAccounts.tiktok && (
                      <a href={profile.socialAccounts.tiktok} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        TikTok
                      </a>
                    )}
                    {profile.socialAccounts.youtube && (
                      <a href={profile.socialAccounts.youtube} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        YouTube
                      </a>
                    )}
                    {profile.socialAccounts.twitter && (
                      <a href={profile.socialAccounts.twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        Twitter
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleEditProfile}>
              Edit Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Calculate approved applications count
  const approvedApplicationsCount = applications ? applications.filter(app => app.status === 'approved').length : 0;

  if (!profile || !allCampaigns || !activeCampaigns || !applications || !allBrands) {
    return (
      <DashboardLayout 
        userRole="influencer"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7CA5]"></div>
        </div>
      </DashboardLayout>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profile</CardTitle>
            <Button 
              variant="secondary" 
              className="bg-white text-primary-600 hover:bg-gray-100"
              onClick={handleViewProfile}
            >
              <Edit className="w-4 h-4 mr-2" />
              View Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              {profile?.name?.charAt(0)}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{profile?.name}</h3>
                <p className="text-sm text-gray-600">{profile?.bio}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Niche</p>
                  <p className="font-medium">{profile?.niche || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{profile?.location || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Followers</p>
                  <p className="font-medium">
                    {profile?.portfolio?.find(item => item.type === 'image')?.metrics?.followers || '0'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <p className="text-sm text-gray-600">Approved Applications</p>
                <p className="text-2xl font-bold text-primary-800">
                  {approvedApplicationsCount}
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
                  {allCampaigns.filter(campaign => campaign.status === 'active').length}
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
          {activeCampaigns.filter(campaign => campaign.status === 'active').length > 0 ? (
            <div className="space-y-4">
              {activeCampaigns
                .filter(campaign => campaign.status === 'active')
                .map((campaign) => (
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
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Active
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
                      {application.campaignTitle?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{application.campaignTitle}</h3>
                      <p className="text-sm text-gray-600">{application.influencerName}</p>
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
      <DashboardLayout 
        userRole="influencer" 
        userName={profile.name}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <div className="space-y-6">
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

      {/* Modals */}
      {renderEditProfileModal()}
      {renderViewProfileModal()}
    </SignedIn>
  );
};

export default InfluencerDashboard;