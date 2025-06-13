import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
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
  User,
  CheckCircle,
  XCircle,
  Instagram,
  Music,
  Youtube
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BrandNavbar from "@/components/brand/BrandNavbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Id } from "../../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7CA5]"></div>
  </div>
);

export default function BrandDashboard() {
  const { toast } = useToast();
  
  // All state declarations
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showApplications, setShowApplications] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<Id<"profiles"> | null>(null);
  const [showInfluencerProfile, setShowInfluencerProfile] = useState(false);
  const [showEditCampaign, setShowEditCampaign] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [campaignToExtend, setCampaignToExtend] = useState(null);
  const [matchedInfluencersMap, setMatchedInfluencersMap] = useState({});
  const [loadingMatch, setLoadingMatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  // All queries
  const brandProfile = useQuery(api.brands.getMyBrandProfile);
  const campaigns = useQuery(api.campaign.listMyCampaigns);
  const influencers = useQuery(api.influencers.listInfluencers);
  const selectedInfluencerProfile = useQuery(
    api.users.getInfluencerProfileById,
    selectedInfluencerId ? { userId: selectedInfluencerId } : "skip"
  );

  // All mutations
  const updateApplicationStatus = useMutation(api.campaign.updateApplicationStatus);
  const updateCampaign = useMutation(api.campaign.updateCampaign);
  const deleteCampaign = useMutation(api.campaign.deleteCampaign);
  const extendCampaign = useMutation(api.campaign.extendCampaign);
  const updateBrandProfile = useMutation(api.brands.updateBrandProfile);

  const handleExtendCampaign = async (campaign) => {
    setCampaignToExtend(campaign);
    setShowExtendModal(true);
  };

  // Check for expired campaigns
  useEffect(() => {
    if (!campaigns) return;

    const checkExpiredCampaigns = () => {
      const now = new Date();
      campaigns.forEach(campaign => {
        if (campaign.status === "active" && campaign.endDate) {
          const endDate = new Date(campaign.endDate);
          if (endDate < now) {
            handleExtendCampaign(campaign);
          }
        }
      });
    };

    checkExpiredCampaigns();
    const interval = setInterval(checkExpiredCampaigns, 1000 * 60 * 60); // Check every hour
    return () => clearInterval(interval);
  }, [campaigns]);

  // Loading state
  if (!brandProfile || !campaigns || !influencers) return <Loading />;

  const handleUpdateStatus = async (applicationId, newStatus, influencerName) => {
    setProcessingStatus(applicationId);
    try {
      await updateApplicationStatus({ applicationId, status: newStatus });
      
      // Update the local state to reflect the change immediately
      if (selectedCampaign) {
        const updatedApplications = selectedCampaign.applications.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        );
        setSelectedCampaign({
          ...selectedCampaign,
          applications: updatedApplications
        });
      }

      // The campaigns query will automatically update due to Convex's real-time updates
      toast({
        title: `Application ${newStatus}`,
        description: `You have ${newStatus} ${influencerName}'s application.`,
        variant: newStatus === "accepted" ? "success" : "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating application status:", error);
    } finally {
      setProcessingStatus(null);
    }
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalBudget = campaigns.reduce((acc, campaign) => acc + (campaign.budget || 0), 0);

  const filteredInfluencers = influencers.filter(influencer =>
    influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.niche.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getApplicationStats = (campaign) => {
    if (!campaign?.applications) return { total: 0, pending: 0, accepted: 0, rejected: 0 };
    
    return campaign.applications.reduce((acc, app) => {
      acc.total++;
      acc[app.status]++;
      return acc;
    }, { total: 0, pending: 0, accepted: 0, rejected: 0 });
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setShowEditCampaign(true);
  };

  const handleUpdateCampaign = async (updatedData) => {
    try {
      // Only send the fields that the mutation expects
      const campaignUpdate = {
        campaignId: editingCampaign._id,
        title: updatedData.title,
        description: updatedData.description,
        budget: updatedData.budget,
        status: updatedData.status,
        targetAudience: updatedData.targetAudience,
        contentTypes: updatedData.contentTypes,
        duration: updatedData.duration,
        requirements: updatedData.requirements
      };

      await updateCampaign(campaignUpdate);
      setShowEditCampaign(false);
      setEditingCampaign(null);
      toast({
        title: "Campaign Updated",
        description: "Your campaign has been successfully updated.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCampaign = async (campaign) => {
    setCampaignToDelete(campaign);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCampaign({ campaignId: campaignToDelete._id });
      setShowDeleteConfirm(false);
      setCampaignToDelete(null);
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been successfully deleted.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmExtend = async (newEndDate) => {
    try {
      await extendCampaign({
        campaignId: campaignToExtend._id,
        newEndDate: newEndDate
      });
      setShowExtendModal(false);
      setCampaignToExtend(null);
      toast({
        title: "Campaign Extended",
        description: "The campaign has been successfully extended.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extend campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditProfile = () => {
    setEditingProfile(brandProfile);
    setShowEditProfile(true);
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      await updateBrandProfile({
        companyName: updatedData.companyName,
        industry: updatedData.industry,
        contactPerson: updatedData.contactPerson,
        businessEmail: updatedData.businessEmail,
        location: updatedData.location,
        campaignGoal: updatedData.campaignGoal,
        targetAudience: updatedData.targetAudience,
        budgetRange: updatedData.budgetRange,
        description: updatedData.description
      });
      
      setShowEditProfile(false);
      setEditingProfile(null);
      toast({
        title: "Profile Updated Successfully",
        description: "Your brand profile has been updated. The changes will be reflected immediately.",
        variant: "success",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

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

          {/* Brand Profile Overview */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-[#3A7CA5]" />
                Brand Profile Overview
              </CardTitle>
              <Button variant="outline" size="sm" className="text-[#3A7CA5] border-[#3A7CA5] hover:bg-[#3A7CA5] hover:text-white" onClick={handleEditProfile}>
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8 overflow-x-auto pb-4">
              {/* Company Info */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 rounded-full bg-[#3A7CA5]/10 flex items-center justify-center flex-shrink-0">
                  <Building className="h-6 w-6 text-[#3A7CA5]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Company</p>
                  <p className="font-medium text-gray-900">{brandProfile.companyName}</p>
                  <p className="text-sm text-[#3A7CA5]">{brandProfile.industry}</p>
                </div>
              </div>

              {/* Contact Person */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 rounded-full bg-[#3A7CA5]/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-[#3A7CA5]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-medium text-gray-900">{brandProfile.contactPerson}</p>
                  <p className="text-sm text-gray-500">{brandProfile.businessEmail}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 rounded-full bg-[#3A7CA5]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-[#3A7CA5]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{brandProfile.location}</p>
                </div>
              </div>

              {/* Campaign Goal */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 rounded-full bg-[#88B04B]/10 flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-[#88B04B]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Campaign Goal</p>
                  <p className="font-medium text-gray-900">{brandProfile.campaignGoal}</p>
                </div>
              </div>

              {/* Target Audience */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 rounded-full bg-[#88B04B]/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-[#88B04B]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Target Audience</p>
                  <p className="font-medium text-gray-900">{brandProfile.targetAudience}</p>
                </div>
              </div>

              {/* Budget Range */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 rounded-full bg-[#88B04B]/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-[#88B04B]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget Range</p>
                  <p className="font-medium text-gray-900">{brandProfile.budgetRange}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                      {campaign.requirements && campaign.requirements.includes('Required Influencers:') && (
                        <Badge variant="outline" className="bg-[#E19629]/10 text-[#E19629] border-[#E19629]/20">
                          {campaign.requirements.split('Required Influencers:')[1].split('.')[0].trim()} Influencers
                        </Badge>
                      )}
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

                    {campaign.applications && campaign.applications.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Badge variant="outline" className="bg-[#E19629]/10 text-[#E19629] border-[#E19629]/20">
                          {getApplicationStats(campaign).pending} Pending
                        </Badge>
                        <Badge variant="outline" className="bg-[#88B04B]/10 text-[#88B04B] border-[#88B04B]/20">
                          {getApplicationStats(campaign).accepted} Accepted
                        </Badge>
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                          {getApplicationStats(campaign).rejected} Rejected
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 min-w-[80px]"
                        onClick={() => handleEditCampaign(campaign)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 min-w-[120px] relative"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setShowApplications(true);
                        }}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Applications</span>
                          {campaign.applications?.length > 0 && (
                            <Badge 
                              variant="secondary" 
                              className="absolute -top-2 -right-2 bg-[#3A7CA5] text-white transform scale-90"
                            >
                              {getApplicationStats(campaign).total}
                            </Badge>
                          )}
                        </div>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive" 
                        className="w-[80px]"
                        onClick={() => handleDeleteCampaign(campaign)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Applications Modal */}
        <Dialog open={showApplications} onOpenChange={setShowApplications}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Applications for {selectedCampaign?.title}</DialogTitle>
            </DialogHeader>
            {selectedCampaign && (
              <>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">{getApplicationStats(selectedCampaign).total}</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-[#E19629]">{getApplicationStats(selectedCampaign).pending}</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Accepted</p>
                      <p className="text-2xl font-bold text-[#88B04B]">{getApplicationStats(selectedCampaign).accepted}</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Rejected</p>
                      <p className="text-2xl font-bold text-red-600">{getApplicationStats(selectedCampaign).rejected}</p>
                    </div>
                  </Card>
                </div>

                <div className="space-y-4">
                  {selectedCampaign.applications?.length === 0 ? (
                    <Card className="p-8 text-center">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                      <p className="text-gray-600">This campaign hasn't received any applications from influencers yet.</p>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {selectedCampaign.applications?.map((application) => {
                        const influencer = influencers.find(i => i._id === application.influencerUserId);
                        return (
                          <Card key={application._id} className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <img
                                  src={influencer?.profilePictureUrl || "/placeholder.svg"}
                                  alt={influencer?.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                  <h4 className="font-medium">{influencer?.name}</h4>
                                  <p className="text-sm text-gray-600">{influencer?.niche}</p>
                                  <p className="text-sm mt-2">{application.pitch}</p>
                                  <div className="mt-2">
                                    <Badge
                                      className={
                                        application.status === "pending"
                                          ? "bg-[#E19629]/10 text-[#E19629] border-[#E19629]/20"
                                          : application.status === "accepted"
                                          ? "bg-[#88B04B]/10 text-[#88B04B] border-[#88B04B]/20"
                                          : "bg-red-50 text-red-600 border-red-200"
                                      }
                                    >
                                      {application.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {application.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-green-500 hover:bg-green-600"
                                      onClick={() => handleUpdateStatus(application._id, "accepted", influencer?.name)}
                                      disabled={processingStatus === application._id}
                                    >
                                      {processingStatus === application._id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                      ) : (
                                        <>
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Approve
                                        </>
                                      )}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleUpdateStatus(application._id, "rejected", influencer?.name)}
                                      disabled={processingStatus === application._id}
                                    >
                                      {processingStatus === application._id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                      ) : (
                                        <>
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject
                                        </>
                                      )}
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

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
                    onClick={() => {
                      setSelectedInfluencerId(influencer._id);
                      setShowInfluencerProfile(true);
                    }}
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

      {/* Update the Influencer Profile Modal */}
      <Dialog open={showInfluencerProfile} onOpenChange={setShowInfluencerProfile}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Influencer Profile</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInfluencerProfile(false)}
              className="h-8 w-8"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </DialogHeader>
          {selectedInfluencerProfile ? (
            <div className="space-y-6">
              <div className="flex items-start space-x-6">
                <img
                  src={selectedInfluencerProfile.profilePictureUrl || "/placeholder.svg"}
                  alt={selectedInfluencerProfile.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedInfluencerProfile.name}</h3>
                  <p className="text-lg text-gray-600">{selectedInfluencerProfile.niche}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{selectedInfluencerProfile.location}</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Followers</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedInfluencerProfile.followerCount?.toLocaleString() || '0'}
                    </p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Engagement Rate</p>
                    <p className="text-2xl font-bold text-[#88B04B]">
                      {selectedInfluencerProfile.engagementRate || '0'}%
                    </p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Social Accounts</p>
                    <p className="text-2xl font-bold text-[#E19629]">
                      {Object.keys(selectedInfluencerProfile.socialAccounts || {}).length}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Social Media Links */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">Social Media</h4>
                <div className="space-y-3">
                  {selectedInfluencerProfile.socialAccounts?.instagram && (
                    <a
                      href={selectedInfluencerProfile.socialAccounts.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#3A7CA5] hover:underline"
                    >
                      <Instagram className="h-5 w-5" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {selectedInfluencerProfile.socialAccounts?.tiktok && (
                    <a
                      href={selectedInfluencerProfile.socialAccounts.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#3A7CA5] hover:underline"
                    >
                      <Music className="h-5 w-5" />
                      <span>TikTok</span>
                    </a>
                  )}
                  {selectedInfluencerProfile.socialAccounts?.youtube && (
                    <a
                      href={selectedInfluencerProfile.socialAccounts.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#3A7CA5] hover:underline"
                    >
                      <Youtube className="h-5 w-5" />
                      <span>YouTube</span>
                    </a>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">About</h4>
                <p className="text-gray-600">{selectedInfluencerProfile.bio || "No bio available."}</p>
              </Card>

              {selectedInfluencerProfile.portfolio && selectedInfluencerProfile.portfolio.length > 0 && (
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Portfolio</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedInfluencerProfile.portfolio.map((item, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                          <h5 className="text-white font-medium">{item.title}</h5>
                          <p className="text-white/80 text-sm">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7CA5]"></div>
              <p className="ml-3 text-gray-600">Loading profile...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Modal */}
      <Dialog open={showEditCampaign} onOpenChange={setShowEditCampaign}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          {editingCampaign && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input
                    id="title"
                    defaultValue={editingCampaign.title}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue={editingCampaign.description}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    defaultValue={editingCampaign.budget}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, budget: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    defaultValue={editingCampaign.duration}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, duration: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    defaultValue={editingCampaign.requirements}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, requirements: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditCampaign(false);
                    setEditingCampaign(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleUpdateCampaign(editingCampaign)}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this campaign? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Extend Campaign Modal */}
      <Dialog open={showExtendModal} onOpenChange={setShowExtendModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Campaign Expired</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>This campaign has expired. Would you like to extend it?</p>
            <div>
              <Label htmlFor="newEndDate">New End Date</Label>
              <Input
                id="newEndDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => confirmExtend(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowExtendModal(false);
                  setCampaignToExtend(null);
                }}
              >
                Let it Expire
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Brand Profile</DialogTitle>
          </DialogHeader>
          {editingProfile && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    defaultValue={editingProfile.companyName}
                    onChange={(e) => setEditingProfile({ ...editingProfile, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    defaultValue={editingProfile.industry}
                    onChange={(e) => setEditingProfile({ ...editingProfile, industry: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    defaultValue={editingProfile.contactPerson}
                    onChange={(e) => setEditingProfile({ ...editingProfile, contactPerson: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    defaultValue={editingProfile.businessEmail}
                    onChange={(e) => setEditingProfile({ ...editingProfile, businessEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    defaultValue={editingProfile.location}
                    onChange={(e) => setEditingProfile({ ...editingProfile, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignGoal">Campaign Goal</Label>
                  <Input
                    id="campaignGoal"
                    defaultValue={editingProfile.campaignGoal}
                    onChange={(e) => setEditingProfile({ ...editingProfile, campaignGoal: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    defaultValue={editingProfile.targetAudience}
                    onChange={(e) => setEditingProfile({ ...editingProfile, targetAudience: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetRange">Budget Range</Label>
                  <Input
                    id="budgetRange"
                    defaultValue={editingProfile.budgetRange}
                    onChange={(e) => setEditingProfile({ ...editingProfile, budgetRange: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue={editingProfile.description}
                  onChange={(e) => setEditingProfile({ ...editingProfile, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditProfile(false);
                    setEditingProfile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleUpdateProfile(editingProfile)}
                  className="bg-[#3A7CA5] hover:bg-[#3A7CA5]/90"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
