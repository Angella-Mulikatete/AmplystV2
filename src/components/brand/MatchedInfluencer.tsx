import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface MatchedInfluencersListProps {
  niche: string;
}

export default function MatchedInfluencersList({ niche }: MatchedInfluencersListProps) {
  const influencers = useQuery(api.influencers.listInfluencers);
  
  if (!influencers) {
    return <div className="text-gray-500">Loading influencers...</div>;
  }

  const filteredInfluencers = influencers.filter(influencer => influencer.niche === niche);

  if (filteredInfluencers.length === 0) {
    return <div className="text-gray-500">No matched influencers in this niche yet.</div>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 font-semibold text-primary-800">
        <Users className="w-5 h-5 text-secondary-600" />
        Influencers in your niche
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredInfluencers.map((influencer) => (
          <Card key={influencer._id} className="flex flex-row items-center p-2 gap-3">
            <img
              src={influencer.profilePictureUrl || "/placeholder.svg"}
              alt={influencer.name}
              className="w-12 h-12 rounded-full border border-gray-200"
            />
            <div>
              <div className="font-semibold text-primary-700">{influencer.name}</div>
              <div className="text-xs text-gray-500">{influencer.location}</div>
              <div className="text-xs text-gray-500">Followers: {influencer.followerCount?.toLocaleString() || 0}</div>
              <div className="text-xs text-primary-600">{influencer.bio}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}