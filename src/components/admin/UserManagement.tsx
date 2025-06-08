
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback ,AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronDown, 
  ChevronUp,
  CheckCircle, 
  XCircle,
  Clock,
  Edit
} from 'lucide-react';

export const UserManagement = () => {
  const [userType, setUserType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      role: 'influencer',
      followers: '5.2K',
      status: 'active',
      joinDate: '2025-02-15',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 2,
      name: 'James Miller',
      email: 'james.m@example.com',
      role: 'influencer',
      followers: '32K',
      status: 'active',
      joinDate: '2025-01-22',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 3,
      name: 'EcoWear Fashion',
      email: 'marketing@ecowear.com',
      role: 'brand',
      status: 'active',
      joinDate: '2024-12-03',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 4,
      name: 'Green Beauty Co.',
      email: 'campaigns@greenbeauty.com',
      role: 'brand',
      status: 'pending_verification',
      joinDate: '2025-05-10',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 5,
      name: 'Bright Ideas Agency',
      email: 'contact@brightideas.com',
      role: 'agency',
      status: 'active',
      joinDate: '2024-11-18',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 6,
      name: 'Michael Chen',
      email: 'michael.c@example.com',
      role: 'influencer',
      followers: '8.7K',
      status: 'suspended',
      joinDate: '2025-03-30',
      avatar: '/api/placeholder/40/40'
    }
  ];

  const filteredUsers = users.filter(user => {
    // Filter by type
    if (userType !== 'all' && user.role !== userType) return false;
    
    // Filter by search query
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-[#88B04B]">Active</Badge>;
      case 'pending_verification':
        return <Badge className="bg-[#E19629]">Pending</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </Button>
        </div>
        
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search users by name or email..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs value={userType} onValueChange={setUserType} className="flex-shrink-0">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="influencer">Influencers</TabsTrigger>
              <TabsTrigger value="brand">Brands</TabsTrigger>
              <TabsTrigger value="agency">Agencies</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">User</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Join Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr 
                  key={user.id} 
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.followers && <p className="text-xs text-gray-400">{user.followers} followers</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className="capitalize">{user.role}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users match your current filters
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">Showing {filteredUsers.length} of {users.length} users</p>
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
  );
};