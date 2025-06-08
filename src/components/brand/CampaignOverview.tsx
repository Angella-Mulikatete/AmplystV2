
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CampaignOverview = () => {
  const navigate = useNavigate();
  
  const campaigns = [
    {
      id: 1,
      name: "Summer Collection Launch",
      status: "active",
      budget: 5000,
      influencers: 8,
      startDate: "2024-06-01",
      endDate: "2024-06-30",
      reach: "450K",
      engagement: "4.2%"
    },
    {
      id: 2,
      name: "Back to School Campaign",
      status: "planning",
      budget: 3000,
      influencers: 5,
      startDate: "2024-07-15",
      endDate: "2024-08-15",
      reach: "300K",
      engagement: "3.8%"
    },
    {
      id: 3,
      name: "Holiday Special Promo",
      status: "completed",
      budget: 7500,
      influencers: 12,
      startDate: "2024-05-01",
      endDate: "2024-05-31",
      reach: "680K",
      engagement: "5.1%"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-secondary text-white";
      case "planning": return "bg-accent text-white";
      case "completed": return "bg-gray-500 text-white";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-poppins">Campaign Overview</CardTitle>
          <Button 
            variant="outline"
            onClick={() => navigate("/brand/campaigns/create")}
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign, index) => (
            <div 
              key={campaign.id} 
              className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg font-poppins">{campaign.name}</h3>
                  <Badge className={`${getStatusColor(campaign.status)} capitalize mt-1`}>
                    {campaign.status}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-accent" />
                  <span className="text-gray-600">${campaign.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-secondary" />
                  <span className="text-gray-600">{campaign.influencers} influencers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-gray-600">{campaign.startDate}</span>
                </div>
                <div className="text-gray-600">
                  Reach: <span className="font-semibold">{campaign.reach}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignOverview;
