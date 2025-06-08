import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const niches = ["Fashion", "Tech", "Fitness", "Beauty", "Travel"];
const locations = ["Uganda", "UK", "Germany", "Kenya", "Nigeria"];

export default function InfluencerDiscovery() {
  const [filters, setFilters] = useState({
    niche: "",
    minFollowers: "",
    maxFollowers: "",
    location: "",
    sortBy: "followerCount",
    sortOrder: "desc",
  });

  const influencers = useQuery(api.influencers.filterInfluencers, {
    niche: filters.niche || undefined,
    minFollowers: filters.minFollowers ? Number(filters.minFollowers) : undefined,
    maxFollowers: filters.maxFollowers ? Number(filters.maxFollowers) : undefined,
    location: filters.location || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Discover Influencers</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Select
          value={filters.niche || undefined} // Make it controlled, use undefined for placeholder
          onValueChange={value => setFilters(f => ({ ...f, niche: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Niches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined}>All Niches</SelectItem> {/* Use undefined for "All" */}
            {niches.map(niche => <SelectItem key={niche} value={niche}>{niche}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Min Followers"
          value={filters.minFollowers}
          onChange={e => setFilters(f => ({ ...f, minFollowers: e.target.value }))}
        />
        <Input
          type="number"
          placeholder="Max Followers"
          value={filters.maxFollowers}
          onChange={e => setFilters(f => ({ ...f, maxFollowers: e.target.value }))}
        />
        <Select
          value={filters.location || undefined} // Make it controlled, use undefined for placeholder
          onValueChange={value => setFilters(f => ({ ...f, location: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined}>All Locations</SelectItem> {/* Use undefined for "All" */}
            {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select
          value={filters.sortBy}
          onValueChange={value => setFilters(f => ({ ...f, sortBy: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="followerCount">Followers</SelectItem>
            <SelectItem value="engagementRate">Engagement</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {influencers?.map((influencer: typeof influencers[number] & { engagementRate?: number, followerCount?: number }) => (
          <Card key={influencer._id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={influencer.profilePictureUrl || "/placeholder.jpg"}
                  alt={influencer.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{influencer.name}</h3>
                  <p className="text-sm text-gray-500">{influencer.niche} • {influencer.location}</p>
                  <div className="text-xs text-gray-600 mt-1">
                    <span><strong>Followers:</strong> {influencer.followerCount}</span>
                    <span className="ml-4"><strong>Engagement:</strong> {influencer.engagementRate || "N/A"}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <Button size="sm" variant="outline">View Profile</Button>
                <Button size="sm" className="ml-2">Invite to Campaign</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {influencers && influencers.length === 0 && (
        <div className="text-gray-500 text-center py-8">No influencers match your filters.</div>
      )}
    </div>
  );
}




























// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Slider } from "@/components/ui/slider";
// import { Separator } from "@/components/ui/separator";
// import { Search, Filter, MapPin, Users, Heart, MessageCircle, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import BrandNavbar from "@/components/brand/BrandNavbar";

// const InfluencerDiscovery = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState({
//     category: "",
//     location: "",
//     followerRange: [1000, 1000000],
//     engagementRate: [1, 10],
//     priceRange: [100, 10000]
//   });

//   const [showFilters, setShowFilters] = useState(false);

//   const influencers = [
//     {
//       id: 1,
//       name: "Sarah Johnson",
//       username: "@sarahjohnson",
//       avatar: "/placeholder.svg",
//       category: "Fashion & Beauty",
//       followers: 45000,
//       engagement: 4.2,
//       location: "New York, NY",
//       rate: 1200,
//       bio: "Fashion enthusiast and beauty guru. Love sharing style tips and product reviews.",
//       tags: ["Fashion", "Beauty", "Lifestyle"]
//     },
//     {
//       id: 2,
//       name: "Mike Chen",
//       username: "@mikethebiker",
//       avatar: "/placeholder.svg",
//       category: "Technology",
//       followers: 78000,
//       engagement: 3.8,
//       location: "San Francisco, CA",
//       rate: 2100,
//       bio: "Tech reviewer and gadget enthusiast. Always testing the latest devices.",
//       tags: ["Technology", "Reviews", "Gadgets"]
//     },
//     {
//       id: 3,
//       name: "Emma Davis",
//       username: "@emmafitness",
//       avatar: "/placeholder.svg",
//       category: "Fitness & Health",
//       followers: 92000,
//       engagement: 5.1,
//       location: "Los Angeles, CA",
//       rate: 1800,
//       bio: "Certified personal trainer helping people achieve their fitness goals.",
//       tags: ["Fitness", "Health", "Wellness"]
//     },
//     {
//       id: 4,
//       name: "Alex Rivera",
//       username: "@alexeats",
//       avatar: "/placeholder.svg",
//       category: "Food & Beverage",
//       followers: 34000,
//       engagement: 4.7,
//       location: "Chicago, IL",
//       rate: 950,
//       bio: "Food blogger and chef sharing delicious recipes and restaurant reviews.",
//       tags: ["Food", "Cooking", "Restaurants"]
//     }
//   ];

//   const categories = [
//     "All Categories",
//     "Fashion & Beauty",
//     "Technology",
//     "Fitness & Health",
//     "Food & Beverage",
//     "Travel & Lifestyle",
//     "Gaming",
//     "Education",
//     "Entertainment"
//   ];

//   const formatFollowers = (count: number) => {
//     if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
//     if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
//     return count.toString();
//   };

//   const filteredInfluencers = influencers.filter(influencer => {
//     const matchesSearch = influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          influencer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          influencer.category.toLowerCase().includes(searchQuery.toLowerCase());
    
//     const matchesCategory = !filters.category || filters.category === "All Categories" || 
//                            influencer.category === filters.category;
    
//     const matchesFollowers = influencer.followers >= filters.followerRange[0] && 
//                            influencer.followers <= filters.followerRange[1];
    
//     const matchesEngagement = influencer.engagement >= filters.engagementRate[0] && 
//                             influencer.engagement <= filters.engagementRate[1];
    
//     const matchesPrice = influencer.rate >= filters.priceRange[0] && 
//                        influencer.rate <= filters.priceRange[1];

//     return matchesSearch && matchesCategory && matchesFollowers && matchesEngagement && matchesPrice;
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
//       <BrandNavbar />
      
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex items-center mb-8">
//           <Button 
//             variant="ghost" 
//             onClick={() => navigate("/brand/dashboard")}
//             className="mr-4"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Dashboard
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 font-poppins">Discover Influencers</h1>
//             <p className="text-gray-600 mt-2 font-sofia">Find the perfect influencers for your campaigns</p>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <Card className="mb-8 animate-fade-in">
//           <CardContent className="p-6">
//             <div className="flex flex-col md:flex-row gap-4 mb-4">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search influencers by name, username, or category..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               <Button
//                 variant="outline"
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center space-x-2"
//               >
//                 <Filter className="h-4 w-4" />
//                 <span>Filters</span>
//               </Button>
//             </div>

//             {showFilters && (
//               <div className="border-t pt-4 animate-fade-in">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Category</label>
//                     <Select onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select category" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {categories.map((category) => (
//                           <SelectItem key={category} value={category}>
//                             {category}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Followers: {formatFollowers(filters.followerRange[0])} - {formatFollowers(filters.followerRange[1])}
//                     </label>
//                     <Slider
//                       value={filters.followerRange}
//                       onValueChange={(value) => setFilters(prev => ({ ...prev, followerRange: value }))}
//                       min={1000}
//                       max={1000000}
//                       step={1000}
//                       className="w-full"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Engagement Rate: {filters.engagementRate[0]}% - {filters.engagementRate[1]}%
//                     </label>
//                     <Slider
//                       value={filters.engagementRate}
//                       onValueChange={(value) => setFilters(prev => ({ ...prev, engagementRate: value }))}
//                       min={1}
//                       max={10}
//                       step={0.1}
//                       className="w-full"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Results */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredInfluencers.map((influencer, index) => (
//             <Card 
//               key={influencer.id} 
//               className="hover-lift animate-fade-in cursor-pointer"
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               <CardHeader className="pb-4">
//                 <div className="flex items-center space-x-4">
//                   <Avatar className="h-12 w-12">
//                     <AvatarImage src={influencer.avatar} alt={influencer.name} />
//                     <AvatarFallback className="bg-primary text-white">
//                       {influencer.name.split(' ').map(n => n[0]).join('')}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-lg font-poppins">{influencer.name}</h3>
//                     <p className="text-sm text-gray-600">{influencer.username}</p>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <p className="text-sm text-gray-600 line-clamp-2">{influencer.bio}</p>
                
//                 <div className="flex flex-wrap gap-1">
//                   {influencer.tags.map((tag) => (
//                     <Badge key={tag} variant="secondary" className="text-xs">
//                       {tag}
//                     </Badge>
//                   ))}
//                 </div>

//                 <Separator />

//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div className="flex items-center space-x-2">
//                     <Users className="h-4 w-4 text-primary" />
//                     <span>{formatFollowers(influencer.followers)}</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Heart className="h-4 w-4 text-red-500" />
//                     <span>{influencer.engagement}%</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <MapPin className="h-4 w-4 text-gray-500" />
//                     <span className="text-xs">{influencer.location}</span>
//                   </div>
//                   <div className="text-right">
//                     <span className="font-semibold text-accent">${influencer.rate}</span>
//                     <span className="text-xs text-gray-500">/post</span>
//                   </div>
//                 </div>

//                 <div className="flex space-x-2 pt-2">
//                   <Button size="sm" className="flex-1 bg-primary hover:bg-primary-600">
//                     <MessageCircle className="h-4 w-4 mr-2" />
//                     Contact
//                   </Button>
//                   <Button size="sm" variant="outline" className="flex-1">
//                     View Profile
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {filteredInfluencers.length === 0 && (
//           <Card className="p-8 text-center animate-fade-in">
//             <CardContent>
//               <p className="text-gray-500 mb-4">No influencers found matching your criteria.</p>
//               <Button 
//                 variant="outline" 
//                 onClick={() => {
//                   setSearchQuery("");
//                   setFilters({
//                     category: "",
//                     location: "",
//                     followerRange: [1000, 1000000],
//                     engagementRate: [1, 10],
//                     priceRange: [100, 10000]
//                   });
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InfluencerDiscovery;
