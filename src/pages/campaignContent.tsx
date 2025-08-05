import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Doc, Id } from "convex/_generated/dataModel";



interface CampaignDetailsModalProps {
  open: boolean;
  onClose: () => void;
  campaign: Doc<"campaigns"> | null;
  navigateToCreateContent: (id: Id<"campaigns">) => void;
}

const CampaignDetailsModal = ({ open, onClose, campaign, navigateToCreateContent }: CampaignDetailsModalProps) => {
  if (!campaign) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{campaign.title}</DialogTitle>
        </DialogHeader>
        <div>
          <p className="mb-2">{campaign.description}</p>
          <div className="mb-2">
            <span className="font-semibold">Budget:</span> {campaign.budget ?? "N/A"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">End Date:</span> {campaign.endDate ?? "N/A"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Content Type:</span> {campaign.contentTypes?.join(", ") ?? "N/A"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Requirements:</span> {campaign.requirements ?? "No specific requirements listed."}
          </div>

          {campaign.status === "active" &&
            campaign.contentTypes?.includes("TikTok Video") && (
              <Button
                className="mt-4 w-full bg-[#3A7CA5] hover:bg-[#3A7CA5]/90"
                onClick={() => {
                  onClose();
                  navigateToCreateContent(campaign._id);
                }}
              >
                Create Content
              </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignDetailsModal;
