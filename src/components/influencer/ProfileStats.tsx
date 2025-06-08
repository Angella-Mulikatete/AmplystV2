
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Eye, Heart, DollarSign } from "lucide-react";
import { useQuery } from "convex/react";
//import { api } from "../../convex/_generated/api";


//const profile = useQuery(api.users.getInfluencerProfile);

const ProfileStats = ({ profile }) => {
  
  const stats = [
    {
      title: "Total Followers",
      value: profile.followerCount ? profile.followerCount.toLocaleString() : "0",
      icon: Users,
      change: "+12.5%",
      color: "text-[#3A7CA5]",
      bgColor: "bg-[#3A7CA5]/10"
    },
    {
      title: "Engagement Rate",
      value: profile.engagementRate ? `${profile.engagementRate}%` : "N/A",
      icon: Heart,
      change: "+0.3%",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      title: "Monthly Views",
      value: profile.monthlyViews ? profile.monthlyViews.toLocaleString() : "N/A",
      icon: Eye,
      change: "+8.7%",
      color: "text-[#E19629]",
      bgColor: "bg-[#E19629]/10"
    },
    {
      title: "Earnings (MTD)",
      value: profile.earnings ? `$${profile.earnings}` : "$0",
      icon: DollarSign,
      change: "+15.2%",
      color: "text-[#88B04B]",
      bgColor: "bg-[#88B04B]/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.color} flex items-center gap-1 mt-1`}>
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProfileStats;