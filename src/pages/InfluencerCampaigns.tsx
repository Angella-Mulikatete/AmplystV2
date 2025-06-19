
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

// Mock data structure - replace with your actual data fetching logic
interface Campaign {
  _id: string;
  title: string;
  description: string;
  budget: string;
  endDate: string;
  creatorUserId: string;
  requirements?: string[];
  deliverables?: string[];
}

interface Application {
  _id: string;
  campaignId: string;
  status: 'pending' | 'approved' | 'rejected';
  _creationTime: number;
  campaign?: Campaign;
}

const MyCampaigns = () => {
   // Fetch all applications for the logged-in influencer
   const applications = useQuery(api.applications.listInfluencerApplications);
   // Fetch all campaigns (to get campaign details)
   const campaigns = useQuery(api.campaign.allCampaigns);
   const navigate = useNavigate();
 
   if (!applications || !campaigns) {
     return (
       <div className="flex justify-center items-center min-h-[200px]">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7CA5]"></div>
       </div>
     );
   }
 
   // Map applications to their campaign details
   const appliedCampaigns = applications
     .map(app => ({
       ...app,
       campaign: campaigns.find(c => c._id === app.campaignId),
     }))
     .filter(item => !!item.campaign); // Only show if campaign still exists

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

                  {/* Deliverables */}
                  {/* {application.campaign?.deliverables && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Deliverables:</p>
                      <div className="flex flex-wrap gap-1">
                        {application.campaign.deliverables.map((deliverable, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {deliverable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )} */}

                  {/* Requirements */}
                  {/* {application.campaign?.requirements && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Requirements:</p>
                      <div className="flex flex-wrap gap-1">
                        {application.campaign.requirements.map((req, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )} */}

                  {/* Application Date & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Applied: {new Date(application._creationTime).toLocaleDateString()}
                    </p>
                    <Button variant="outline" size="sm" className="h-8">
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
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

export default MyCampaigns;























// // pages/influencer/MyCampaigns.jsx
// import { useQuery } from "convex/react";
// import { api } from "../../convex/_generated/api";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Calendar, DollarSign } from "lucide-react";

// const InfluencerCampaigns
//  = () => {
//   // Fetch all applications for the logged-in influencer
//   const applications = useQuery(api.applications.listInfluencerApplications);
//   // Fetch all campaigns (to get campaign details)
//   const campaigns = useQuery(api.campaign.allCampaigns);

//   if (!applications || !campaigns) {
//     return (
//       <div className="flex justify-center items-center min-h-[200px]">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7CA5]"></div>
//       </div>
//     );
//   }

//   // Map applications to their campaign details
//   const appliedCampaigns = applications
//     .map(app => ({
//       ...app,
//       campaign: campaigns.find(c => c._id === app.campaignId),
//     }))
//     .filter(item => !!item.campaign); // Only show if campaign still exists

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold mb-4">My Campaigns</h2>
//       {appliedCampaigns.length === 0 ? (
//         <Card>
//           <CardContent className="text-center py-12">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
//             <p className="text-gray-600">You haven't applied to any campaigns yet.</p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {appliedCampaigns.map(({ campaign, status, _id, _creationTime }) => (
//             <Card key={_id}>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   {campaign.title}
//                   <Badge
//                     variant={
//                       status === "approved"
//                         ? "success"
//                         : status === "pending"
//                         ? "secondary"
//                         : "destructive"
//                     }
//                   >
//                     {status}
//                   </Badge>
//                 </CardTitle>
//                 <div className="text-sm text-gray-500">{campaign.creatorUserId}</div>
//               </CardHeader>
//               <CardContent>
//                 <div className="mb-2 text-gray-700 line-clamp-3">{campaign.description}</div>
//                 <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-2">
//                   <span className="flex items-center gap-1">
//                     <DollarSign className="w-4 h-4" /> {campaign.budget}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <Calendar className="w-4 h-4" />{" "}
//                     {new Date(campaign.endDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className="text-xs text-gray-400">
//                   Applied: {new Date(_creationTime).toLocaleDateString()}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default InfluencerCampaigns
// ;
