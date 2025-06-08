
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, DollarSign, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

interface AdminStatsProps {
  animate: boolean;
}

export const AdminStats = ({ animate }: AdminStatsProps) => {
  const stats = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+12.5%',
      icon: Users,
      color: 'text-[#3A7CA5]',
      bgColor: 'bg-[#3A7CA5]/10'
    },
    {
      title: 'Active Campaigns',
      value: '1,205',
      change: '+8.2%',
      icon: Activity,
      color: 'text-[#88B04B]',
      bgColor: 'bg-[#88B04B]/10'
    },
    {
      title: 'Monthly Revenue',
      value: '$48,392',
      change: '+15.3%',
      icon: DollarSign,
      color: 'text-[#E19629]',
      bgColor: 'bg-[#E19629]/10'
    },
    {
      title: 'Platform Health',
      value: '99.8%',
      change: 'Stable',
      icon: CheckCircle,
      color: 'text-[#88B04B]',
      bgColor: 'bg-[#88B04B]/10'
    },
    {
      title: 'Support Tickets',
      value: '23',
      change: '-5.1%',
      icon: AlertTriangle,
      color: 'text-[#E19629]',
      bgColor: 'bg-[#E19629]/10'
    },
    {
      title: 'Growth Rate',
      value: '18.7%',
      change: '+2.4%',
      icon: TrendingUp,
      color: 'text-[#3A7CA5]',
      bgColor: 'bg-[#3A7CA5]/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={stat.title} 
          className={`hover:shadow-lg transition-all duration-500 ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
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
            <p className={`text-xs mt-1 ${
              stat.change.includes('+') ? 'text-[#88B04B]' : 
              stat.change.includes('-') ? 'text-red-500' : 'text-gray-500'
            }`}>
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};