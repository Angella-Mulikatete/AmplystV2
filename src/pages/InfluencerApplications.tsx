
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Users,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const InfluencerApplication = () => {
  const navigate = useNavigate();
  
  // Fetch all campaigns created by this brand
  const myCampaigns = useQuery(api.campaign.listMyCampaigns, { includeExpired: true });
  // Fetch all applications for these campaigns
  const allApplications = useQuery(api.applications.listApplications);

  const updateStatus = useMutation(api.applications.updateApplication);
  const { toast } = useToast();

  if (!myCampaigns || !allApplications) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Filter applications to only those for this brand's campaigns
  const myCampaignIds = myCampaigns.map(c => c._id);
  const brandApplications = allApplications.filter(app =>
    myCampaignIds.includes(app.campaignId)
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'declined':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (appId: string, status: string) => {
    try {
      await updateStatus({ applicationId: appId, status });
      toast({
        title: `Application ${status === "approved" ? "accepted" : "declined"}`,
        description: `The influencer has been ${status === "approved" ? "accepted" : "declined"} for this campaign.`,
      });
    } catch (err) {
      toast({ 
        title: "Error", 
        description: err instanceof Error ? err.message : "Something went wrong", 
        variant: "destructive" 
      });
    }
  };

  const pendingCount = brandApplications.filter(app => app.status === 'pending').length;
  const approvedCount = brandApplications.filter(app => app.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/brand/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
          <div className="mb-5">
            <h2 className="text-3xl font-bold text-primary-800">Applications Review</h2>
            <p className="text-gray-600 mt-1">Manage influencer applications for your campaigns</p>
          </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            {pendingCount} Pending
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {approvedCount} Approved
          </Badge>
        </div>
      </div>

      {/* Applications Grid */}
      {brandApplications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't received any applications for your campaigns yet. Create more campaigns to attract influencers.
              </p>
              <Button 
                className="bg-primary hover:bg-primary-600"
                onClick={() => navigate('/brand-dashboard')}
              >
                View Campaigns
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {brandApplications.map((app, index) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold line-clamp-2 flex-1 mr-2">
                      {app.campaignTitle}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(app.status)}
                    </div>
                  </div>
                  <Badge className={getStatusColor(app.status)}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Influencer Info */}
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{app.influencerName}</p>
                      <p className="text-sm text-gray-600">Influencer</p>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MessageSquare className="w-4 h-4" />
                      Application Message
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-3 bg-gray-50 p-3 rounded-lg">
                      {app.message}
                    </p>
                  </div>

                  {/* Application Date */}
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Applied: {new Date(app._creationTime || Date.now()).toLocaleDateString()}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-gray-100">
                    {app.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleStatusChange(app._id, "approved")}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleStatusChange(app._id, "declined")}
                          variant="outline"
                          className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                          size="sm"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <span className="text-gray-500 text-sm flex items-center justify-center gap-1">
                          {getStatusIcon(app.status)}
                          Decision made
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InfluencerApplication;