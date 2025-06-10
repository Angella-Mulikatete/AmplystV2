
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link } from "react-router-dom";
import BrandNavbar from "@/components/brand/BrandNavbar";

// Optional: Add your own loading and error components
const Loading = () => <div>Loading...</div>;

export default function BrandDashboard() {
  // Fetch brand profile and campaigns
  const brandProfile = useQuery(api.brands.getMyBrandProfile);
  const campaigns = useQuery(api.campaign.listMyCampaigns);
  const influencers = useQuery(api.influencers.listInfluencers);

  // State for AI matches per campaign
  const [matchedInfluencersMap, setMatchedInfluencersMap] = useState({});
  const [loadingMatch, setLoadingMatch] = useState(null);

  // Helper: Call your AI server for influencer matching
  // async function fetchMatchedInfluencers(campaign, influencers) {
  //   const response = await fetch("http://localhost:3001/api/ai-match", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ campaign, influencers }),
  //   });
  //   const data = await response.json();
  //   return data.influencerIds || [];
  // }

  // Handle AI matching for a campaign
  // const handleMatchClick = async (campaign) => {
  //   setLoadingMatch(campaign._id);
  //   const ids = await fetchMatchedInfluencers(campaign, influencers);
  //   console.log("Matched Influencers IDs:", ids);
  //   setMatchedInfluencersMap((prev) => ({ ...prev, [campaign._id]: ids }));
  //   setLoadingMatch(null);
  // };

  if (!brandProfile || !campaigns || !influencers) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <BrandNavbar/>
      {/* Brand Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {brandProfile.companyName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Industry:</strong> {brandProfile.industry}</p>
              <p><strong>Contact:</strong> {brandProfile.contactPerson} ({brandProfile.businessEmail})</p>
              <p><strong>Location:</strong> {brandProfile.location}</p>
              <p><strong>Description:</strong> {brandProfile.description}</p>
            </div>
            <div>
              <p><strong>Campaign Goal:</strong> {brandProfile.campaignGoal}</p>
              <p><strong>Target Audience:</strong> {brandProfile.targetAudience}</p>
              <p><strong>Preferred Influencer Type:</strong> {brandProfile.influencerType}</p>
              <p><strong>Budget Range:</strong> {brandProfile.budgetRange}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Management Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Campaigns</h2>
        <Link to="/brand/campaigns/create">
          <Button>Create New Campaign</Button>
        </Link>
      </div>
      {campaigns.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No campaigns yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {campaigns.map((campaign) => {
            const matchedIds = matchedInfluencersMap[campaign._id] || [];
            const matchedInfluencers = influencers.filter((i) =>
              matchedIds.includes(i._id)
            );
            return (
              <Card key={campaign._id}>
                <CardHeader>
                  <CardTitle>{campaign.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{campaign.description}</p>
                  <div className="flex gap-2 mb-2">
                    <Badge>{campaign.status}</Badge>
                    <Badge>
                      {campaign.budget ? `$${campaign.budget}` : "No Budget"}
                    </Badge>
                    <Badge>{campaign.duration}</Badge>
                  </div>
                  <div className="flex gap-2 mb-4">
                    {campaign.contentTypes?.map((type) => (
                      <Badge key={type}>{type}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      View Applications
                    </Button>
                    <Link to="/brand/discover">
                      <Button size="sm" variant="outline">
                        Discover Influencers
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="default"
                      // onClick={() => handleMatchClick(campaign)}
                      disabled={loadingMatch === campaign._id}
                    >
                      {loadingMatch === campaign._id
                        ? "Matching..."
                        : "AI Match Influencers"}
                    </Button>
                  </div>
                  {/* AI Matched Influencers */}
                  {/* {matchedInfluencers.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">
                        AI Recommended Influencers:
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {matchedInfluencers.map((influencer) => (
                          <div
                            key={influencer._id}
                            className="p-2 border rounded flex flex-col"
                          >
                            <span className="font-medium">
                              {influencer.name}
                            </span>
                            <span className="text-xs text-gray-600">
                              {influencer.niche} • {influencer.location}
                            </span>
                            <span className="text-xs text-gray-500">
                              Followers: {influencer.followerCount}
                            </span>
                            <Button size="sm" variant="outline" className="mt-2">
                              View Profile
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )} */}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Influencer Discovery Section */}
      <div>
        <div className="flex justify-between items-center mt-12 mb-4">
          <h2 className="text-2xl font-bold">Discover Influencers</h2>
          <Link to="/brand/discover">
            <Button variant="outline">Advanced Search</Button>
          </Link>
        </div> 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {influencers.slice(0, 6).map((influencer) => (
            <Card key={influencer._id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={influencer.profilePictureUrl || "/placeholder.jpg"}
                    alt={influencer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{influencer.name}</h3>
                    <p className="text-sm text-gray-500">
                      {influencer.niche} • {influencer.location}
                    </p>
                    <span className="text-xs text-gray-600">
                      Followers: {influencer.followerCount}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="mt-4">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Analytics Placeholder */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Analytics & Reporting</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Track your campaign performance, influencer engagement, and ROI here.
            (Coming soon)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
