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
import { SignedIn } from "@clerk/clerk-react";

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
  const campaigns = useQuery(api.campaign.listMyCampaigns, { includeExpired: false });
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

  if (!brandProfile || !campaigns || !influencers || !userRole) {
    return (
      <DashboardLayout userRole={userRole || "brand"}>
    <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
      </DashboardLayout>
  );
  }

  return (
    <SignedIn>
    <DashboardLayout 
      userRole={userRole} 
      userName={brandProfile.companyName} 
      // userAvatar={brandProfile.logoUrl}
    >
        <div className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analytics.map((item, index) => (
              <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                      <p className="text-sm font-medium text-gray-500">{item.label}</p>
                      <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.change}</p>
                    </div>
                    {item.icon}
                </div>
              </CardContent>
            </Card>
              ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Campaigns Section */}
            <div className="lg:col-span-2">
          <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Active Campaigns</CardTitle>
                  <Button onClick={() => navigate('/brand/campaigns/create')}>
                    Create Campaign
                  </Button>
            </CardHeader>
            <CardContent>
                  {campaigns?.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No active campaigns yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/brand/campaigns/create')}
                      >
                        Create Your First Campaign
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {campaigns?.map((campaign) => (
                        <div key={campaign._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{campaign.title}</h3>
                              <p className="text-sm text-gray-500">{campaign.description}</p>
                            </div>
                            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                              {campaign.status}
                              </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                  )}
                </CardContent>
              </Card>
          </div>

            {/* Applications Section */}
            <div>
            <Card>
              <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                  {applications?.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No applications yet</p>
                  ) : (
                <div className="space-y-4">
                      {applications?.slice(0, 5).map((application) => (
                        <div key={application._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{application.influencerName}</h3>
                              <p className="text-sm text-gray-500">{application.campaignTitle}</p>
                            </div>
                            <Badge variant={
                              application.status === 'approved' ? 'default' :
                              application.status === 'rejected' ? 'destructive' :
                              'secondary'
                            }>
                              {application.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
        </div>
      )}
              </CardContent>
            </Card>
            </div>
          </div>
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
    </SignedIn>
  );
};

export default BrandDashboard;