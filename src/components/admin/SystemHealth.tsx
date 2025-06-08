
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export const SystemHealth = () => {
  const systemMetrics = [
    {
      name: 'API Response Time',
      value: '176ms',
      status: 'normal',
      tooltip: 'Average API response time over the last hour'
    },
    {
      name: 'Database Load',
      value: '42%',
      status: 'normal',
      tooltip: 'Current database load percentage'
    },
    {
      name: 'Memory Usage',
      value: '68%',
      status: 'warning',
      tooltip: 'Current server memory usage'
    },
    {
      name: 'Error Rate',
      value: '0.12%',
      status: 'normal',
      tooltip: 'Percentage of requests resulting in errors'
    },
    {
      name: 'CPU Utilization',
      value: '38%',
      status: 'normal',
      tooltip: 'Current CPU usage across all servers'
    },
    {
      name: 'Storage Usage',
      value: '72%',
      status: 'warning',
      tooltip: 'Current storage capacity used'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return <Badge className="bg-[#88B04B]">Normal</Badge>;
      case 'warning':
        return <Badge className="bg-[#E19629]">Warning</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-4 h-4 text-[#88B04B]" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#E19629]" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#3A7CA5]" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemMetrics.map((metric, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-600">{metric.name}</p>
                  <p className="text-xl font-bold">{metric.value}</p>
                </div>
                <div>
                  {getStatusIcon(metric.status)}
                </div>
              </div>
              <Progress 
                value={parseInt(metric.value)} 
                className={`h-1.5 ${
                  metric.status === 'normal' ? 'bg-[#88B04B]/20' : 
                  metric.status === 'warning' ? 'bg-[#E19629]/20' : 
                  metric.status === 'critical' ? 'bg-red-100' : 'bg-gray-200'
                }`} 
              />
              <div className="flex justify-between items-center mt-2">
                {getStatusBadge(metric.status)}
                <p className="text-xs text-gray-500">{metric.tooltip}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};