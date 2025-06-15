import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, Eye, Calendar, Star, Zap, Target, MessageSquare, Search, CheckCircle, XCircle } from "lucide-react";
import MatchedInfluencersList from "../components/brand/MatchedInfluencer";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface Application {
  _id: string;
  status: 'pending' | 'approved' | 'rejected';
  influencerName: string;
  influencerEmail: string;
  campaignTitle: string;
  _creationTime: number;
  [key: string]: any;
}

const BrandDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showEditCampaign, setShowEditCampaign] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // Real-time data fetching
  const brandProfile = useQuery(api.brands.getMyBrandProfile);
  const campaigns = useQuery(api.campaign.listMyCampaigns);
  const influencers = useQuery(api.influencers.listInfluencers);
  const userRole = useQuery(api.users.getMyRole);
  const applications = useQuery(api.applications.listApplications) as Application[] | undefined;

  // Mutations
  const updateCampaign = useMutation(api.campaign.updateCampaign);
  const deleteCampaign = useMutation(api.campaign.deleteCampaign);
  const updateApplication = useMutation(api.applications.updateApplication);

  // Analytics data derived from queries
  const analytics = [
    {
      label: "Active Campaigns",
      value: campaigns?.filter(c => c.status === 'active').length || 0,
      icon: <Zap className="w-8 h-8 text-primary-500" />,
      change: campaigns ? `+${campaigns.filter(c => c.status === 'active' && new Date(c._creationTime) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} this month` : "Loading...",
    },
    {
      label: "Total Reach",
      value: brandProfile?.totalReach ? `${(brandProfile.totalReach / 1000000).toFixed(1)}M` : "0",
      icon: <Eye className="w-8 h-8 text-secondary-500" />,
      change: brandProfile?.reachChange ? `${brandProfile.reachChange > 0 ? '+' : ''}${brandProfile.reachChange}% vs last month` : "Loading...",
    },
    {
      label: "Spend",
      value: brandProfile?.totalSpent ? `$${(brandProfile.totalSpent / 1000).toFixed(1)}K` : "$0",
      icon: <DollarSign className="w-8 h-8 text-green-500" />,
      change: "This year",
    },
    {
      label: "Applications",
      value: applications?.length || 0,
      icon: <MessageSquare className="w-8 h-8 text-purple-500" />,
      change: applications ? `${applications.filter(a => a.status === 'pending').length} pending` : "Loading...",
    }
  ];

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setShowEditCampaign(true);
  };

  const handleDeleteCampaign = async () => {
    try {
      await deleteCampaign({ campaignId: campaignToDelete._id });
      toast({
        title: "Campaign Deleted",
        description: `${campaignToDelete.title} has been removed`,
        variant: "success"
      });
    } catch (error) {
      toast({ 
        title: "Deletion Failed", 
        description: error.message,
        variant: "destructive" 
      });
    }
    setShowDeleteConfirm(false);
  };

  const handleSaveCampaign = async (updatedData) => {
    try {
      await updateCampaign({
        campaignId: editingCampaign._id,
        ...updatedData
      });
      toast({
        title: "Campaign Updated",
        description: `${editingCampaign.title} has been updated`,
        variant: "success"
      });
      setShowEditCampaign(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleApplicationAction = async (applicationId, action) => {
    try {
      await updateApplication({
        applicationId,
        status: action
      });
      toast({
        title: `Application ${action}`,
        description: `The application has been ${action.toLowerCase()}ed`,
        variant: "success"
      });
      setShowApplicationModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action.toLowerCase()} application`,
        variant: "destructive"
      });
    }
  };

  const renderCampaignActions = (campaign) => (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleEditCampaign(campaign)}
      >
        Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm"
        onClick={() => {
          setCampaignToDelete(campaign);
          setShowDeleteConfirm(true);
        }}
      >
        Delete
      </Button>
    </div>
  );

  const renderEditCampaignModal = () => (
    <Dialog open={showEditCampaign} onOpenChange={setShowEditCampaign}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit {editingCampaign?.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title</Label>
            <Input
              id="title"
              value={editingCampaign?.title || ''}
              onChange={(e) => setEditingCampaign({
                ...editingCampaign,
                title: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              value={editingCampaign?.budget || 0}
              onChange={(e) => setEditingCampaign({
                ...editingCampaign,
                budget: parseInt(e.target.value)
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editingCampaign?.description || ''}
              onChange={(e) => setEditingCampaign({
                ...editingCampaign,
                description: e.target.value
              })}
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => setShowEditCampaign(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleSaveCampaign({
              title: editingCampaign.title,
              budget: editingCampaign.budget,
              description: editingCampaign.description
            })}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderApplicationModal = () => (
    <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        {selectedApplication && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                {selectedApplication.influencerName?.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{selectedApplication.influencerName}</h3>
                <p className="text-sm text-gray-600">{selectedApplication.influencerEmail}</p>
                <Badge variant="outline" className="mt-1">
                  {selectedApplication.influencerNiche}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Campaign</h4>
              <p className="text-sm">{selectedApplication.campaignTitle}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Message</h4>
              <p className="text-sm text-gray-600">{selectedApplication.message}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Proposed Content</h4>
              <p className="text-sm text-gray-600">{selectedApplication.proposedContent}</p>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <Button 
                variant="outline" 
                onClick={() => handleApplicationAction(selectedApplication._id, 'rejected')}
              >
                Reject
              </Button>
              <Button 
                onClick={() => handleApplicationAction(selectedApplication._id, 'approved')}
              >
                Accept
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  if (!campaigns || !brandProfile || !influencers || !userRole) {
    return (
      <DashboardLayout userRole={userRole || "brand"}>
    <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
      </DashboardLayout>
  );
  }

  return (
    <DashboardLayout 
      userRole={userRole} 
      userName={brandProfile.companyName} 
      userAvatar={brandProfile.logoUrl}
    >
      <div className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Dashboard</TabsTrigger>
            <TabsTrigger value="discover">Discover Influencers</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Analytics Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analytics.map((metric) => (
                <Card key={metric.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                        <p className="text-sm text-gray-600">{metric.label}</p>
                        <p className="text-2xl font-bold text-primary-800">{metric.value}</p>
                  </div>
                      {metric.icon}
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-gray-600">{metric.change}</span>
                </div>
              </CardContent>
            </Card>
              ))}
          </div>

            {/* Campaign Management */}
          <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
              <CardTitle>Campaign Management</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/brand/campaigns/create")}
                  >
                    Create New
                  </Button>
                </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map(campaign => (
                    <div 
                      key={campaign._id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                    <div className="flex-1">
                      <h3 className="font-semibold">{campaign.title}</h3>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>Budget: ${campaign.budget}</span>
                          <Badge 
                            variant={
                              campaign.status === 'active' ? 'default' : 
                              campaign.status === 'draft' ? 'secondary' : 'outline'
                            }
                          >
                          {campaign.status}
                        </Badge>
                          <span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {renderCampaignActions(campaign)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

            {/* AI-matched influencers section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recommended Influencers</CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
        </div>
                <p className="text-sm text-gray-500 mt-1">
                  Tailored matches based on your niche and campaign preferences.
                </p>
              </CardHeader>
              <CardContent>
                <MatchedInfluencersList 
                  niche={brandProfile.industry} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discover" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Discover Influencers</CardTitle>
              </CardHeader>
              <CardContent>
          <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search influencers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
            />
                  </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {influencers
                    .filter(infl => 
                      infl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      infl.niche?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(influencer => (
              <Card key={influencer._id}>
                <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              {influencer.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                    <h3 className="font-semibold">{influencer.name}</h3>
                              <Badge variant="outline" className="mt-1">
                                {influencer.niche}
                              </Badge>
                              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                <Users className="w-4 h-4" />
                                <span>{influencer.followerCount?.toLocaleString() || '0'} followers</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Applications</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Review and manage influencer applications for your campaigns
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
                              {application.influencerName?.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{application.influencerName}</h3>
                              <p className="text-sm text-gray-600">{application.campaignTitle}</p>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowApplicationModal(true);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                      <p className="text-gray-600">Applications from influencers will appear here</p>
        </div>
      )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {renderEditCampaignModal()}
      
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete "{campaignToDelete?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCampaign}
            >
              Delete Campaign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {renderApplicationModal()}
    </DashboardLayout>
  );
};

export default BrandDashboard;