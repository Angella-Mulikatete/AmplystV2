
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "application",
      influencer: "Sarah Johnson",
      campaign: "Summer Collection",
      time: "2 hours ago",
      status: "pending"
    },
    {
      id: 2,
      type: "completion",
      influencer: "Mike Chen",
      campaign: "Tech Review",
      time: "5 hours ago",
      status: "completed"
    },
    {
      id: 3,
      type: "milestone",
      influencer: "Emma Davis",
      campaign: "Fitness Challenge",
      time: "1 day ago",
      status: "milestone"
    },
    {
      id: 4,
      type: "application",
      influencer: "Alex Rivera",
      campaign: "Food & Lifestyle",
      time: "2 days ago",
      status: "approved"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "application": return "📝";
      case "completion": return "✅";
      case "milestone": return "🎯";
      default: return "📌";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-accent text-white";
      case "completed": return "bg-secondary text-white";
      case "approved": return "bg-primary text-white";
      case "milestone": return "bg-purple-500 text-white";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <CardHeader>
        <CardTitle className="text-xl font-poppins flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary text-white">
                  {activity.influencer.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.influencer}
                  </p>
                  <span className="text-xs">{getActivityIcon(activity.type)}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {activity.campaign}
                </p>
                <div className="flex items-center justify-between">
                  <Badge className={`${getStatusColor(activity.status)} text-xs capitalize`}>
                    {activity.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
