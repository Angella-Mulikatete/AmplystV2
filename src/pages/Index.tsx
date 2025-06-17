
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, TrendingUp, MessageSquare, CreditCard, Zap, Target, BarChart3, Shield, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { RoleBasedRedirect } from "@/components/roleBasedRedirect";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Onboarding from "@/components/onboarding";

const Index = () => {
  const navigate = useNavigate();
  const stats = useQuery(api.stats.getStats) ?? {
    influencerCount: 0,
    campaignsCount: 0,
    totalPaid: 0
  };

  const brandCount = useQuery(api.brands.countBrands);



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3A7CA5]/5 to-[#88B04B]/5">
      {/* Navigation */}
       <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Amplyst</span>
          </div> */}
          <div className="flex items-center space-x-2">
            <img 
              src="/src/assets/logo.png"  // or logo.png
              alt="Amplyst Logo"
              className="w-30 h-8 object-contain"  // maintains aspect ratio
            />
            {/* <span className="text-xl font-bold text-gray-900">Amplyst</span> */}
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">How It Works</a>
            <a href="#success-stories" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">Success Stories</a>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              {/* <SignInButton mode="modal">
                <Button variant="ghost"  className="text-gray-600 hover:text-[#3A7CA5]">
                  Sign In
                </Button>
              </SignInButton> */}
               <Button className="bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/90 hover:to-[#88B04B]/90" onClick={() => navigate("/register")}>
                  Get Started
                </Button>
            </SignedOut>
            <SignedIn>
              <RoleBasedRedirect />
              {/* <Onboarding/> */}
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
     
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-[#3A7CA5]/10 text-[#3A7CA5] hover:bg-[#3A7CA5]/10">
            🚀 Smart Influencer Collaboration Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect Small Brands with 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3A7CA5] to-[#88B04B]">
              {" "}Nano & Micro Influencers
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Amplyst empowers nano and micro-influencers to monetize their content while helping small brands 
            and startups discover authentic partnerships that drive real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/register?role=influencer">
              <Button size="lg" className="bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/90 hover:to-[#88B04B]/90 px-8">
                Join as Creator
              </Button>
            </Link>
            <Link to="/register?role=brand">
              <Button size="lg" variant="outline" className="border-[#3A7CA5] text-[#3A7CA5] hover:bg-[#3A7CA5]/5 px-8">
                Find Influencers
              </Button>
            </Link>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#3A7CA5]" />
                  {stats.influencerCount.toLocaleString()} Influencers
                </CardTitle>
                <CardDescription>Growing network of creators</CardDescription>
              </CardHeader>
              {/* <CardContent>
                <TrendingUp className="h-8 w-8 text-[#88B04B] mb-2" />
                <p className="text-sm text-gray-600">45% increase in the last quarter</p>
              </CardContent> */}
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#E19629]" />
                  {stats.campaignsCount.toLocaleString()} Campaigns
                </CardTitle>
                <CardDescription>Opportunities for collaboration</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendingUp className="h-8 w-8 text-[#88B04B] mb-2" />
                <p className="text-sm text-gray-600">30% more campaigns this month</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#3A7CA5]" />
                  $5M+ Paid Out
                  {/* ${stats.totalPaid.toLocaleString()}+ Paid Out */}
                </CardTitle>
                <CardDescription>Earnings for our creators</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendingUp className="h-8 w-8 text-[#88B04B] mb-2" />
                <p className="text-sm text-gray-600">Up 20% from last month</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#88B04B]" />
                     {brandCount !== undefined ? brandCount : "..."} Brands
                </CardTitle>
                <CardDescription>Growing network of Brands on Amplyst</CardDescription>
              </CardHeader>
              {/* <CardContent>
                <TrendingUp className="h-8 w-8 text-[#88B04B] mb-2" />
                <p className="text-sm text-gray-600">Consistent positive feedback</p>
              </CardContent> */}
            </Card>

      

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Zap className="h-8 w-8 text-[#3A7CA5] mb-4 mx-auto" />
              <CardTitle className="text-xl font-semibold text-gray-900">
                Smart Matching
              </CardTitle>
              <CardDescription className="text-gray-600">
                AI-powered matching ensures you find the perfect collaborations.
              </CardDescription>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Target className="h-8 w-8 text-[#E19629] mb-4 mx-auto" />
              <CardTitle className="text-xl font-semibold text-gray-900">
                Targeted Campaigns
              </CardTitle>
              <CardDescription className="text-gray-600">
                Reach your ideal audience with precision targeting.
              </CardDescription>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <BarChart3 className="h-8 w-8 text-[#88B04B] mb-4 mx-auto" />
              <CardTitle className="text-xl font-semibold text-gray-900">
                Performance Tracking
              </CardTitle>
              <CardDescription className="text-gray-600">
                Monitor your campaign's success with detailed analytics.
              </CardDescription>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Shield className="h-8 w-8 text-[#3A7CA5] mb-4 mx-auto" />
              <CardTitle className="text-xl font-semibold text-gray-900">
                Secure Payments
              </CardTitle>
              <CardDescription className="text-gray-600">
                Hassle-free and secure payment processing for all transactions.
              </CardDescription>
            </Card>

            {/* Feature 5 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CheckCircle className="h-8 w-8 text-[#E19629] mb-4 mx-auto" />
              <CardTitle className="text-xl font-semibold text-gray-900">
                Verified Influencers
              </CardTitle>
              <CardDescription className="text-gray-600">
                Collaborate with trusted and verified creators.
              </CardDescription>
            </Card>

            {/* Feature 6 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <MessageSquare className="h-8 w-8 text-[#88B04B] mb-4 mx-auto" />
              <CardTitle className="text-xl font-semibold text-gray-900">
                Direct Communication
              </CardTitle>
              <CardDescription className="text-gray-600">
                Seamlessly communicate with brands and influencers.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#3A7CA5]/10 text-[#3A7CA5] font-bold text-2xl flex items-center justify-center mb-4 mx-auto">
                1
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Create Your Profile
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign up and create a detailed profile showcasing your brand or influencer persona.
              </CardDescription>
            </Card>

            {/* Step 2 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#E19629]/10 text-[#E19629] font-bold text-2xl flex items-center justify-center mb-4 mx-auto">
                2
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Find Opportunities
              </CardTitle>
              <CardDescription className="text-gray-600">
                Browse through a curated list of campaigns or influencers that match your criteria.
              </CardDescription>
            </Card>

            {/* Step 3 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#88B04B]/10 text-[#88B04B] font-bold text-2xl flex items-center justify-center mb-4 mx-auto">
                3
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Collaborate & Earn
              </CardTitle>
              <CardDescription className="text-gray-600">
                Connect with your chosen partners, create content, and get paid securely through our platform.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section id="success-stories" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Story 1 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardTitle className="text-xl font-semibold text-gray-900">
                EcoBrand & InfluencerJane
              </CardTitle>
              <CardDescription className="text-gray-600">
                EcoBrand increased their sales by 40% after collaborating with InfluencerJane on a sustainable living campaign.
              </CardDescription>
            </Card>

            {/* Story 2 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardTitle className="text-xl font-semibold text-gray-900">
                TechStartup & GadgetGuru
              </CardTitle>
              <CardDescription className="text-gray-600">
                TechStartup gained 10,000 new app downloads after GadgetGuru showcased their product in a review video.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-200">
            © 2025 Amplyst. Revolutionizing influencer marketing with AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;










// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Star, Users, TrendingUp, MessageSquare, CreditCard, Zap, Target, BarChart3, Shield, CheckCircle } from "lucide-react";
// import { Link , useNavigate} from "react-router-dom";
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
// import { RoleBasedRedirect } from "@/components/roleBasedRedirect";

// const Index = () => {
//     const navigate = useNavigate();
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#3A7CA5]/10 to-[#88B04B]/10">
//       {/* Navigation */}
      // <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      //   <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      //     {/* <div className="flex items-center space-x-2">
      //       <div className="w-8 h-8 bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] rounded-lg flex items-center justify-center">
      //         <span className="text-white font-bold text-sm">A</span>
      //       </div>
      //       <span className="text-xl font-bold text-gray-900">Amplyst</span>
      //     </div> */}
      //     <div className="flex items-center space-x-2">
      //       <img 
      //         src="/src/assets/logo.png"  // or logo.png
      //         alt="Amplyst Logo"
      //         className="w-30 h-8 object-contain"  // maintains aspect ratio
      //       />
      //       {/* <span className="text-xl font-bold text-gray-900">Amplyst</span> */}
      //     </div>
      //     <div className="hidden md:flex items-center space-x-8">
      //       <a href="#features" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">Features</a>
      //       <a href="#how-it-works" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">How It Works</a>
      //       <a href="#success-stories" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">Success Stories</a>
      //     </div>
      //     <div className="flex items-center space-x-4">
      //       <SignedOut>
      //         {/* <SignInButton mode="modal">
      //           <Button variant="ghost"  className="text-gray-600 hover:text-[#3A7CA5]">
      //             Sign In
      //           </Button>
      //         </SignInButton> */}
      //          <Button className="bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/90 hover:to-[#88B04B]/90" onClick={() => navigate("/register")}>
      //             Get Started
      //           </Button>
          
      //     </SignedOut>
      //     <SignedIn>
      //        <RoleBasedRedirect />
      //       <UserButton afterSignOutUrl="/" />
      //     </SignedIn>
      //     </div>
     
      //   </div>
      // </nav>

//       {/* Hero Section */}
//       <section className="py-20 px-4">
//         <div className="container mx-auto text-center">
//           <Badge className="mb-6 bg-[#3A7CA5]/10 text-[#3A7CA5] hover:bg-[#3A7CA5]/10">
//             🚀 Smart Influencer Collaboration Platform
//           </Badge>
//           <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
//             Connect Small Brands with 
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3A7CA5] to-[#88B04B]">
//               {" "}Nano & Micro Influencers
//             </span>
//           </h1>
//           <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
//             Amplyst empowers nano and micro-influencers to monetize their content while helping small brands 
//             and startups discover authentic partnerships that drive real results.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
//             <Link to="/register?role=influencer">
//               <Button size="lg" className="bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/90 hover:to-[#88B04B]/90 px-8">
//                 Join as Creator
//               </Button>
//             </Link>
//             <Link to="/register?role=brand">
//               <Button size="lg" variant="outline" className="border-[#3A7CA5] text-[#3A7CA5] hover:bg-[#3A7CA5]/10 px-8">
//                 Find Influencers
//               </Button>
//             </Link>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
//             <div className="text-center">
//               <div className="text-3xl font-bold text-[#3A7CA5]">1K-100K</div>
//               <div className="text-gray-600">Follower Range Focus</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-[#88B04B]">SMEs</div>
//               <div className="text-gray-600">& Startups Supported</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-[#E19629]">5%+</div>
//               <div className="text-gray-600">Avg Engagement Rate</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Problem & Solution */}
//       <section className="py-20 px-4 bg-white">
//         <div className="container mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Solving Real Problems</h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Small brands struggle to find the right influencers, while nano and micro-influencers 
//               lack access to brand opportunities. We're changing that.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//             <Card className="p-8">
//               <CardHeader>
//                 <CardTitle className="text-2xl text-red-600 mb-4">The Problem</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-start space-x-3">
//                   <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
//                   <span className="text-gray-700">Small brands can't find relevant nano/micro influencers</span>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
//                   <span className="text-gray-700">Campaigns scattered across DMs and spreadsheets</span>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
//                   <span className="text-gray-700">No structured way to track performance or ROI</span>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
//                   <span className="text-gray-700">Smaller creators lack professional opportunities</span>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="p-8">
//               <CardHeader>
//                 <CardTitle className="text-2xl text-[#88B04B] mb-4">Our Solution</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-start space-x-3">
//                   <CheckCircle className="w-5 h-5 text-[#88B04B] mt-1" />
//                   <span className="text-gray-700">Curated discovery of nano & micro influencers</span>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <CheckCircle className="w-5 h-5 text-[#88B04B] mt-1" />
//                   <span className="text-gray-700">Centralized campaign management platform</span>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <CheckCircle className="w-5 h-5 text-[#88B04B] mt-1" />
//                   <span className="text-gray-700">Real-time analytics and performance tracking</span>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <CheckCircle className="w-5 h-5 text-[#88B04B] mt-1" />
//                   <span className="text-gray-700">Professional tools for smaller creators to grow</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Personas Section */}
//       <section className="py-20 px-4 bg-gradient-to-br from-[#3A7CA5]/5 to-[#88B04B]/5">
//         <div className="container mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for You</h2>
//             <p className="text-xl text-gray-600">Tailored solutions for creators and brands at every stage</p>
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             {/* Nano Influencers */}
//             <Card className="p-6 hover:shadow-xl transition-shadow bg-white">
//               <CardHeader className="text-center pb-4">
//                 <Users className="h-12 w-12 text-[#3A7CA5] mx-auto mb-4" />
//                 <CardTitle className="text-xl">Nano-Influencers</CardTitle>
//                 <CardDescription className="text-sm">
//                   1K-10K followers
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <p className="text-sm text-gray-600 mb-4">Eager to monetize influence and build brand presence with highly engaged, close-knit audiences.</p>
//                 <Link to="/register?role=influencer" className="block">
//                   <Button className="w-full bg-[#3A7CA5] hover:bg-[#3A7CA5]/90 text-sm">
//                     Start Earning
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>

//             {/* Micro Influencers */}
//             <Card className="p-6 hover:shadow-xl transition-shadow bg-white">
//               <CardHeader className="text-center pb-4">
//                 <TrendingUp className="h-12 w-12 text-[#88B04B] mx-auto mb-4" />
//                 <CardTitle className="text-xl">Micro-Influencers</CardTitle>
//                 <CardDescription className="text-sm">
//                   10K-100K followers
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <p className="text-sm text-gray-600 mb-4">Established creators with niche communities, trusted voices in specific interest areas.</p>
//                 <Link to="/register?role=influencer" className="block">
//                   <Button className="w-full bg-[#88B04B] hover:bg-[#88B04B]/90 text-sm">
//                     Scale Partnerships
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>

//             {/* SMEs & Brands */}
//             <Card className="p-6 hover:shadow-xl transition-shadow bg-white">
//               <CardHeader className="text-center pb-4">
//                 <Target className="h-12 w-12 text-[#E19629] mx-auto mb-4" />
//                 <CardTitle className="text-xl">SMEs & Brands</CardTitle>
//                 <CardDescription className="text-sm">
//                   Small to medium businesses
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <p className="text-sm text-gray-600 mb-4">Startups and businesses seeking cost-effective, impactful influencer collaborations.</p>
//                 <Link to="/register?role=brand" className="block">
//                   <Button className="w-full bg-[#3A7CA5] hover:bg-[#3A7CA5]/90 text-sm">
//                     Find Creators
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>

//             {/* Agencies */}
//             <Card className="p-6 hover:shadow-xl transition-shadow bg-white">
//               <CardHeader className="text-center pb-4">
//                 <BarChart3 className="h-12 w-12 text-[#88B04B] mx-auto mb-4" />
//                 <CardTitle className="text-xl">Marketing Agencies</CardTitle>
//                 <CardDescription className="text-sm">
//                   Campaign management firms
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <p className="text-sm text-gray-600 mb-4">Agencies managing influencer campaigns for multiple clients, optimizing marketing spend.</p>
//                 <Link to="/register?role=agency" className="block">
//                   <Button className="w-full bg-[#E19629] hover:bg-[#E19629]/90 text-sm">
//                     Manage Campaigns
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Core Features */}
//       <section id="features" className="py-20 px-4 bg-white">
//         <div className="container mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Platform Features</h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Everything you need for successful influencer collaborations
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             <Card className="hover:shadow-lg transition-shadow">
//               <CardHeader>
//                 <Zap className="h-10 w-10 text-[#3A7CA5] mb-2" />
//                 <CardTitle>Smart Discovery</CardTitle>
//                 <CardDescription>
//                   Advanced filtering by niche, engagement, audience demographics, and location for perfect matches.
//                 </CardDescription>
//               </CardHeader>
//             </Card>
//             <Card className="hover:shadow-lg transition-shadow">
//               <CardHeader>
//                 <Target className="h-10 w-10 text-[#88B04B] mb-2" />
//                 <CardTitle>Campaign Management</CardTitle>
//                 <CardDescription>
//                   Centralized dashboard for creating, tracking, and managing influencer campaigns from start to finish.
//                 </CardDescription>
//               </CardHeader>
//             </Card>
//             <Card className="hover:shadow-lg transition-shadow">
//               <CardHeader>
//                 <BarChart3 className="h-10 w-10 text-[#E19629] mb-2" />
//                 <CardTitle>Real-Time Analytics</CardTitle>
//                 <CardDescription>
//                   Track campaign performance with detailed metrics on reach, engagement, and ROI across platforms.
//                 </CardDescription>
//               </CardHeader>
//             </Card>
//             <Card className="hover:shadow-lg transition-shadow">
//               <CardHeader>
//                 <MessageSquare className="h-10 w-10 text-[#3A7CA5] mb-2" />
//                 <CardTitle>Collaboration Tools</CardTitle>
//                 <CardDescription>
//                   Built-in messaging, file sharing, and feedback systems for seamless brand-creator communication.
//                 </CardDescription>
//               </CardHeader>
//             </Card>
//             <Card className="hover:shadow-lg transition-shadow">
//               <CardHeader>
//                 <CreditCard className="h-10 w-10 text-[#88B04B] mb-2" />
//                 <CardTitle>Secure Payments</CardTitle>
//                 <CardDescription>
//                   Automated payment processing with milestone tracking and secure contract management.
//                 </CardDescription>
//               </CardHeader>
//             </Card>
//             <Card className="hover:shadow-lg transition-shadow">
//               <CardHeader>
//                 <Shield className="h-10 w-10 text-[#E19629] mb-2" />
//                 <CardTitle>Portfolio Building</CardTitle>
//                 <CardDescription>
//                   Professional profiles for influencers to showcase their work, audience insights, and past campaigns.
//                 </CardDescription>
//               </CardHeader>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Success Stories */}
//       <section id="success-stories" className="py-20 px-4 bg-gray-50">
//         <div className="container mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
//             <p className="text-xl text-gray-600">Real results from our community</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <Card className="p-6">
//               <CardContent className="pt-0">
//                 <div className="flex items-center mb-4">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   ))}
//                 </div>
//                 <p className="text-gray-700 mb-4">
//                   "As a nano-influencer with 5K followers, I finally found brands that value authentic engagement over follower count. I've earned $2,000 in my first month!"
//                 </p>
//                 <div className="flex items-center">
//                   <div className="w-10 h-10 bg-[#3A7CA5]/10 rounded-full flex items-center justify-center mr-3">
//                     <span className="text-[#3A7CA5] font-semibold">SJ</span>
//                   </div>
//                   <div>
//                     <div className="font-semibold text-gray-900">Sarah Johnson</div>
//                     <div className="text-sm text-gray-600">Nano-Influencer • Beauty & Skincare</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="p-6">
//               <CardContent className="pt-0">
//                 <div className="flex items-center mb-4">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   ))}
//                 </div>
//                 <p className="text-gray-700 mb-4">
//                   "We launched our sustainable clothing line with 10 micro-influencers and saw 300% increase in sales. The ROI tracking made it easy to prove success!"
//                 </p>
//                 <div className="flex items-center">
//                   <div className="w-10 h-10 bg-[#88B04B]/10 rounded-full flex items-center justify-center mr-3">
//                     <span className="text-[#88B04B] font-semibold">EW</span>
//                   </div>
//                   <div>
//                     <div className="font-semibold text-gray-900">EcoWear Team</div>
//                     <div className="text-sm text-gray-600">Sustainable Fashion Startup</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="p-6">
//               <CardContent className="pt-0">
//                 <div className="flex items-center mb-4">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   ))}
//                 </div>
//                 <p className="text-gray-700 mb-4">
//                   "Managing campaigns for 5 clients across 50+ micro-influencers used to be chaos. Now it's streamlined in one dashboard with detailed reporting for each client."
//                 </p>
//                 <div className="flex items-center">
//                   <div className="w-10 h-10 bg-[#E19629]/10 rounded-full flex items-center justify-center mr-3">
//                     <span className="text-[#E19629] font-semibold">BA</span>
//                   </div>
//                   <div>
//                     <div className="font-semibold text-gray-900">Bright Ideas Agency</div>
//                     <div className="text-sm text-gray-600">Marketing Agency</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 px-4 bg-gradient-to-r from-[#3A7CA5] to-[#88B04B]">
//         <div className="container mx-auto text-center">
//           <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Influencer Marketing?</h2>
//           <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
//             Join thousands of creators and brands building authentic partnerships that drive real results.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link to="/register?role=influencer">
//               <Button size="lg" className="bg-white text-[#3A7CA5] hover:bg-gray-100 px-8">
//                 Start as Creator
//               </Button>
//             </Link>
//             <Link to="/register?role=brand">
//               <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#3A7CA5] px-8">
//                 Find Influencers
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-12 px-4 bg-gray-900">
//         <div className="container mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div>
//               <div className="flex items-center space-x-2 mb-4">
//                 <div className="w-8 h-8 bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] rounded-lg flex items-center justify-center">
//                   <span className="text-white font-bold text-sm">A</span>
//                 </div>
//                 <span className="text-xl font-bold text-white">Amplyst</span>
//               </div>
//               <p className="text-gray-400 text-sm">
//                 The smart influencer collaboration platform connecting nano & micro-influencers with brands.
//               </p>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold mb-4">Platform</h4>
//               <ul className="space-y-2 text-sm">
//                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">For Creators</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">For Brands</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">For Agencies</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold mb-4">Resources</h4>
//               <ul className="space-y-2 text-sm">
//                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Creator Guide</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Brand Playbook</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold mb-4">Company</h4>
//               <ul className="space-y-2 text-sm">
//                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 mt-8 pt-8 text-center">
//             <p className="text-gray-400 text-sm">© 2024 Amplyst. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Index;











