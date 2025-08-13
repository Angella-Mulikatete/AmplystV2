// pages/influencer/CampaignDiscovery.jsx
// import { useQuery, useMutation } from "convex/react";
// import { api } from "../../convex/_generated/api";
// import CampaignCard from "@/components/influencer/CampaignCard";
// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/components/ui/use-toast";

// const CampaignDiscovery = () => {
//   const campaigns = useQuery(api.campaign.allCampaigns);
//   const applyToCampaign = useMutation(api.applications.createApplication);
//   const { toast } = useToast();

//   const [selectedCampaign, setSelectedCampaign] = useState(null);
//   const [applicationMessage, setApplicationMessage] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const handleApply = (campaign) => setSelectedCampaign(campaign);

//   const handleSubmitApplication = async () => {
//     setSubmitting(true);
//     try {
//       await applyToCampaign({
//         campaignId: selectedCampaign._id,
//         message: applicationMessage,
//         proposedContent: "",
//       });
//       toast({ title: "Application sent!", variant: "success" });
//       setSelectedCampaign(null);
//       setApplicationMessage("");
//     } catch (err) {
//       toast({ title: "Failed to apply", description: err.message, variant: "destructive" });
//     }
//     setSubmitting(false);
//   };

//   if (!campaigns) return <div className="flex justify-center py-10">Loading campaigns...</div>;

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6">Discover Campaigns</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {campaigns.map((campaign) => (
//           <CampaignCard key={campaign._id} campaign={campaign} onApply={handleApply} />
//         ))}
//       </div>

//       {/* Application Dialog */}
//       <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Apply to {selectedCampaign?.title}</DialogTitle>
//           </DialogHeader>
//           <Textarea
//             placeholder="Write a brief message or pitch..."
//             value={applicationMessage}
//             onChange={(e) => setApplicationMessage(e.target.value)}
//             rows={4}
//           />
//           <div className="flex justify-end gap-2">
//             <Button variant="outline" onClick={() => setSelectedCampaign(null)}>Cancel</Button>
//             <Button onClick={handleSubmitApplication} disabled={submitting || !applicationMessage.trim()}>
//               {submitting ? "Submitting..." : "Send Application"}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default CampaignDiscovery;



import { useState } from "react";
 import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id, Doc } from "convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Calendar, TrendingUp } from "lucide-react";
// import ApplicationModal from "../ApplicationModal";
import { useNavigate } from "react-router-dom";

interface CampaignWithCreator extends Doc<"campaigns"> {
  creatorName?: string;
  creatorHandle?: string;
  creatorVerified?: boolean;
  creatorProfilePicture?: string;
}

interface CampaignDiscoveryProps {
  campaigns: CampaignWithCreator[];
}

const CampaignDiscovery = ({ campaigns = [] }: CampaignDiscoveryProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<Id<"campaigns"> | null>(null);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesNiche = selectedNiche === "all" || 
                         (campaign.targetAudience && campaign.targetAudience.toLowerCase().includes(selectedNiche.toLowerCase())) ||
                         (campaign.contentTypes && campaign.contentTypes.some(type => type.toLowerCase().includes(selectedNiche.toLowerCase())));

    const matchesPlatform = selectedPlatform === "all" || (campaign.platform && campaign.platform.toLowerCase() === selectedPlatform.toLowerCase());
    
    return matchesSearch && matchesNiche && matchesPlatform;
  }).sort((a, b) => {
    if (sortBy === "newest") {
      return (b._creationTime || 0) - (a._creationTime || 0);
    } else if (sortBy === "payment-high") {
      return (b.budget || 0) - (a.budget || 0);
    } else if (sortBy === "payment-low") {
      return (a.budget || 0) - (b.budget || 0);
    } else if (sortBy === "deadline") {
      if (a.endDate && b.endDate) {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      }
      return 0;
    }
    return 0;
  });

  console.log("filtered campaigns in campaign discovery", filteredCampaigns);

  const handleApplyClick = (campaignId: Id<"campaigns">) => {
    navigate(`/campaigns/${campaignId}/apply`);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#3A7CA5]" />
            Discover Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-gray-300"
            />
            
            <Select 
              value={selectedNiche} 
              onValueChange={setSelectedNiche}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Niche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Niches</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Beauty & Skincare">Beauty & Skincare</SelectItem>
                <SelectItem value="Fitness & Health">Fitness & Health</SelectItem>
                <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                <SelectItem value="Gaming">Gaming</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Parenting">Parenting</SelectItem>
                <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                <SelectItem value="Arts & Crafts">Arts & Crafts</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Photography">Photography</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="YouTube">YouTube</SelectItem>
                <SelectItem value="Twitter">Twitter</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="payment-high">Highest Payment</SelectItem>
                <SelectItem value="payment-low">Lowest Payment</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign._id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-[#3A7CA5]">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">{campaign.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">{campaign.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#88B04B]" />
                  <span className="font-medium text-[#88B04B]">{campaign.budget ? `$${campaign.budget}` : "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#E19629]" />
                  <span>{campaign.endDate || "N/A"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {campaign.targetAudience && (
                    <Badge variant="secondary" className="text-xs bg-[#3A7CA5]/10 text-[#3A7CA5]">
                      {campaign.targetAudience}
                    </Badge>
                  )}
                  {campaign.platform && (
                    <Badge variant="outline" className="text-xs">
                      {campaign.platform}
                    </Badge>
                  )}
                  {campaign.contentTypes && campaign.contentTypes.map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
                
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Requirements:</span> {campaign.requirements || "N/A"}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1 bg-[#3A7CA5] hover:bg-[#3A7CA5]/90 text-white"
                  size="sm"
                  onClick={() => handleApplyClick(campaign._id)}
                >
                  Apply Now
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-[#3A7CA5] text-[#3A7CA5] hover:bg-[#3A7CA5]/5"
                >
                  Save
                </Button>
              </div>

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
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more campaigns.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignDiscovery;