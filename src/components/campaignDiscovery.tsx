// pages/influencer/CampaignDiscovery.jsx
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import CampaignCard from "@/components/influencer/CampaignCard";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const CampaignDiscovery = () => {
  const campaigns = useQuery(api.campaign.allCampaigns);
  const applyToCampaign = useMutation(api.applications.createApplication);
  const { toast } = useToast();

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleApply = (campaign) => setSelectedCampaign(campaign);

  const handleSubmitApplication = async () => {
    setSubmitting(true);
    try {
      await applyToCampaign({
        campaignId: selectedCampaign._id,
        message: applicationMessage,
        proposedContent: "",
      });
      toast({ title: "Application sent!", variant: "success" });
      setSelectedCampaign(null);
      setApplicationMessage("");
    } catch (err) {
      toast({ title: "Failed to apply", description: err.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  if (!campaigns) return <div className="flex justify-center py-10">Loading campaigns...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Discover Campaigns</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign._id} campaign={campaign} onApply={handleApply} />
        ))}
      </div>

      {/* Application Dialog */}
      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply to {selectedCampaign?.title}</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Write a brief message or pitch..."
            value={applicationMessage}
            onChange={(e) => setApplicationMessage(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedCampaign(null)}>Cancel</Button>
            <Button onClick={handleSubmitApplication} disabled={submitting || !applicationMessage.trim()}>
              {submitting ? "Submitting..." : "Send Application"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignDiscovery;
