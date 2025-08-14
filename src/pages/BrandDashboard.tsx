// import DashboardLayout from "@/components/layout/DashboardLayout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { TrendingUp, Users, DollarSign, Eye, Calendar, Star, Zap, Target, MessageSquare, Search, CheckCircle, XCircle } from "lucide-react";
// import MatchedInfluencersList from "../components/brand/MatchedInfluencer";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "../../convex/_generated/api";
// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/components/ui/use-toast";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Label } from "@/components/ui/label";
// import { useNavigate } from "react-router-dom";
// import { SignedIn } from "@clerk/clerk-react";

// interface Application {
//   _id: string;
//   status: 'pending' | 'approved' | 'rejected';
//   influencerName: string;
//   influencerEmail: string;
//   campaignTitle: string;
//   _creationTime: number;
//   [key: string]: any;
// }

// const BrandDashboard = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [selectedCampaign, setSelectedCampaign] = useState(null);
//   const [showEditCampaign, setShowEditCampaign] = useState(false);
//   const [editingCampaign, setEditingCampaign] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [campaignToDelete, setCampaignToDelete] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [showApplicationModal, setShowApplicationModal] = useState(false);

//   // Real-time data fetching
//   const brandProfile = useQuery(api.brands.getMyBrandProfile);
//   const campaigns = useQuery(api.campaign.listMyCampaigns, { includeExpired: false });
//   const influencers = useQuery(api.influencers.listInfluencers);
//   const userRole = useQuery(api.users.getMyRole);
//   const applications = useQuery(api.applications.listApplications) as Application[] | undefined;

//   // Mutations
//   const updateCampaign = useMutation(api.campaign.updateCampaign);
//   const deleteCampaign = useMutation(api.campaign.deleteCampaign);
//   const updateApplication = useMutation(api.applications.updateApplication);

//   // Analytics data derived from queries
//   const analytics = [
//     {
//       label: "Active Campaigns",
//       value: campaigns?.filter(c => c.status === 'active').length || 0,
//       icon: <Zap className="w-8 h-8 text-primary-500" />,
//       change: campaigns ? `+${campaigns.filter(c => c.status === 'active' && new Date(c._creationTime) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} this month` : "Loading...",
//     },
//     {
//       label: "Total Reach",
//       value: brandProfile?.totalReach ? `${(brandProfile.totalReach / 1000000).toFixed(1)}M` : "0",
//       icon: <Eye className="w-8 h-8 text-secondary-500" />,
//       change: brandProfile?.reachChange ? `${brandProfile.reachChange > 0 ? '+' : ''}${brandProfile.reachChange}% vs last month` : "Loading...",
//     },
//     {
//       label: "Spend",
//       value: brandProfile?.totalSpent ? `$${(brandProfile.totalSpent / 1000).toFixed(1)}K` : "$0",
//       icon: <DollarSign className="w-8 h-8 text-green-500" />,
//       change: "This year",
//     },
//     {
//       label: "Applications",
//       value: applications?.length || 0,
//       icon: <MessageSquare className="w-8 h-8 text-purple-500" />,
//       change: applications ? `${applications.filter(a => a.status === 'pending').length} pending` : "Loading...",
//     }
//   ];

//   const handleEditCampaign = (campaign) => {
//     setEditingCampaign(campaign);
//     setShowEditCampaign(true);
//   };

//   const handleDeleteCampaign = async () => {
//     try {
//       await deleteCampaign({ campaignId: campaignToDelete._id });
//       toast({
//         title: "Campaign Deleted",
//         description: `${campaignToDelete.title} has been removed`,
//         variant: "success"
//       });
//     } catch (error) {
//       toast({ 
//         title: "Deletion Failed", 
//         description: error.message,
//         variant: "destructive" 
//       });
//     }
//     setShowDeleteConfirm(false);
//   };

//   const handleSaveCampaign = async (updatedData) => {
//     try {
//       await updateCampaign({
//         campaignId: editingCampaign._id,
//         ...updatedData
//       });
//       toast({
//         title: "Campaign Updated",
//         description: `${editingCampaign.title} has been updated`,
//         variant: "success"
//       });
//       setShowEditCampaign(false);
//     } catch (error) {
//       toast({
//         title: "Update Failed",
//         description: error.message,
//         variant: "destructive"
//       });
//     }
//   };

//   const handleApplicationAction = async (applicationId, action) => {
//     try {
//       await updateApplication({
//         applicationId,
//         status: action
//       });
//       toast({
//         title: `Application ${action}`,
//         description: `The application has been ${action.toLowerCase()}ed`,
//         variant: "success"
//       });
//       setShowApplicationModal(false);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: `Failed to ${action.toLowerCase()} application`,
//         variant: "destructive"
//       });
//     }
//   };

//   const renderCampaignActions = (campaign) => (
//     <div className="flex gap-2">
//       <Button 
//         variant="outline" 
//         size="sm" 
//         onClick={() => handleEditCampaign(campaign)}
//       >
//         Edit
//       </Button>
//       <Button 
//         variant="destructive" 
//         size="sm"
//         onClick={() => {
//           setCampaignToDelete(campaign);
//           setShowDeleteConfirm(true);
//         }}
//       >
//         Delete
//       </Button>
//     </div>
//   );

//   const renderEditCampaignModal = () => (
//     <Dialog open={showEditCampaign} onOpenChange={setShowEditCampaign}>
//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle>Edit {editingCampaign?.title}</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="space-y-2">
//             <Label htmlFor="title">Campaign Title</Label>
//             <Input
//               id="title"
//               value={editingCampaign?.title || ''}
//               onChange={(e) => setEditingCampaign({
//                 ...editingCampaign,
//                 title: e.target.value
//               })}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="budget">Budget ($)</Label>
//             <Input
//               id="budget"
//               type="number"
//               value={editingCampaign?.budget || 0}
//               onChange={(e) => setEditingCampaign({
//                 ...editingCampaign,
//                 budget: parseInt(e.target.value)
//               })}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               value={editingCampaign?.description || ''}
//               onChange={(e) => setEditingCampaign({
//                 ...editingCampaign,
//                 description: e.target.value
//               })}
//               rows={4}
//             />
//           </div>
//         </div>
//         <div className="flex justify-end gap-4">
//           <Button 
//             variant="outline" 
//             onClick={() => setShowEditCampaign(false)}
//           >
//             Cancel
//           </Button>
//           <Button 
//             onClick={() => handleSaveCampaign({
//               title: editingCampaign.title,
//               budget: editingCampaign.budget,
//               description: editingCampaign.description
//             })}
//           >
//             Save Changes
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );

//   const renderApplicationModal = () => (
//     <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle>Application Details</DialogTitle>
//         </DialogHeader>
//         {selectedApplication && (
//           <div className="space-y-4">
//             <div className="flex items-start gap-4">
//               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
//                 {selectedApplication.influencerName?.charAt(0)}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-lg">{selectedApplication.influencerName}</h3>
//                 <p className="text-sm text-gray-600">{selectedApplication.influencerEmail}</p>
//                 <Badge variant="outline" className="mt-1">
//                   {selectedApplication.influencerNiche}
//                 </Badge>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <h4 className="font-medium">Campaign</h4>
//               <p className="text-sm">{selectedApplication.campaignTitle}</p>
//             </div>
//             <div className="space-y-2">
//               <h4 className="font-medium">Message</h4>
//               <p className="text-sm text-gray-600">{selectedApplication.message}</p>
//             </div>
//             <div className="space-y-2">
//               <h4 className="font-medium">Proposed Content</h4>
//               <p className="text-sm text-gray-600">{selectedApplication.proposedContent}</p>
//             </div>
//             <div className="flex justify-end gap-4 mt-4">
//               <Button 
//                 variant="outline" 
//                 onClick={() => handleApplicationAction(selectedApplication._id, 'rejected')}
//               >
//                 Reject
//               </Button>
//               <Button 
//                 onClick={() => handleApplicationAction(selectedApplication._id, 'approved')}
//               >
//                 Accept
//               </Button>
//             </div>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );

//   if (!brandProfile || !campaigns || !influencers || !userRole) {
//     return (
//       <DashboardLayout userRole={userRole || "brand"}>
//     <div className="flex justify-center p-8">
//       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
//     </div>
//       </DashboardLayout>
//   );
//   }

//   return (
//     <SignedIn>
//     <DashboardLayout 
//       userRole={userRole} 
//       userName={brandProfile.companyName} 
//       // userAvatar={brandProfile.logoUrl}
//     >
//         <div className="space-y-6">
//           {/* Analytics Overview */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {analytics.map((item, index) => (
//               <Card key={index}>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                       <p className="text-sm font-medium text-gray-500">{item.label}</p>
//                       <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
//                       <p className="text-sm text-gray-500 mt-1">{item.change}</p>
//                     </div>
//                     {item.icon}
//                 </div>
//               </CardContent>
//             </Card>
//               ))}
//           </div>

//           {/* Main Content */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Campaigns Section */}
//             <div className="lg:col-span-2">
//           <Card>
//                 <CardHeader className="flex flex-row items-center justify-between">
//                   <CardTitle>Active Campaigns</CardTitle>
//                   <Button onClick={() => navigate('/brand/campaigns/create')}>
//                     Create Campaign
//                   </Button>
//             </CardHeader>
//             <CardContent>
//                   {campaigns?.length === 0 ? (
//                     <div className="text-center py-8">
//                       <p className="text-gray-500">No active campaigns yet</p>
//                       <Button 
//                         variant="outline" 
//                         className="mt-4"
//                         onClick={() => navigate('/brand/campaigns/create')}
//                       >
//                         Create Your First Campaign
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {campaigns?.map((campaign) => (
//                         <div key={campaign._id} className="border rounded-lg p-4">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <h3 className="font-semibold">{campaign.title}</h3>
//                               <p className="text-sm text-gray-500">{campaign.description}</p>
//                             </div>
//                             <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
//                               {campaign.status}
//                               </Badge>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                   )}
//                 </CardContent>
//               </Card>
//           </div>

//             {/* Applications Section */}
//             <div>
//             <Card>
//               <CardHeader>
//                   <CardTitle>Recent Applications</CardTitle>
//               </CardHeader>
//               <CardContent>
//                   {applications?.length === 0 ? (
//                     <p className="text-center text-gray-500 py-4">No applications yet</p>
//                   ) : (
//                 <div className="space-y-4">
//                       {applications?.slice(0, 5).map((application) => (
//                         <div key={application._id} className="border rounded-lg p-4">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <h3 className="font-semibold">{application.influencerName}</h3>
//                               <p className="text-sm text-gray-500">{application.campaignTitle}</p>
//                             </div>
//                             <Badge variant={
//                               application.status === 'approved' ? 'default' :
//                               application.status === 'rejected' ? 'destructive' :
//                               'secondary'
//                             }>
//                               {application.status}
//                             </Badge>
//                           </div>
//                         </div>
//                       ))}
//         </div>
//       )}
//               </CardContent>
//             </Card>
//             </div>
//           </div>
//       </div>

//       {/* Modals */}
//       {renderEditCampaignModal()}
      
//       <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Deletion</DialogTitle>
//           </DialogHeader>
//           <p className="text-sm text-gray-600">
//             Are you sure you want to delete "{campaignToDelete?.title}"? This action cannot be undone.
//           </p>
//           <div className="flex justify-end gap-4 mt-4">
//             <Button 
//               variant="outline" 
//               onClick={() => setShowDeleteConfirm(false)}
//             >
//               Cancel
//             </Button>
//             <Button 
//               variant="destructive" 
//               onClick={handleDeleteCampaign}
//             >
//               Delete Campaign
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//       {renderApplicationModal()}
//     </DashboardLayout>
//     </SignedIn>
//   );
// };

// export default BrandDashboard;










import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, Eye, Calendar, Star, Zap, Target, MessageSquare, Search, CheckCircle, XCircle, Building2, Edit, Globe, Mail, Plus } from "lucide-react";
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
import CampaignDiscovery from "@/components/campaignDiscovery";
import BrandDiscovery from "@/components/influencer/BrandDiscovery";
import { profile } from "console";
import { allCampaigns } from "convex/campaign";

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
  const [showEditProfile, setShowEditProfile] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);

  // Real-time data fetching
  const brandProfile = useQuery(api.brands.getMyBrandProfile);
  const campaigns = useQuery(api.campaign.listMyCampaigns, { includeExpired: false });
  const influencers = useQuery(api.influencers.listInfluencers);
  const userRole = useQuery(api.users.getMyRole);
  const applications = useQuery(api.applications.listApplications) as Application[] | undefined;
  const [filterNiche, setFilterNiche] = useState('all');

  // Mutations
  const updateCampaign = useMutation(api.campaign.updateCampaign);
  const deleteCampaign = useMutation(api.campaign.deleteCampaign);
  const updateApplication = useMutation(api.applications.updateApplication);
  const updateBrandProfile = useMutation(api.brands.updateBrandProfile);

  // fallback empty arrays for safe .filter() or .map()
  const campaignData = campaigns || [];
  const influencerData = influencers|| [];
  const applicationData = applications || [];
  const brand = brandProfile || {};
  const role = userRole || "brand";

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

  // const handleEditProfile = () => {
  //   setEditingProfile({
  //   companyName: brandProfile?.companyName || '',
  //   description: brandProfile?.description || '',
  //   industry: brandProfile?.industry || '',
  //   location: brandProfile?.location || '',
  //   website: brandProfile?.website || '',
  //   businessEmail: brandProfile?.businessEmail || '',
  //   contactPerson: brandProfile?.contactPerson || '',
  //   campaignGoal: brandProfile?.campaignGoal || '',
  //   targetAudience: brandProfile?.targetAudience || '',
  //   budgetRange: brandProfile?.budgetRange || ''
  //   });
  //   setShowEditProfile(true);
  // };

  const handleEditProfile = () => {
    navigate('/brand/profile/edit');
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

  const handleSaveProfile = async () => {
    try {
      await updateBrandProfile({
        companyName: editingProfile.companyName,
        industry: editingProfile.industry,
        contactPerson: editingProfile.contactPerson,
        businessEmail: editingProfile.businessEmail,
        location: editingProfile.location,
        campaignGoal: editingProfile.campaignGoal,
        targetAudience: editingProfile.targetAudience,
        budgetRange: editingProfile.budgetRange,
        description: editingProfile.description,
      });
      
      toast({
        title: "Profile Updated",
        description: "Your brand profile has been successfully updated",
        variant: "success"
      });
      setShowEditProfile(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
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

  const handleApproveApplication = (applicationId) => {
    console.log('Approving application:', applicationId);
  };

  const handleRejectApplication = (applicationId) => {
    console.log('Rejecting application:', applicationId);
  };

  const filteredInfluencers = influencerData.filter(influencer => {
    if (!influencer) return false;
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.niche.toLowerCase().includes(searchTerm.toLowerCase());

   
    const matchesFilter = filterNiche === 'all' || influencer.niche.toLowerCase().includes(filterNiche.toLowerCase());
    return matchesSearch && matchesFilter;
  });


  const renderEditProfileModal = () => (
    <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Brand Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={editingProfile?.companyName || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                companyName: e.target.value
              })}
              placeholder="Enter your company name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person *</Label>
            <Input
              id="contactPerson"
              value={editingProfile?.contactPerson || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                contactPerson: e.target.value
              })}
              placeholder="Enter contact person name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessEmail">Business Email *</Label>
            <Input
              id="businessEmail"
              type="email"
              value={editingProfile?.businessEmail || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                businessEmail: e.target.value
              })}
              placeholder="Enter business email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Input
              id="industry"
              value={editingProfile?.industry || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                industry: e.target.value
              })}
              placeholder="e.g., Technology, Fashion, Food"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={editingProfile?.location || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                location: e.target.value
              })}
              placeholder="Enter your location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaignGoal">Campaign Goal *</Label>
            <select
              id="campaignGoal"
              value={editingProfile?.campaignGoal || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                campaignGoal: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select campaign goal</option>
              <option value="Brand Awareness">Brand Awareness</option>
              <option value="Product Launch">Product Launch</option>
              <option value="Sales Growth">Sales Growth</option>
              <option value="Community Building">Community Building</option>
              <option value="Content Creation">Content Creation</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience *</Label>
            <Input
              id="targetAudience"
              value={editingProfile?.targetAudience || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                targetAudience: e.target.value
              })}
              placeholder="e.g., Young professionals, Tech enthusiasts"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetRange">Budget Range *</Label>
            <select
              id="budgetRange"
              value={editingProfile?.budgetRange || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                budgetRange: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select budget range</option>
              <option value="$1,000 - $5,000">$1,000 - $5,000</option>
              <option value="$5,000 - $15,000">$5,000 - $15,000</option>
              <option value="$15,000 - $50,000">$15,000 - $50,000</option>
              <option value="$50,000+">$50,000+</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              value={editingProfile?.description || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                description: e.target.value
              })}
              rows={4}
              placeholder="Tell us about your company..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={editingProfile?.website || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                website: e.target.value
              })}
              placeholder="https://www.yourcompany.com"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-4 sticky bottom-0 bg-white pt-4 border-t">
          <Button variant="outline" onClick={() => setShowEditProfile(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveProfile} 
            className="bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/90 hover:to-[#88B04B]/90"
            disabled={!editingProfile?.companyName || !editingProfile?.industry || !editingProfile?.contactPerson || !editingProfile?.businessEmail}
          >
            Update Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Brand Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Brand Profile
            </CardTitle>
            <Button 
              className="bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/90 hover:to-[#88B04B]/90" 
              onClick={handleEditProfile}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20  rounded-xl flex items-center justify-center text-gray-500 text-2xl font-bold shadow-lg">
              {brandProfile.companyName.charAt(0)}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{brandProfile.companyName}</h3>
                <p className="text-gray-600 mt-1">{brandProfile.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="font-medium">{brandProfile.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{brandProfile.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{brandProfile.businessEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Total Spend</p>
                <p className="text-2xl font-bold text-green-700">
                  {brandProfile.totalBudget.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-blue-700">
                  {brandProfile.activeCampaigns}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
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
                        onClick={() => navigate('/brand/campaigns/create')}
              className = "bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/90 hover:to-[#88B04B]/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {campaigns?.length === 0 ?
            (
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
                )
          }
        </CardContent>
      </Card>
    </div>
  );

  const renderDiscoverInfluencers = () => (
      <div className="space-y-6">
        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search influencers by name or niche..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterNiche}
                onChange={(e) => setFilterNiche(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Niches</option>
                <option value="technology">Technology</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="business">Business</option>
                <option value="fitness">Fitness</option>
                <option value="beauty">Beauty</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Influencers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInfluencers?.map((influencer) => (
            <Card key={influencer._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-300 to-[#3A7CA5] rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {influencer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{influencer.name}</h3>
                    <p className="text-sm text-gray-600">{influencer.niche}</p>
                    <p className="text-xs text-gray-500">{influencer.location}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Followers</span>
                    <span className="font-semibold">{influencer.followerCount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Engagement</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{influencer.engagementRate}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rate Range</span>
                    <span className="font-semibold text-green-600">{influencer.price}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {influencer.primaryPlatform?.map((platform) => (
                      <Badge key={platform} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                  <Button size="sm" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  );


  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Campaigns</h2>
          <p className="text-gray-600">Manage your influencer marketing campaigns</p>
        </div>
        <Button 
          variant = "outline"
          onClick={() => navigate('/brand/campaigns/create')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign._id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{campaign.title}</h3>
                  <p className="text-gray-600">{campaign.description}</p>
                </div>
                <Badge 
                  variant={campaign.status === 'active' ? 'default' : 'secondary'}
                  className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {campaign.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {/* <DollarSign className="h-5 w-5 text-green-500" /> */}
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
                </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold">
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </p>
                  </div>
              </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500">Applications</p>
                    {/* <p className="font-semibold">{campaign.applications}</p> */}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Approved</p>
                    {/* <p className="font-semibold">{campaign.approved}</p> */}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {campaign.contentTypes.map((type) => (
                  <Badge key={type} variant="outline">
                    {type}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderApplications = () => (
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
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-800 rounded-full flex items-center justify-center text-white font-bold">
                      {application.influencerName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{application.influencerName}</h3>
                      <p className="text-sm text-gray-600">{application.campaignTitle}</p>
                      <p className="text-sm text-gray-500 mt-1">{application.message}</p>
                      
                      {/* <div className="flex items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>{application.followers.toLocaleString()} followers</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{application.engagement}% engagement</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span>${application.proposedRate}</span>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant={
                        application.status === 'pending' ? 'secondary' :
                        application.status === 'approved' ? 'default' :
                        'destructive'
                      }
                      className={
                        application.status === 'approved' ? 'bg-green-100 text-green-800' : ''
                      }
                    >
                      {application.status}
                    </Badge>
                    {/* <span className="text-sm text-gray-500">
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </span> */}
                    
                    {application.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRejectApplication(application._id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleApproveApplication(application._id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600">Campaign applications will appear here when influencers apply</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderApplicationModal = () => (
    <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
          {applications?.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No applications yet</p>
              ) : 
              (
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
                            }
                        >
                          {application.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
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
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="brands">Campaigns</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            {renderOverview()}
          </TabsContent>
          
          <TabsContent value="discover" className="mt-6">
            {/* <CampaignDiscovery campaigns={campaigns || []} /> */}
            {renderDiscoverInfluencers()}
          </TabsContent>
          
          <TabsContent value="brands" className="mt-6">
            {renderCampaigns()}
          </TabsContent>
          
          <TabsContent value="applications" className="mt-6">
            {renderApplications()}
          </TabsContent>
        </Tabs>
      </div>

    </DashboardLayout>

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
    </SignedIn>
  );
};

export default BrandDashboard;