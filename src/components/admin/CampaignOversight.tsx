
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, BarChart3, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const CampaignOversight = () => {
  const [campaignStatus, setCampaignStatus] = useState('all');

  const campaigns = [
    {
      id: 1,
      name: 'Summer Collection Launch',
      brand: 'EcoWear Fashion',
      status: 'active',
      budget: '$5,000',
      spent: '$2,450',
      influencers: 8,
      progress: 75,
      startDate: '2025-05-15',
      endDate: '2025-06-30',
      engagement: '4.2%'
    },
    {
      id: 2,
      name: 'Vegan Skincare Promotion',
      brand: 'Green Beauty Co.',
      status: 'pending_approval',
      budget: '$3,200',
      spent: '$0',
      influencers: 5,
      progress: 0,
      startDate: '2025-06-01',
      endDate: '2025-07-15',
      engagement: 'N/A'
    },
    {
      id: 3,
      name: 'Fitness Challenge Series',
      brand: 'Active Life Brands',
      status: 'completed',
      budget: '$8,750',
      spent: '$8,750',
      influencers: 12,
      progress: 100,
      startDate: '2025-03-10',
      endDate: '2025-05-10',
      engagement: '6.8%'
    },
    {
      id: 4,
      name: 'Plant-Based Snacks Launch',
      brand: 'NatureBites',
      status: 'active',
      budget: '$4,500',
      spent: '$1,200',
      influencers: 7,
      progress: 35,
      startDate: '2025-05-20',
      endDate: '2025-07-05',
      engagement: '3.9%'
    },
    {
      id: 5,
      name: 'Tech Gadget Review Series',
      brand: 'Bright Ideas Agency',
      status: 'flagged',
      budget: '$12,000',
      spent: '$4,800',
      influencers: 6,
      progress: 40,
      startDate: '2025-04-25',
      endDate: '2025-07-25',
      engagement: '2.1%'
    }
  ];

  const filteredCampaigns = campaigns.filter(campaign => {
    if (campaignStatus === 'all') return true;
    return campaign.status === campaignStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#88B04B] rounded-full animate-pulse"></div>
            <Badge className="bg-[#88B04B]">Active</Badge>
          </div>
        );
      case 'pending_approval':
        return (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#E19629]" />
            <Badge className="bg-[#E19629]">Pending</Badge>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-[#3A7CA5]" />
            <Badge className="bg-[#3A7CA5]">Completed</Badge>
          </div>
        );
      case 'flagged':
        return (
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <Badge variant="destructive">Flagged</Badge>
          </div>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaign Management</CardTitle>
              <CardDescription className="mt-1">Monitor and manage all platform campaigns</CardDescription>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </Button>
          </div>
          
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Search campaigns..." className="pl-9" />
            </div>
            
            <Tabs value={campaignStatus} onValueChange={setCampaignStatus} className="flex-shrink-0">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending_approval">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="flagged">Flagged</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Campaign</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Budget</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Progress</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Engagement</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Timeline</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCampaigns.map(campaign => (
                  <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-gray-500">{campaign.brand}</p>
                        <p className="text-xs text-gray-400">{campaign.influencers} influencers</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium">{campaign.budget}</p>
                        <p className="text-sm text-gray-500">{campaign.spent} spent</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 w-36">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Progress</span>
                          <span className="text-xs font-medium">{campaign.progress}%</span>
                        </div>
                        <Progress 
                          value={campaign.progress} 
                          className={`h-2 ${
                            campaign.status === 'completed' ? 'bg-[#3A7CA5]/20' : 
                            campaign.status === 'flagged' ? 'bg-red-100' : 'bg-[#88B04B]/20'
                          }`} 
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge 
                        className={
                          campaign.engagement === 'N/A' ? 'bg-gray-200 text-gray-600' :
                          parseFloat(campaign.engagement) > 5 ? 'bg-[#88B04B]' : 'bg-[#3A7CA5]'
                        }
                      >
                        {campaign.engagement}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <div>
                        <p>{new Date(campaign.startDate).toLocaleDateString()} -</p>
                        <p>{new Date(campaign.endDate).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex gap-2 items-center"
                      >
                        <Eye className="w-3 h-3" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCampaigns.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No campaigns match your current filters
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">Showing {filteredCampaigns.length} of {campaigns.length} campaigns</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-slate-100">
                1
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#E19629]" />
              Campaigns Requiring Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {campaigns
                .filter(c => c.status === 'flagged' || c.status === 'pending_approval')
                .map(campaign => (
                  <div key={campaign.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-gray-600">{campaign.brand}</p>
                        <div className="mt-1">{getStatusBadge(campaign.status)}</div>
                      </div>
                      <Button variant="outline" size="sm">Review</Button>
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#3A7CA5]" />
              Campaign Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Average Engagement Rate</p>
                <div className="w-full bg-gray-100 rounded-full h-4">
                  <div 
                    className="bg-[#3A7CA5] h-4 rounded-full" 
                    style={{ width: '42%' }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>0%</span>
                  <span className="font-medium text-[#3A7CA5]">4.2%</span>
                  <span>10%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Campaign Completion Rate</p>
                <div className="w-full bg-gray-100 rounded-full h-4">
                  <div 
                    className="bg-[#88B04B] h-4 rounded-full" 
                    style={{ width: '85%' }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>0%</span>
                  <span className="font-medium text-[#88B04B]">85%</span>
                  <span>100%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Budget Utilization</p>
                <div className="w-full bg-gray-100 rounded-full h-4">
                  <div 
                    className="bg-[#E19629] h-4 rounded-full" 
                    style={{ width: '68%' }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>0%</span>
                  <span className="font-medium text-[#E19629]">68%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};