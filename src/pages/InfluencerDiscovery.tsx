// import { useState } from "react";
// import { useQuery } from "convex/react";
// import { api } from "../../convex/_generated/api";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Separator } from "@/components/ui/separator";
// import { 
//   Search,
//   Filter,
//   MapPin,
//   Users,
//   TrendingUp,
//   Instagram,
//   Twitter,
//   Youtube,
//   Heart,
//   MessageCircle,
//   Share2,
//   Star,
//   CheckCircle
// } from "lucide-react";
// import { motion } from "framer-motion";

// const InfluencerDiscovery = () => {
//   const [followers, setFollowers] = useState([10000, 1000000]);
//   const [engagement, setEngagement] = useState([2, 10]);
//   const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedLocation, setSelectedLocation] = useState("");
//   const [sortBy, setSortBy] = useState("followerCount");
//   const [sortOrder, setSortOrder] = useState("desc");

//   const niches = [
//     "Fashion", "Beauty", "Technology", "Fitness", "Food", "Travel", 
//     "Lifestyle", "Gaming", "Music", "Art", "Sports", "Business"
//   ];

//   const locations = ["Uganda", "UK", "Germany", "Kenya", "Nigeria"];

//   // Convex query with filters
//   const influencers = useQuery(api.influencers.filterInfluencers, {
//     niche: selectedNiches.length === 1 ? selectedNiches[0] : undefined,
//     minFollowers: followers[0],
//     maxFollowers: followers[1],
//     location: selectedLocation || undefined,
//     sortBy: sortBy,
//     sortOrder: sortOrder,
//   });

//   // Filter influencers based on search query and engagement rate
//   const filteredInfluencers = influencers?.filter(influencer => {
//     const matchesSearch = !searchQuery || 
//       influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       influencer.userId?.toLowerCase().includes(searchQuery.toLowerCase());
    
//     const matchesEngagement = !influencer.engagementRate || 
//       (influencer.engagementRate >= engagement[0] && influencer.engagementRate <= engagement[1]);
    
//     const matchesNiches = selectedNiches.length === 0 || 
//       selectedNiches.includes(influencer.niche);

//     return matchesSearch && matchesEngagement && matchesNiches;
//   }) || [];

//   const getPlatformIcon = (platform: string) => {
//     switch (platform) {
//       case 'instagram':
//         return <Instagram className="w-4 h-4" />;
//       case 'twitter':
//         return <Twitter className="w-4 h-4" />;
//       case 'youtube':
//         return <Youtube className="w-4 h-4" />;
//       default:
//         return null;
//     }
//   };

//   const formatNumber = (num: number) => {
//     if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
//     if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
//     return num.toString();
//   };

//   const handleSortChange = (value: string) => {
//     if (value === "relevance") {
//       setSortBy("followerCount");
//       setSortOrder("desc");
//     } else if (value === "followers") {
//       setSortBy("followerCount");
//       setSortOrder("desc");
//     } else if (value === "engagement") {
//       setSortBy("engagementRate");
//       setSortOrder("desc");
//     } else if (value === "rating") {
//       setSortBy("followerCount"); // Default since we don't have rating field
//       setSortOrder("desc");
//     }
//   };

//   return (
//     <div className="space-y-6 p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-primary-800">Discover Influencers</h1>
//           <p className="text-gray-600 mt-1">Find the perfect creators for your campaigns</p>
//         </div>
//         <Button className="bg-primary hover:bg-primary-600">
//           <Filter className="w-4 h-4 mr-2" />
//           Advanced Filters
//         </Button>
//       </div>

//       <div className="grid lg:grid-cols-4 gap-6">
//         {/* Filters Sidebar */}
//         <motion.div 
//           className="lg:col-span-1"
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Card className="sticky top-6">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Filter className="w-5 h-5" />
//                 Filters
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Search */}
//               <div>
//                 <Label htmlFor="search">Search</Label>
//                 <div className="relative mt-1">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <Input
//                     id="search"
//                     placeholder="Search by name or handle..."
//                     className="pl-10"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <Separator />

//               {/* Followers Range */}
//               <div>
//                 <Label>Followers</Label>
//                 <div className="mt-3 mb-4">
//                   <Slider
//                     value={followers}
//                     onValueChange={setFollowers}
//                     max={5000000}
//                     min={1000}
//                     step={1000}
//                     className="w-full"
//                   />
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-500">
//                   <span>{formatNumber(followers[0])}</span>
//                   <span>{formatNumber(followers[1])}</span>
//                 </div>
//               </div>

//               <Separator />

//               {/* Engagement Rate */}
//               <div>
//                 <Label>Engagement Rate (%)</Label>
//                 <div className="mt-3 mb-4">
//                   <Slider
//                     value={engagement}
//                     onValueChange={setEngagement}
//                     max={15}
//                     min={0.1}
//                     step={0.1}
//                     className="w-full"
//                   />
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-500">
//                   <span>{engagement[0]}%</span>
//                   <span>{engagement[1]}%</span>
//                 </div>
//               </div>

//               <Separator />

//               {/* Location */}
//               <div>
//                 <Label htmlFor="location">Location</Label>
//                 <Select value={selectedLocation} onValueChange={setSelectedLocation}>
//                   <SelectTrigger className="mt-1">
//                     <SelectValue placeholder="Select location" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="">All Locations</SelectItem>
//                     {locations.map((location) => (
//                       <SelectItem key={location} value={location}>{location}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <Separator />

//               {/* Niche */}
//               <div>
//                 <Label>Niche</Label>
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {niches.map((niche) => (
//                     <Badge
//                       key={niche}
//                       variant={selectedNiches.includes(niche) ? "default" : "outline"}
//                       className={`cursor-pointer ${
//                         selectedNiches.includes(niche)
//                           ? "bg-primary text-white"
//                           : "hover:bg-primary-50"
//                       }`}
//                       onClick={() => {
//                         if (selectedNiches.includes(niche)) {
//                           setSelectedNiches(selectedNiches.filter(n => n !== niche));
//                         } else {
//                           setSelectedNiches([...selectedNiches, niche]);
//                         }
//                       }}
//                     >
//                       {niche}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Results */}
//         <div className="lg:col-span-3">
//           <div className="flex items-center justify-between mb-6">
//             <p className="text-gray-600">
//               Found <span className="font-semibold">{filteredInfluencers.length}</span> influencers
//             </p>
//             <Select defaultValue="followers" onValueChange={handleSortChange}>
//               <SelectTrigger className="w-48">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="relevance">Most Relevant</SelectItem>
//                 <SelectItem value="followers">Most Followers</SelectItem>
//                 <SelectItem value="engagement">Highest Engagement</SelectItem>
//                 <SelectItem value="rating">Highest Rated</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {influencers === undefined ? (
//             <div className="text-center py-8">Loading influencers...</div>
//           ) : (
//             <div className="grid gap-6">
//               {filteredInfluencers.map((influencer, index) => (
//                 <motion.div
//                   key={influencer._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Card className="hover:shadow-lg transition-shadow">
//                     <CardContent className="p-6">
//                       <div className="flex items-start gap-4">
//                         <Avatar className="w-16 h-16">
//                           <AvatarImage src={influencer.profilePictureUrl || "/placeholder.jpg"} />
//                           <AvatarFallback>{influencer.name?.charAt(0) || "U"}</AvatarFallback>
//                         </Avatar>

//                         <div className="flex-1">
//                           <div className="flex items-start justify-between mb-2">
//                             <div>
//                               <div className="flex items-center gap-2">
//                                 <h3 className="font-semibold text-lg">{influencer.name}</h3>
//                                 <CheckCircle className="w-5 h-5 text-blue-500" />
//                               </div>
//                               <p className="text-gray-600">@{influencer.userId || "username"}</p>
//                             </div>
                            
//                             <div className="text-right">
//                               <div className="flex items-center gap-1 mb-1">
//                                 <Star className="w-4 h-4 text-yellow-500 fill-current" />
//                                 <span className="font-medium">4.8</span>
//                               </div>
//                               <p className="text-sm text-gray-600">$500-1000</p>
//                             </div>
//                           </div>

//                           <div className="flex items-center gap-4 mb-3">
//                             <div className="flex items-center gap-1 text-sm text-gray-600">
//                               <Users className="w-4 h-4" />
//                               <span>{formatNumber(influencer.followerCount || 0)} followers</span>
//                             </div>
//                             {influencer.engagementRate && (
//                               <div className="flex items-center gap-1 text-sm text-gray-600">
//                                 <TrendingUp className="w-4 h-4" />
//                                 <span>{influencer.engagementRate}% engagement</span>
//                               </div>
//                             )}
//                             <div className="flex items-center gap-1 text-sm text-gray-600">
//                               <MapPin className="w-4 h-4" />
//                               <span>{influencer.location}</span>
//                             </div>
//                           </div>

//                           <div className="flex items-center gap-3 mb-4">
//                             <Badge variant="secondary">{influencer.niche}</Badge>
//                             <div className="flex items-center gap-2">
//                               {getPlatformIcon('instagram')}
//                               {getPlatformIcon('youtube')}
//                             </div>
//                           </div>

//                           {influencer.bio && (
//                             <div className="bg-gray-50 rounded-lg p-3 mb-4">
//                               <p className="text-sm text-gray-700 italic">"{influencer.bio}"</p>
//                             </div>
//                           )}

//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-4 text-sm text-gray-600">
//                               <div className="flex items-center gap-1">
//                                 <Heart className="w-4 h-4" />
//                                 <span>2.4k</span>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <MessageCircle className="w-4 h-4" />
//                                 <span>89</span>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <Share2 className="w-4 h-4" />
//                                 <span>24</span>
//                               </div>
//                             </div>

//                             <div className="flex items-center gap-2">
//                               <Button variant="outline" size="sm">
//                                 View Profile
//                               </Button>
//                               <Button size="sm" className="bg-primary hover:bg-primary-600">
//                                 Invite to Campaign
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               ))}
//             </div>
//           )}

//           {filteredInfluencers.length === 0 && influencers !== undefined && (
//             <div className="text-gray-500 text-center py-8">
//               No influencers match your filters.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InfluencerDiscovery;



import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  MapPin,
  Users,
  TrendingUp,
  Instagram,
  Twitter,
  Youtube,
  Heart,
  MessageCircle,
  Share2,
  Star,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

const InfluencerDiscovery = () => {
  const [followers, setFollowers] = useState([10000, 1000000]);
  const [engagement, setEngagement] = useState([2, 10]);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("followerCount");

  const niches = [
    "Fashion", "Beauty", "Technology", "Fitness", "Food", "Travel", 
    "Lifestyle", "Gaming", "Music", "Art", "Sports", "Business"
  ];

  const locations = ["Uganda", "UK", "Germany", "Kenya", "Nigeria"];

  // Query influencers from backend
  const influencers = useQuery(api.influencers.filterInfluencers, {
    niche: selectedNiches.length > 0 ? selectedNiches[0] : undefined,
    minFollowers: followers[0],
    maxFollowers: followers[1],
    location: selectedLocation || undefined,
    minEngagement: engagement[0],
    maxEngagement: engagement[1],
    search: search || undefined,
    sortBy,
    sortOrder: sortBy === "followers" || sortBy === "engagement" || sortBy === "rating" ? "desc" : undefined,
  }) || [];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-800">Discover Influencers</h1>
          <p className="text-gray-600 mt-1">Find the perfect creators for your campaigns</p>
        </div>
        <Button className="bg-primary hover:bg-primary-600">
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search by name or handle..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Followers Range */}
              <div>
                <Label>Followers</Label>
                <div className="mt-3 mb-4">
                  <Slider
                    value={followers}
                    onValueChange={setFollowers}
                    max={5000000}
                    min={1000}
                    step={1000}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{formatNumber(followers[0])}</span>
                  <span>{formatNumber(followers[1])}</span>
                </div>
              </div>

              <Separator />

              {/* Engagement Rate */}
              <div>
                <Label>Engagement Rate (%)</Label>
                <div className="mt-3 mb-4">
                  <Slider
                    value={engagement}
                    onValueChange={setEngagement}
                    max={15}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{engagement[0]}%</span>
                  <span>{engagement[1]}%</span>
                </div>
              </div>

              <Separator />

              {/* Location */}
              <div>
                <Label htmlFor="location">Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Niche */}
              <div>
                <Label>Niche</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {niches.map((niche) => (
                    <Badge
                      key={niche}
                      variant={selectedNiches.includes(niche) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedNiches.includes(niche)
                          ? "bg-primary text-white"
                          : "hover:bg-primary-50"
                      }`}
                      onClick={() => {
                        if (selectedNiches.includes(niche)) {
                          setSelectedNiches(selectedNiches.filter(n => n !== niche));
                        } else {
                          setSelectedNiches([...selectedNiches, niche]);
                        }
                      }}
                    >
                      {niche}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Found <span className="font-semibold">{influencers.length}</span> influencers
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="followerCount">Most Followers</SelectItem>
                <SelectItem value="engagementRate">Highest Engagement</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            {influencers.length > 0 ? (
              influencers.map((influencer, index) => (
                <motion.div
                  key={influencer._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={influencer.profilePictureUrl || "/placeholder.jpg"} />
                          <AvatarFallback>{influencer.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{influencer.name}</h3>
                                <CheckCircle className="w-5 h-5 text-blue-500" />
                              </div>
                              <p className="text-gray-600">@{influencer.userId || "username"}</p>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center gap-1 mb-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="font-medium">4.8</span>
                              </div>
                              <p className="text-sm text-gray-600">$500-1000</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{formatNumber(influencer.followerCount || 0)} followers</span>
                            </div>
                            {influencer.engagementRate && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <TrendingUp className="w-4 h-4" />
                                <span>{influencer.engagementRate}% engagement</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{influencer.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mb-4">
                            <Badge variant="secondary">{influencer.niche}</Badge>
                            <div className="flex items-center gap-2">
                              {getPlatformIcon('instagram')}
                              {getPlatformIcon('youtube')}
                            </div>
                          </div>

                          {influencer.bio && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                              <p className="text-sm text-gray-700 italic">"{influencer.bio}"</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                <span>2.4k</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                <span>89</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Share2 className="w-4 h-4" />
                                <span>24</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                View Profile
                              </Button>
                              <Button size="sm" className="bg-primary hover:bg-primary-600">
                                Invite to Campaign
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">
                No influencers match your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDiscovery;
