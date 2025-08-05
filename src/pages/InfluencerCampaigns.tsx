import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Eye,
  Building2,
  ArrowLeft,
  Link
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Doc, Id } from "convex/_generated/dataModel";
import CampaignDetailsModal from "@/components/CampaignDetailsModal";

interface ApplicationWithCampaign {
  applicationId: string;
  campaign: Doc<"campaigns"> | null; 
  contentTypes: string[];
}
const MyCampaigns = () => {

  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Doc<"campaigns"> | null>(null);

  const applications = useQuery(api.applications.listInfluencerApplications);

  const campaigns = useQuery(api.campaign.allCampaigns);
   const navigate = useNavigate();

  const applicationWithCampaign: ApplicationWithCampaign[] = useMemo(()=> {
    if(!applications  || !campaigns ) return [];
    return applications.filter(app => app.status === 'approved').map(app => {
      const campaign = campaigns.find(c => c._id === app.campaignId);
      return {
        applicationId: app._id,
        campaign,
        contentTypes: campaign.contentTypes || [],
      };
    })
    .filter(app => app.campaign !== null);
  }, [applications, campaigns]);

  const handleViewCampaign = (campaign: Doc<"campaigns">) => {
      setSelectedCampaign(campaign);
      setShowModal(true);
  }

  const handleNavigateToCreateContent = (campaignId: Id<"campaigns">) => {
    setShowModal(false);
    setSelectedCampaign(null);
    navigate(`/createcontent?campaignId=${campaignId}`);
  }
 
   if (!applications || !campaigns) {
     return (
       <div className="flex justify-center items-center min-h-[200px]">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7CA5]"></div>
       </div>
     );
   }

   const appliedCampaigns = applications
     .map(app => ({
       ...app,
       campaign: campaigns.find(c => c._id === app.campaignId),
     }))
     .filter(item => !!item.campaign); 

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Not Selected';
      default:
        return status;
    }
  };


  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/influencer/dashboard')}
                className="flex items-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Button>
        </div>
        <div  className="space-y-6 p-6">
            <h2 className="text-3xl font-bold text-primary-800">My Campaigns</h2>
            <p className="text-gray-600 mt-1">Track your campaign applications and collaborations</p>
        </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {appliedCampaigns.filter(app => app.status === 'approved').length} Active
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            {appliedCampaigns.filter(app => app.status === 'pending').length} Pending
          </Badge>
        </div>
      </div>

      {/* Campaigns Grid */}
      {appliedCampaigns.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't applied to any campaigns yet. Browse opportunities to find your perfect collaboration.
              </p>
              <Button className="bg-primary hover:bg-primary-600">
                Browse Opportunities
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {appliedCampaigns.map((application, index) => (
            <motion.div
              key={application._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold line-clamp-2 flex-1 mr-2">
                      {application.campaign?.title}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(application.status)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {application.campaign?.creatorUserId}
                    </p>
                    <Badge className={getStatusColor(application.status)}>
                      {getStatusText(application.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {application.campaign?.description}
                  </p>

                  {/* Campaign Details */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <DollarSign className="w-4 h-4" />
                      {application.campaign?.budget}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Due: {application.campaign?.endDate ? new Date(application.campaign.endDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Applied: {new Date(application._creationTime).toLocaleDateString()}
                    </p>
                    {/* <Button variant="outline" size="sm" className="h-8">
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button> */}
                    {applicationWithCampaign.map(app => (
                      <div key={app.applicationId}>
                        <Button variant="outline" size="sm" className="h-8" onClick={() => handleViewCampaign(app.campaign)}>
                          <Eye className="w-3 h-3 mr-1" />
                          View Campaign
                        </Button>
                      </div>
                    ))}

                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        <CampaignDetailsModal
          open={showModal}
          onClose={() => setShowModal(false)}
          campaign={selectedCampaign}
          navigateToCreateContent={handleNavigateToCreateContent}
        />
        </div>
      )}
    </div>
  );
};

export default MyCampaigns;



















