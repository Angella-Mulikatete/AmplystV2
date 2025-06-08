
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Calendar, DollarSign, BarChart3, LineChart, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '../ui/badge';

export const RevenueReports = () => {
  const revenueData = [
    { month: 'Jan', value: 42500 },
    { month: 'Feb', value: 47800 },
    { month: 'Mar', value: 52100 },
    { month: 'Apr', value: 60300 },
    { month: 'May', value: 58200 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Revenue Management</h2>
          <p className="text-gray-600">Financial insights and reporting</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            May 2025
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Reports
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'Total Revenue',
            value: '$48,392',
            change: '+15.3%',
            trend: 'up',
            icon: DollarSign,
            color: 'text-[#3A7CA5]',
            bgColor: 'bg-[#3A7CA5]/10'
          },
          {
            title: 'Platform Fees',
            value: '$12,098',
            change: '+12.8%',
            trend: 'up',
            icon: BarChart3,
            color: 'text-[#88B04B]',
            bgColor: 'bg-[#88B04B]/10'
          },
          {
            title: 'Avg. Campaign Value',
            value: '$5,850',
            change: '-2.4%',
            trend: 'down',
            icon: LineChart,
            color: 'text-[#E19629]',
            bgColor: 'bg-[#E19629]/10'
          }
        ].map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center mt-1">
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-[#88B04B] mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                )}
                <p className={`text-xs ${
                  stat.trend === 'up' ? 'text-[#88B04B]' : 'text-red-500'
                }`}>
                  {stat.change} from last month
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="forecasts">Financial Forecasts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue trends over the last 5 months</CardDescription>
              </CardHeader>
              <CardContent className="h-80 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full px-10">
                    {/* Simple bar chart representation */}
                    <div className="flex items-end justify-between h-40 gap-4">
                      {revenueData.map((month) => (
                        <div key={month.month} className="flex flex-col items-center w-full">
                          <div 
                            className="w-full bg-[#3A7CA5] hover:bg-[#3A7CA5]/80 transition-colors rounded-t-md"
                            style={{ 
                              height: `${(month.value / 65000) * 100}%`,
                            }}
                          ></div>
                          <div className="mt-2 text-xs font-medium">{month.month}</div>
                          <div className="mt-1 text-xs text-gray-500">${(month.value / 1000).toFixed(1)}k</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
                <CardDescription>Breakdown by revenue source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { source: 'Platform Subscriptions', percentage: 42, amount: '$20,325' },
                    { source: 'Campaign Fees', percentage: 35, amount: '$16,937' },
                    { source: 'Premium Features', percentage: 18, amount: '$8,710' },
                    { source: 'Other', percentage: 5, amount: '$2,420' }
                  ].map((source) => (
                    <div key={source.source}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{source.source}</span>
                        <span className="text-sm text-gray-600">{source.amount} ({source.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className="bg-[#3A7CA5] h-2.5 rounded-full" 
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300 lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Performing Brands</CardTitle>
                <CardDescription>Brands with highest campaign spending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Brand</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Total Spend</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Campaigns</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Avg. ROI</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { name: 'EcoWear Fashion', spend: '$12,450', campaigns: 5, roi: '320%', status: 'active' },
                        { name: 'Green Beauty Co.', spend: '$8,750', campaigns: 3, roi: '275%', status: 'active' },
                        { name: 'Active Life Brands', spend: '$7,200', campaigns: 2, roi: '410%', status: 'active' },
                        { name: 'NatureBites', spend: '$5,800', campaigns: 3, roi: '180%', status: 'active' }
                      ].map((brand) => (
                        <tr key={brand.name} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4 font-medium">{brand.name}</td>
                          <td className="px-4 py-4">{brand.spend}</td>
                          <td className="px-4 py-4">{brand.campaigns}</td>
                          <td className="px-4 py-4 text-[#88B04B] font-medium">{brand.roi}</td>
                          <td className="px-4 py-4">
                            <Badge className="bg-[#88B04B]">Active</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent platform financial transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <p>Transaction history would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="forecasts">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Financial Forecasts</CardTitle>
              <CardDescription>Projected revenue and growth metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <p>Financial forecasts would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};