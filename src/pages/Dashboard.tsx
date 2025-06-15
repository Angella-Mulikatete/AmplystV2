import DashboardLayout from "../components/layout/DashboardLayout";
import InfluencerDiscovery from "../pages/InfluencerDiscovery";
import CampaignCreation from "../pages/CampaignCreation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  Eye,
  MessageSquare,
  Star,
  Calendar
} from "lucide-react";

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const userRole = 'brand'; 

  // Mock analytics data
  const analytics = {
    totalCampaigns: 12,
    activeCampaigns: 3,
    totalSpent: 45000,
    totalReach: 2800000,
    avgEngagement: 4.2,
    influencersWorkedWith: 28
  };

  const recentCampaigns = [
    {
      id: 1,
      name: "Summer Fashion Collection",
      status: "Active",
      influencers: 5,
      budget: 15000,
      reach: 850000,
      engagement: 4.8,
      endDate: "2024-07-15"
    },
    {
      id: 2,
      name: "Tech Product Launch",
      status: "Completed",
      influencers: 3,
      budget: 12000,
      reach: 650000,
      engagement: 5.2,
      endDate: "2024-06-30"
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-primary-800">{analytics.totalCampaigns}</p>
              </div>
              <Target className="w-8 h-8 text-primary-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+2 this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reach</p>
                <p className="text-2xl font-bold text-primary-800">
                  {(analytics.totalReach / 1000000).toFixed(1)}M
                </p>
              </div>
              <Eye className="w-8 h-8 text-secondary-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+15% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Engagement</p>
                <p className="text-2xl font-bold text-primary-800">{analytics.avgEngagement}%</p>
              </div>
              <MessageSquare className="w-8 h-8 text-accent-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-gray-600">Above industry avg</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-primary-800">
                  ${(analytics.totalSpent / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <Calendar className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-gray-600">This year</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Campaigns</CardTitle>
            <Button onClick={() => setActiveView('create')}>
              Create New Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <Badge 
                      variant={campaign.status === 'Active' ? 'default' : 'secondary'}
                      className={campaign.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span>{campaign.influencers} influencers</span>
                    <span>${campaign.budget.toLocaleString()} budget</span>
                    <span>{(campaign.reach / 1000).toFixed(0)}K reach</span>
                    <span>{campaign.engagement}% engagement</span>
                  </div>
                </div>
                <div className="text-right">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return renderOverview();
      case 'discover':
        return <InfluencerDiscovery />;
      case 'create':
        return <CampaignCreation />;
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout userRole={userRole} userName="John Smith" userAvatar="/placeholder.svg">
      <div className="space-y-6">
        {/* Quick Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant={activeView === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveView('overview')}
            className={activeView === 'overview' ? 'bg-primary hover:bg-primary-600' : ''}
          >
            Dashboard Overview
          </Button>
          <Button 
            variant={activeView === 'discover' ? 'default' : 'outline'}
            onClick={() => setActiveView('discover')}
            className={activeView === 'discover' ? 'bg-secondary hover:bg-secondary-600' : ''}
          >
            Discover Influencers
          </Button>
          <Button 
            variant={activeView === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveView('create')}
            className={activeView === 'create' ? 'bg-accent hover:bg-accent-600' : ''}
          >
            Create Campaign
          </Button>
        </div>

        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;