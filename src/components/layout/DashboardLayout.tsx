import { ReactNode, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { 
  Bell, 
  Search, 
  Settings, 
  LogOut,
  Home,
  Users,
  Target,
  BarChart3,
  MessageSquare,
  Briefcase,
  Menu,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";



// Dashboard Layout Component
const DashboardLayout = ({ children, userRole = "brand", userName = "Brand Co" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getNavItems = () => {
    const commonItems = [
      { label: "Dashboard", href: `/${userRole}/dashboard`, icon: Home },
      { label: "Messages", href: `/${userRole}/messages`, icon: MessageSquare },
      { label: "Settings", href: `/${userRole}/settings`, icon: Settings },
    ];
// /brand/applications
    const brandItems = [
      ...commonItems,
      { label: "Discover Influencers", href: "/influencer/discover", icon: Users },
      { label: "Campaigns", href: "/brand/campaigns", icon: Target },
       { label: "Influencer Applications", href: "/brand/applications", icon: Target },
      { label: "Analytics", href: "/brand/analytics", icon: BarChart3 },
    ];

    const influencerItems = [
      ...commonItems,
      { label: "Discover Brands", href: "/brand/discover", icon: Target },
      { label: "My Campaigns", href: "/influencer/campaigns", icon: Briefcase },
      { label: "Analytics", href: "/influencer/analytics", icon: BarChart3 },
    ];

    const agencyItems = [
      ...commonItems,
      { label: "Brands", href: "/agency/brands", icon: Briefcase },
      { label: "Influencers", href: "/agency/influencers", icon: Users },
      { label: "Campaigns", href: "/agency/campaigns", icon: Target },
      { label: "Analytics", href: "/agency/analytics", icon: BarChart3 },
    ];

    switch (userRole) {
      case 'influencer':
        return influencerItems;
      case 'brand':
        return brandItems;
      case 'agency':
        return agencyItems;
      default:
        return commonItems;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static min-h-screen top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        {isMobile && (
          <div className="flex justify-end p-4 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <img 
            src="/src/assets/logo.png"
            alt="Amplyst Logo"
            className="w-30 h-8 object-contain"
          />
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {getNavItems().map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => {
                if (isMobile) setSidebarOpen(false);
                navigate(item.href);
              }}
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-0">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="px-4 py-4 flex items-center justify-between">
            {/* Left Side - Mobile Menu + Search */}
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              {/* Search - Hidden on mobile, shown on larger screens */}
              <div className="hidden sm:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  className="pl-10 pr-4 py-2 w-48 lg:w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Search Button */}
              <Button variant="ghost" size="sm" className="sm:hidden">
                <Search className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>

              {/* User Avatar */}
              <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="text-gray-600 hover:text-primary">
                      Sign In
                    </Button>
                  </SignInButton>
                </SignedOut>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;









// import { ReactNode, useEffect, useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { 
//   Bell, 
//   Search, 
//   Settings, 
//   LogOut,
//   Home,
//   Users,
//   Target,
//   BarChart3,
//   MessageSquare,
//   Briefcase,
//   Zap
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
// import { useNavigate } from "react-router-dom";
// import { useQuery } from "convex/react";
// import { api } from "../../../convex/_generated/api";

// interface DashboardLayoutProps {
//   children: ReactNode;
//   userRole?: 'influencer' | 'brand' | 'agency';
//   userName?: string;
//   userAvatar?: string;
// }

// const DashboardLayout = ({ children, userRole: propUserRole, userName = "User", userAvatar }: DashboardLayoutProps) => {
//   const navigate = useNavigate();
//   const userRole = useQuery(api.users.getMyRole) || propUserRole;
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     if (userRole) {
//       switch (userRole) {
//         case 'influencer':
//           navigate('/influencer/dashboard');
//           break;
//         case 'brand':
//           navigate('/brand/dashboard');
//           break;
//         case 'agency':
//           navigate('/agency/dashboard');
//           break;
//         default:
//           navigate('/');
//       }
//     }
//   }, [userRole, navigate]);

//   const getNavItems = () => {
//     const commonItems = [
//       { label: "Dashboard", href: `/${userRole}/dashboard`, icon: Home },
//       { label: "Messages", href: `/${userRole}/messages`, icon: MessageSquare },
//       { label: "Settings", href: `/${userRole}/settings`, icon: Settings },
//     ];

//     switch (userRole) {
//       case 'influencer':
//         return [
//           ...commonItems,
//           { label: "Discover Brands", href: "/influencer/discover", icon: Target },
//           { label: "My Campaigns", href: "/influencer/campaigns", icon: Briefcase },
//           { label: "Analytics", href: "/influencer/analytics", icon: BarChart3 },
//         ];
//       case 'brand':
//         return [
//           ...commonItems,
//           { label: "Discover Influencers", href: "/brand/discover", icon: Users },
//           { label: "Campaigns", href: "/brand/campaigns", icon: Target },
//           { label: "Analytics", href: "/brand/analytics", icon: BarChart3 },
//         ];
//       case 'agency':
//         return [
//           ...commonItems,
//           { label: "Brands", href: "/agency/brands", icon: Briefcase },
//           { label: "Influencers", href: "/agency/influencers", icon: Users },
//           { label: "Campaigns", href: "/agency/campaigns", icon: Target },
//           { label: "Analytics", href: "/agency/analytics", icon: BarChart3 },
//         ];
//       default:
//         return commonItems;
//     }
//   };

//   const getRoleColor = () => {
//     switch (userRole) {
//       case 'influencer':
//         return 'bg-purple-500';
//       case 'brand':
//         return 'bg-blue-500';
//       case 'agency':
//         return 'bg-green-500';
//       default:
//         return 'bg-gray-500';
//     }
//   };

//   const getRoleBadgeColor = () => {
//     switch (userRole) {
//       case 'influencer':
//         return 'bg-purple-100 text-purple-700 border-purple-200';
//       case 'brand':
//         return 'bg-blue-100 text-blue-700 border-blue-200';
//       case 'agency':
//         return 'bg-green-100 text-green-700 border-green-200';
//       default:
//         return 'bg-gray-100 text-gray-700 border-gray-200';
//     }
//   };

//   if (!userRole) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex ">
//       {/* Sidebar */}
//       <motion.aside 
//         className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40"
//         initial={{ x: -264 }}
//         animate={{ x: 0 }}
//         transition={{ duration: 0.3 }}
//       >
//         {/* Logo */}
        // <div className="p-4 border-b border-gray-200">
        //   <img 
        //     src="/src/assets/logo.png"
        //     alt="Amplyst Logo"
        //     className="w-30 h-8 object-contain"
        //   />
        // </div>

//         {/* Navigation Items */}
//         <nav className="p-4 space-y-2">
//           {getNavItems().map((item) => (
//             <Button
//               key={item.label}
//               variant="ghost"
//               className="w-full justify-start"
//               onClick={() => navigate(item.href)}
//             >
//               <item.icon className="w-5 h-5 mr-2" />
//               {item.label}
//             </Button>
//           ))}
//         </nav>


//       </motion.aside>

//       {/* Main Content */}
//       <div className="ml-64">
//         {/* Top Navigation */}
//         <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
//           <div className="container mx-auto px-4 py-4 flex items-center justify-between">
  
//             {/* Right Side */}
//             <div className="flex items-center space-x-2">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                     type="text"
//                     placeholder="Search campaigns, influencers..."
//                     className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//               />
//             </div>
//             <div className="flex items-center space-x-4">
//             <Button variant="ghost" size="sm" className="relative">
//               <Bell className="w-5 h-5" />
//               <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-accent text-white text-xs">
//                   3
//                 </Badge>
//             </Button>
                // <SignedIn>
                //   <UserButton afterSignOutUrl="/" />
                // </SignedIn>
                // <SignedOut>
                //   <SignInButton mode="modal">
                //     <Button variant="ghost" className="text-gray-600 hover:text-primary">
                //       Sign In
                //     </Button>
                //   </SignInButton>
                // </SignedOut>
//             </div>
      

//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="p-6 flex-1 p-2 md:p-6">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             {children}
//           </motion.div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;