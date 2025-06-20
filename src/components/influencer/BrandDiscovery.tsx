import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Users, DollarSign, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ApplicationModal from "../ApplicationModal";

interface BrandDiscoveryProps {
  brands: Doc<"brands">[];
  campaigns: Doc<"campaigns">[];
}

const BrandDiscovery = ({ brands = [], campaigns = [] }: BrandDiscoveryProps) => {
  const [selectedBrand, setSelectedBrand] = useState<Doc<"brands"> | null>(null);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [brandCampaigns, setBrandCampaigns] = useState<Doc<"campaigns">[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<Id<"campaigns"> | null>(null);

  // Get all campaigns
  const allCampaigns = useQuery(api.campaign.allCampaigns, {});

  useEffect(() => {
    if (selectedBrand && allCampaigns) {
      const filteredCampaigns = allCampaigns.filter(
        campaign => campaign.creatorUserId === selectedBrand.userId
      );
      setBrandCampaigns(filteredCampaigns);
    }
  }, [selectedBrand, allCampaigns]);

  const getCampaignStats = (brandId: Id<"brands">) => {
    const brand = brands.find(b => b._id === brandId);
    const brandCampaigns = allCampaigns.filter(campaign => campaign.creatorUserId === brand?.userId);
    return {
      total: brandCampaigns.length,
      active: brandCampaigns.filter(c => c.status === 'active').length,
      completed: brandCampaigns.filter(c => c.status === 'completed').length,
      upcoming: brandCampaigns.filter(c => c.status === 'draft').length
    };
  };

  const handleApplyNow = (campaignId: Id<"campaigns">) => {
    setSelectedCampaignId(campaignId);
    setShowModal(true);
  };

  if (!brands || !campaigns) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7CA5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading brands...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {brands.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No brands found</h3>
            <p className="text-gray-600">There are no brands available at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => {
            const stats = getCampaignStats(brand._id);
            return (
              <Card key={brand._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{brand.companyName}</CardTitle>
                      <p className="text-sm text-gray-600">{brand.industry}</p>
                    </div>
                    <Badge variant="outline" className="bg-[#3A7CA5]/10 text-[#3A7CA5] border-[#3A7CA5]/20">
                      {brand.location}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#3A7CA5]" />
                      <span className="font-medium">{stats.total} Campaigns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#88B04B]" />
                      <span>{stats.active} Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#E19629]" />
                      <span>{stats.upcoming} Upcoming</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span>{stats.completed} Completed</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-[#3A7CA5] hover:bg-[#3A7CA5]/90"
                    onClick={() => {
                      setSelectedBrand(brand);
                      setShowCampaigns(true);
                    }}
                  >
                    View All Campaigns
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showCampaigns} onOpenChange={setShowCampaigns}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedBrand?.companyName}'s Campaigns</DialogTitle>
          </DialogHeader>
            <p id="brand-campaigns-description" className="sr-only">
              List of all campaigns created by this brand.
            </p>
          <div className="space-y-4">
            {brandCampaigns.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
                  <p className="text-gray-600">This brand hasn't created any campaigns yet.</p>
                </CardContent>
              </Card>
            ) : (
              brandCampaigns.map((campaign) => (
                <Card key={campaign._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{campaign.title}</CardTitle>
                        <p className="text-sm text-gray-600">{campaign.description}</p>
                      </div>
                      <Badge 
                        variant={campaign.status === 'active' ? 'default' : 'secondary'}
                        className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[#88B04B]" />
                        <span className="font-medium">{campaign.budget ? `$${campaign.budget}` : "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#E19629]" />
                        <span>{campaign.endDate || "N/A"}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Requirements:</h4>
                      <p className="text-sm text-gray-700">{campaign.requirements || "No specific requirements listed."}</p>
                    </div>

                    <Button 
                      className="w-full bg-[#3A7CA5] hover:bg-[#3A7CA5]/90"
                      onClick={() => handleApplyNow(campaign._id)}
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}

            {showModal && selectedCampaignId && (
              <ApplicationModal 
                campaignId={selectedCampaignId}
                onClose={() => {
                  setShowModal(false);
                  setSelectedCampaignId(null);
                }}
              />
            )}

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandDiscovery; 