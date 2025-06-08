
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Calendar, BarChart3, PieChart } from 'lucide-react';

export const PlatformAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into platform performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user registration trends</CardDescription>
              </CardHeader>
              <CardContent className="h-80 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-gray-300" />
                  <p className="mt-4 text-sm text-gray-500">User growth chart visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown by user type</CardDescription>
              </CardHeader>
              <CardContent className="h-80 relative">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="mb-8">
                    <PieChart className="w-12 h-12 text-gray-300 mx-auto" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-[#3A7CA5] mb-2"></div>
                      <p className="text-sm font-medium">Influencers</p>
                      <p className="text-2xl font-bold">65%</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-[#88B04B] mb-2"></div>
                      <p className="text-sm font-medium">Brands</p>
                      <p className="text-2xl font-bold">25%</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-[#E19629] mb-2"></div>
                      <p className="text-sm font-medium">Agencies</p>
                      <p className="text-2xl font-bold">10%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>Campaign Analytics</CardTitle>
                <CardDescription>Performance metrics across campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Average Campaign Duration', value: '45 days' },
                    { metric: 'Average Engagement Rate', value: '4.2%' },
                    { metric: 'Average Campaign Budget', value: '$5,850' },
                    { metric: 'Campaign Completion Rate', value: '87%' },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{item.metric}</p>
                      <p className="text-sm font-bold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>Platform Engagement</CardTitle>
                <CardDescription>User activity and interaction metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Average Session Duration', value: '12m 30s' },
                    { metric: 'Pages per Session', value: '6.8' },
                    { metric: 'Daily Active Users', value: '3,450' },
                    { metric: 'Message Response Rate', value: '92%' },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{item.metric}</p>
                      <p className="text-sm font-bold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>Detailed user growth and interaction metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <p>Detailed user analytics would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="campaigns">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>In-depth campaign analytics and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <p>Detailed campaign analytics would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Financial performance and revenue insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <p>Detailed revenue analytics would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};