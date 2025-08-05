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
const CreateContentPage = () => {

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
                        {/* <h3>{campaign.title}</h3> */}
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

export default CreateContentPage;






























// import React, { useEffect, useState } from "react";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "../../convex/_generated/api";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/components/ui/use-toast";
// import { Badge } from "@/components/ui/badge";
// import { MessageSquare } from "lucide-react";
// import { Doc } from "convex/_generated/dataModel";
// import { Id } from "../../convex/_generated/dataModel";
// import HeaderButton from "@/components/HeaderButton";
// import { useNavigate } from "react-router-dom";
// import CampaignDetailsModal from "@/components/CampaignDetailsModal";
// import { motion } from "framer-motion";
// import { 
//   Calendar, 
//   DollarSign, 
//   Clock, 
//   CheckCircle, 
//   AlertCircle, 
//   XCircle,
//   Eye,
//   Building2,
//   ArrowLeft,
//   Link
// } from "lucide-react";

// interface ApplicationWithCampaign {
//   applicationId: string;
//   campaign: Doc<"campaigns"> | null; 
//   contentTypes: string[];
// }

// const CreateContentPage = () => {
//   const { toast } = useToast();
//   const applications = useQuery(api.applications.listInfluencerApplications);
//   const approvedApplicationsCount = applications? applications.filter(app => app.status === 'approved').length: 0;
//   const campaigns = useQuery(api.campaign.allCampaigns);
//   const [selectedApp, setSelectedApp] = useState<ApplicationWithCampaign | null>(null);
//   const [hashtags, setHashtags] = useState("");
//   const [caption, setCaption] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCampaign, setSelectedCampaign] = useState<Doc<"campaigns"> | null>(null);
//   const navigate = useNavigate();

//   const submitContent = useMutation(api.content.submitContent);


//   const uploadToTikTok = async (file: File, caption: string, hashtags: string) => {

//     return new Promise((resolve) => setTimeout(resolve, 3000));
//   };

//   const applicationWithCampaign:ApplicationWithCampaign[] = React.useMemo(() => {
//     if(!applications || !campaigns) return [];
//     return applications
//       .filter(app => app.status === 'approved')
//       .map(app => {
//         const campaign = campaigns.find(c => c._id === app.campaignId);
//         return {
//           applicationId: app._id,
//           campaign: campaign || null,
//           contentTypes: campaign?.contentTypes || [],
//         };      
//       })
//       .filter(app => app.campaign !== null);
//   }, [applications, campaigns]);

//     const handleViewCampaign = (campaign: Doc<"campaigns">) => {
//         setSelectedCampaign(campaign);
//         setShowModal(true);
//     }
  
//     const handleNavigateToCreateContent = (campaignId: Id<"campaigns">) => {
//       setShowModal(false);
//       setSelectedCampaign(null);
//       navigate(`/createcontent?campaignId=${campaignId}`);
//     }

//     const getStatusIcon = (status: string) => {
//         switch (status) {
//           case 'approved':
//             return <CheckCircle className="w-4 h-4 text-green-500" />;
//           case 'pending':
//             return <Clock className="w-4 h-4 text-yellow-500" />;
//           case 'rejected':
//             return <XCircle className="w-4 h-4 text-red-500" />;
//           default:
//             return <AlertCircle className="w-4 h-4 text-gray-500" />;
//         }
//     };
    
//     const getStatusColor = (status: string) => {
//         switch (status) {
//           case 'approved':
//             return 'bg-green-100 text-green-800';
//           case 'pending':
//             return 'bg-yellow-100 text-yellow-800';
//           case 'rejected':
//             return 'bg-red-100 text-red-800';
//           default:
//             return 'bg-gray-100 text-gray-800';
//         }
//     };
    
//     const getStatusText = (status: string) => {
//         switch (status) {
//           case 'approved':
//             return 'Approved';
//           case 'pending':
//             return 'Under Review';
//           case 'rejected':
//             return 'Not Selected';
//           default:
//             return status;
//         }
//     };
   
//     if (!applications || !campaigns) {
//       return (
//          <div className="flex justify-center items-center min-h-[200px]">
//            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7CA5]"></div>
//          </div>
//        );
//     }
  
//     const appliedCampaigns = applications
//        .map(app => ({
//          ...app,
//          campaign: campaigns.find(c => c._id === app.campaignId),
//     }))
//        .filter(item => !!item.campaign); 

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedApp) {
//       toast({ title: "Error", description: "Select a campaign first", variant: "destructive" });
//       return;
//     }
//     if (!file) {
//       toast({ title: "Error", description: "Please upload your content file", variant: "destructive" });
//       return;
//     }

//     setUploading(true);
//     try {
//       if (selectedApp.contentTypes.includes("TikTok Video")) {
//         await uploadToTikTok(file, caption, hashtags);
//         toast({ title: "Success", description: "Content uploaded to TikTok!", variant: "success" });
//       } else {
//         toast({ title: "Info", description: "Content upload for this type is not implemented yet.", variant: "default" });
//       }

//       await submitContent({
//         applicationId: selectedApp.applicationId as Id<"applications">,
//         caption,
//         hashtags,
//         contentUrl: "url-from-upload", 
//       });

//       // Reset form
//       setCaption("");
//       setHashtags("");
//       setFile(null);
//       setSelectedApp(null);
//     } catch (error) {
//       toast({ title: "Upload Failed", description: String(error), variant: "destructive" });
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
    
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//             <HeaderButton/>
//       <h1 className="text-3xl font-bold">Create Content</h1>

//       <section>
//         <h2 className="text-xl font-semibold mb-4">Select a Campaign</h2>
//         {!applications ? (
//           <p>Loading your approved applications...</p>
//         ) : applications.length === 0 ? (
//           <p>You have no approved applications to create content for.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {applications?.length > 0 ? (
//                     applications.map((application) => (
//                       <div 
//                         key={application._id}
//                         className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
//                       >
//                         <div className="flex-1">
//                           <div className="flex items-center gap-4">
//                             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
//                               {application.campaignTitle?.charAt(0)}
//                             </div>
//                             <div>
//                               <h3 className="font-semibold">{application.campaignTitle}</h3>
//                               <p className="text-sm text-gray-600">{application.influencerName}</p>
//                               <div className="flex items-center gap-2 mt-1">
//                                 <Badge 
//                                   variant={
//                                     application.status === 'pending' ? 'secondary' :
//                                     application.status === 'approved' ? 'default' :
//                                     'destructive'
//                                   }
//                                 >
//                                   {application.status}
//                                 </Badge>
//                                 <span className="text-sm text-gray-500">
//                                   {new Date(application._creationTime).toLocaleDateString()}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-8">
//                       <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                       <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
//                       <p className="text-gray-600">Your campaign applications will appear here</p>
//                     </div>
//               )}

//               {applicationWithCampaign.map((app: ApplicationWithCampaign) => (
//                 <Card
//                       key={app.applicationId}
//                       className={`cursor-pointer ${
//                       selectedApp?.applicationId === app.applicationId ? "border-primary" : ""
//                       }`}
//                       onClick={() => setSelectedApp(app)}
//                   >
//                       <CardHeader>
//                       <CardTitle>{app.campaign.title}</CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                       <p>{app.campaign.description}</p>
//                       <p>
//                           <strong>Content Types:</strong> {app.contentTypes.join(", ")}
//                       </p>
//                       </CardContent>
//                       <div className="flex items-center justify-between p-4 border-t">
//                           <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleViewCampaign(app.campaign)}
//                           >
//                               view campaign
//                           </Button>
//                           <Badge className={getStatusColor(app.campaign.status)}>
//                               {getStatusText(app.campaign.status)}
//                           </Badge>
//                       </div>
//                   </Card>
//               ))}
//           </div>
//         )}
//       </section>

//       {/*  Content creation form */}
//       {selectedApp && (
//         <section>
//           <h2 className="text-xl font-semibold mb-4">Create Content for: {selectedApp.campaign.title}</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Textarea
//               placeholder="Caption"
//               value={caption}
//               onChange={(e) => setCaption(e.target.value)}
//               rows={3}
//               required
//             />
//             <Input
//               placeholder="Hashtags (comma separated)"
//               value={hashtags}
//               onChange={(e) => setHashtags(e.target.value)}
//             />
//             {/* Show file input based on content type */}
//             {selectedApp.contentTypes.includes("TikTok Video") && (
//               <div>
//                 <label className="block mb-1 font-medium">Upload TikTok Video</label>
//                 <input
//                   type="file"
//                   accept="video/*"
//                   onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
//                   required
//                 />
//               </div>
//             )}
//             {/* Add other content type inputs as needed */}

//             <Button type="submit" disabled={uploading}>
//               {uploading ? "Uploading..." : "Submit Content"}
//             </Button>
//           </form>
//         </section>
//       )}
//     </div>
//   );
// };

// export default CreateContentPage;

