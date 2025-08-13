import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DollarSign,
  Target,
  MessageSquare,
  Star,
  Users,
  TrendingUp,
  Calendar,
  Edit,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Heart,
  Zap,
  Award,
  Building2,
  Globe,
  Mail,
  Phone
} from 'lucide-react';

// Mock data - replace with your actual data fetching
const mockBrandProfile = {
  name: "TechFlow Brand",
  description: "Innovative technology solutions for modern businesses",
  industry: "Technology",
  location: "San Francisco, CA",
  website: "https://techflow.com",
  email: "contact@techflow.com",
  phone: "+1 (555) 123-4567",
  totalSpent: 45000,
  activeCampaigns: 5,
  totalInfluencers: 23,
  averageROI: 4.2
};

const mockCampaigns = [
  {
    _id: "1",
    title: "Summer Tech Launch",
    description: "Promote our new AI-powered productivity app",
    budget: 15000,
    status: "active",
    startDate: "2024-07-01",
    endDate: "2024-08-31",
    targetAudience: "Tech enthusiasts 25-40",
    contentTypes: ["Video", "Post"],
    applications: 12,
    approved: 3
  },
  {
    _id: "2",
    title: "Back to School Campaign",
    description: "Target students and professionals with our software suite",
    budget: 20000,
    status: "draft",
    startDate: "2024-08-15",
    endDate: "2024-09-30",
    targetAudience: "Students, Professionals",
    contentTypes: ["Story", "Reel"],
    applications: 0,
    approved: 0
  }
];

const mockInfluencers = [
  {
    _id: "1",
    name: "Alex Chen",
    niche: "Technology",
    followers: 125000,
    engagement: 4.8,
    location: "Los Angeles",
    platforms: ["Instagram", "TikTok", "YouTube"],
    priceRange: "$500-1000",
    averageViews: 25000
  },
  {
    _id: "2",
    name: "Sarah Johnson",
    niche: "Lifestyle Tech",
    followers: 85000,
    engagement: 5.2,
    location: "New York",
    platforms: ["Instagram", "YouTube"],
    priceRange: "$300-800",
    averageViews: 18000
  },
  {
    _id: "3",
    name: "Mike Rodriguez",
    niche: "Business Tech",
    followers: 95000,
    engagement: 4.5,
    location: "Austin",
    platforms: ["LinkedIn", "YouTube"],
    priceRange: "$400-900",
    averageViews: 22000
  }
];

const mockApplications = [
  {
    _id: "1",
    influencerName: "Alex Chen",
    campaignTitle: "Summer Tech Launch",
    status: "pending",
    appliedDate: "2024-08-01",
    followers: 125000,
    engagement: 4.8,
    proposedRate: 750,
    message: "I'd love to showcase your AI productivity app to my tech-savvy audience!"
  },
  {
    _id: "2",
    influencerName: "Sarah Johnson",
    campaignTitle: "Summer Tech Launch",
    status: "approved",
    appliedDate: "2024-07-28",
    followers: 85000,
    engagement: 5.2,
    proposedRate: 600,
    message: "Perfect fit for my lifestyle tech content. Looking forward to collaborating!"
  }
];

const BrandDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNiche, setFilterNiche] = useState('all');

  // Mock data (replace with actual API calls)
  const profile = mockBrandProfile;
  const campaigns = mockCampaigns;
  const influencers = mockInfluencers;
  const applications = mockApplications;

  const handleEditProfile = () => {
    setEditingProfile({
      name: profile.name,
      description: profile.description,
      industry: profile.industry,
      location: profile.location,
      website: profile.website,
      email: profile.email,
      phone: profile.phone
    });
    setShowEditProfile(true);
  };

  const handleSaveProfile = () => {
    // Handle profile update logic here
    console.log('Saving profile:', editingProfile);
    setShowEditProfile(false);
  };

  const handleApproveApplication = (applicationId) => {
    console.log('Approving application:', applicationId);
  };

  const handleRejectApplication = (applicationId) => {
    console.log('Rejecting application:', applicationId);
  };

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.niche.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterNiche === 'all' || influencer.niche.toLowerCase().includes(filterNiche.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const renderEditProfileModal = () => (
    <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Brand Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Brand Name</Label>
            <Input
              id="name"
              value={editingProfile?.name || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                name: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editingProfile?.description || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                description: e.target.value
              })}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={editingProfile?.industry || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                industry: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={editingProfile?.location || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                location: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={editingProfile?.website || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                website: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={editingProfile?.email || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                email: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={editingProfile?.phone || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                phone: e.target.value
              })}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 sticky bottom-0 bg-white pt-4 border-t">
          <Button variant="outline" onClick={() => setShowEditProfile(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
            Update Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Brand Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Brand Profile
            </CardTitle>
            <Button variant="secondary" onClick={handleEditProfile}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {profile.name.charAt(0)}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="text-gray-600 mt-1">{profile.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="font-medium">{profile.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{profile.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Total Spend</p>
                <p className="text-2xl font-bold text-green-700">
                  ${profile.totalSpent.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-blue-700">
                  {profile.activeCampaigns}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Total Influencers</p>
                <p className="text-2xl font-bold text-purple-700">
                  {profile.totalInfluencers}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Avg ROI</p>
                <p className="text-2xl font-bold text-orange-700">
                  {profile.averageROI}x
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Campaigns</CardTitle>
            <Button onClick={() => setActiveTab('campaigns')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {campaigns.filter(c => c.status === 'active').length > 0 ? (
            <div className="space-y-4">
              {campaigns.filter(c => c.status === 'active').map((campaign) => (
                <div
                  key={campaign._id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{campaign.title}</h3>
                      <p className="text-sm text-gray-600">{campaign.description}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span>${campaign.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span>{campaign.applications} applications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{campaign.approved} approved</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Campaigns</h3>
              <p className="text-gray-600 mb-4">Create your first campaign to start collaborating with influencers</p>
              <Button onClick={() => setActiveTab('campaigns')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderDiscoverInfluencers = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search influencers by name or niche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterNiche}
              onChange={(e) => setFilterNiche(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Niches</option>
              <option value="technology">Technology</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="business">Business</option>
              <option value="fitness">Fitness</option>
              <option value="beauty">Beauty</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Influencers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInfluencers.map((influencer) => (
          <Card key={influencer._id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {influencer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{influencer.name}</h3>
                  <p className="text-sm text-gray-600">{influencer.niche}</p>
                  <p className="text-xs text-gray-500">{influencer.location}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="font-semibold">{influencer.followers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Engagement</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{influencer.engagement}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rate Range</span>
                  <span className="font-semibold text-green-600">{influencer.priceRange}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {influencer.platforms.map((platform) => (
                    <Badge key={platform} variant="secondary" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  View Profile
                </Button>
                <Button size="sm" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Campaigns</h2>
          <p className="text-gray-600">Manage your influencer marketing campaigns</p>
        </div>
        <Button onClick={() => setShowCreateCampaign(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign._id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{campaign.title}</h3>
                  <p className="text-gray-600">{campaign.description}</p>
                </div>
                <Badge 
                  variant={campaign.status === 'active' ? 'default' : 'secondary'}
                  className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {campaign.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold">
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500">Applications</p>
                    <p className="font-semibold">{campaign.applications}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Approved</p>
                    <p className="font-semibold">{campaign.approved}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {campaign.contentTypes.map((type) => (
                  <Badge key={type} variant="outline">
                    {type}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderApplications = () => (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Applications</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage influencer applications for your campaigns
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications?.length > 0 ? (
            applications.map((application) => (
              <div 
                key={application._id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {application.influencerName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{application.influencerName}</h3>
                      <p className="text-sm text-gray-600">{application.campaignTitle}</p>
                      <p className="text-sm text-gray-500 mt-1">{application.message}</p>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>{application.followers.toLocaleString()} followers</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{application.engagement}% engagement</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span>${application.proposedRate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant={
                        application.status === 'pending' ? 'secondary' :
                        application.status === 'approved' ? 'default' :
                        'destructive'
                      }
                      className={
                        application.status === 'approved' ? 'bg-green-100 text-green-800' : ''
                      }
                    >
                      {application.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </span>
                    
                    {application.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRejectApplication(application._id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleApproveApplication(application._id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600">Campaign applications will appear here when influencers apply</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brand Dashboard</h1>
            <p className="text-gray-600">Manage your influencer marketing campaigns and partnerships</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              Brand Account
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Discover Influencers
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="discover" className="mt-6">
            {renderDiscoverInfluencers()}
          </TabsContent>

          <TabsContent value="campaigns" className="mt-6">
            {renderCampaigns()}
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            {renderApplications()}
          </TabsContent>
        </Tabs>

        {/* Edit Profile Modal */}
        {renderEditProfileModal()}

        {/* Create Campaign Modal */}
        <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-title">Campaign Title</Label>
                  <Input
                    id="campaign-title"
                    placeholder="Enter campaign title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-budget">Budget ($)</Label>
                  <Input
                    id="campaign-budget"
                    type="number"
                    placeholder="10000"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-description">Description</Label>
                <Textarea
                  id="campaign-description"
                  placeholder="Describe your campaign objectives and requirements"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target-audience">Target Audience</Label>
                <Input
                  id="target-audience"
                  placeholder="e.g., Tech enthusiasts 25-40, Students, Professionals"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Content Types</Label>
                <div className="flex flex-wrap gap-2">
                  {['Post', 'Story', 'Reel', 'Video', 'Blog', 'Review'].map((type) => (
                    <Badge
                      key={type}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requirements">Special Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Any specific requirements or guidelines for influencers"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 sticky bottom-0 bg-white pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCreateCampaign(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  console.log('Creating campaign...');
                  setShowCreateCampaign(false);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Campaign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BrandDashboard;