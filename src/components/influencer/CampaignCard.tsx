// components/influencer/CampaignCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign } from "lucide-react";

const CampaignCard = ({ campaign, onApply }) => (
  <Card className="hover:shadow-lg transition">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {campaign.title}
        {campaign.status === "active" && <Badge variant="success">Active</Badge>}
        {campaign.status === "closed" && <Badge variant="destructive">Closed</Badge>}
      </CardTitle>
      <div className="text-sm text-gray-500">{campaign.brandName}</div>
    </CardHeader>
    <CardContent>
      <div className="mb-2 text-gray-700 line-clamp-3">{campaign.description}</div>
      <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-2">
        <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {campaign.budget}</span>
        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {campaign.requiredInfluencers} influencers</span>
        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(campaign.deadline).toLocaleDateString()}</span>
      </div>
      {onApply && campaign.status === "active" && (
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => onApply(campaign)}
        >
          Apply
        </button>
      )}
    </CardContent>
  </Card>
);

export default CampaignCard;
