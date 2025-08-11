// import { ReactNode, useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
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
//   Menu,
//   X
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";



// // Dashboard Layout Component
// const DashboardLayout = ({ children, userRole = "brand", userName = "Brand Co" }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth >= 768) {
//         setSidebarOpen(false);
//       }
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const getNavItems = () => {
//     const commonItems = [
//       { label: "Dashboard", href: `/${userRole}/dashboard`, icon: Home },
//       { label: "Messages", href: `/${userRole}/messages`, icon: MessageSquare },
//       { label: "Chat", href: `/${userRole}/chat`, icon: MessageSquare },
//       { label: "Settings", href: `/${userRole}/settings`, icon: Settings },
//     ];
// // /brand/applications
//     const brandItems = [
//       ...commonItems,
//       { label: "Discover Influencers", href: "/influencer/discover", icon: Users },
//       { label: "Campaigns", href: "/brand/campaigns", icon: Target },
//        { label: "Influencer Applications", href: "/brand/applications", icon: Target },
//       { label: "Analytics", href: "/brand/analytics", icon: BarChart3 },
//     ];

//     const influencerItems = [
//       ...commonItems,
//       { label: "Discover Brands", href: "/brand/discover", icon: Target },
//       { label: "My Applications", href: "/influencer/campaigns", icon: Briefcase },
//       { label: "Create Content", href: "/createcontent", icon: Briefcase },
//       { label: "Analytics", href: "/influencer/analytics", icon: BarChart3 },
//     ];

//     const agencyItems = [
//       ...commonItems,
//       { label: "Brands", href: "/agency/brands", icon: Briefcase },
//       { label: "Influencers", href: "/agency/influencers", icon: Users },
//       { label: "Campaigns", href: "/agency/campaigns", icon: Target },
//       { label: "Analytics", href: "/agency/analytics", icon: BarChart3 },
//     ];

//     switch (userRole) {
//       case 'influencer':
//         return influencerItems;
//       case 'brand':
//         return brandItems;
//       case 'agency':
//         return agencyItems;
//       default:
//         return commonItems;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Mobile Sidebar Overlay */}
//       {isMobile && sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black/50 z-40 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside className={`
//         fixed md:static min-h-screen top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
//         ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
//       `}>
//         {/* Mobile Close Button */}
//         {isMobile && (
//           <div className="flex justify-end p-4 md:hidden">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setSidebarOpen(false)}
//             >
//               <X className="w-5 h-5" />
//             </Button>
//           </div>
//         )}

//         {/* Logo */}
//         <div className="p-4 border-b border-gray-200">
//           <img 
//             src="/src/assets/logo.png"
//             alt="Amplyst Logo"
//             className="w-30 h-8 object-contain"
//           />
//         </div>

//         {/* Navigation Items */}
//         <nav className="p-4 space-y-2">
//           {getNavItems().map((item) => (
//             <Button
//               key={item.label}
//               variant="ghost"
//               className="w-full justify-start text-left"
//               onClick={() => {
//                 if (isMobile) setSidebarOpen(false);
//                 navigate(item.href);
//               }}
//             >
//               <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
//               <span className="truncate">{item.label}</span>
//             </Button>
//           ))}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 md:ml-0">
//         {/* Top Navigation */}
//         <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
//           <div className="px-4 py-4 flex items-center justify-between">
//             {/* Left Side - Mobile Menu + Search */}
//             <div className="flex items-center space-x-3">
//               {/* Mobile Menu Button */}
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="md:hidden"
//                 onClick={() => setSidebarOpen(true)}
//               >
//                 <Menu className="w-5 h-5" />
//               </Button>

//               <div className="hidden sm:flex relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search campaigns..."
//                   className="pl-10 pr-4 py-2 w-48 lg:w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
//                 />
//               </div>
//             </div>

//             {/* Right Side */}
//             <div className="flex items-center space-x-2 sm:space-x-4">
//               {/* Mobile Search Button */}
//               <Button variant="ghost" size="sm" className="sm:hidden">
//                 <Search className="w-5 h-5" />
//               </Button>

//               <Button variant="ghost" size="sm" className="relative">
//                 <Bell className="w-5 h-5" />
//                 <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
//                   3
//                 </Badge>
//               </Button>

//               {/* User Avatar */}
//               <SignedIn>
//                   <UserButton afterSignOutUrl="/" />
//                 </SignedIn>
//                 <SignedOut>
//                   <SignInButton mode="modal">
//                     <Button variant="ghost" className="text-gray-600 hover:text-primary">
//                       Sign In
//                     </Button>
//                   </SignInButton>
//                 </SignedOut>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="p-3 sm:p-4 lg:p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };
// export default DashboardLayout;




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
  const [screenSize, setScreenSize] = useState('desktop');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
      
      // Auto-close sidebar on screen size change
      if (width >= 1024) {
        setSidebarOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const isMobile = screenSize === 'mobile';
  const isTablet = screenSize === 'tablet';
  const isDesktop = screenSize === 'desktop';

  const getNavItems = () => {
    const commonItems = [
      { label: "Dashboard", href: `/${userRole}/dashboard`, icon: Home },
      { label: "Messages", href: `/${userRole}/messages`, icon: MessageSquare },
      { label: "Settings", href: `/${userRole}/settings`, icon: Settings },
    ];

    const brandItems = [
      ...commonItems.slice(0, 1), // Dashboard
      { label: "Discover Influencers", href: "/brand/discover-influencers", icon: Users },
      { label: "Campaigns", href: "/brand/campaigns", icon: Target },
      { label: "Applications", href: "/brand/applications", icon: Briefcase },
      { label: "Analytics", href: "/brand/analytics", icon: BarChart3 },
      ...commonItems.slice(1), // Messages, Settings
    ];

    const influencerItems = [
      ...commonItems.slice(0, 1), // Dashboard
      { label: "Discover Brands", href: "/influencer/discover-brands", icon: Target },
      { label: "My Applications", href: "/influencer/applications", icon: Briefcase },
      { label: "Create Content", href: "/influencer/create-content", icon: MessageSquare },
      { label: "Analytics", href: "/influencer/analytics", icon: BarChart3 },
      ...commonItems.slice(1), // Messages, Settings
    ];

    const agencyItems = [
      ...commonItems.slice(0, 1), // Dashboard
      { label: "Manage Brands", href: "/agency/brands", icon: Target },
      { label: "Manage Influencers", href: "/agency/influencers", icon: Users },
      { label: "Campaigns", href: "/agency/campaigns", icon: Briefcase },
      { label: "Analytics", href: "/agency/analytics", icon: BarChart3 },
      ...commonItems.slice(1), // Messages, Settings
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

  const getSidebarWidth = () => {
    if (isMobile) return 'w-72'; 
    if (isTablet) return 'w-64';
    return 'w-64'; // Desktop
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile/Tablet Sidebar Overlay */}
      {(isMobile || isTablet) && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobile || isTablet ? 'fixed' : 'static'} 
        flex flex-col min-h-screen top-0 left-0 h-full ${getSidebarWidth()} 
        bg-white border-r border-gray-200 z-50 
        transform transition-all duration-300 ease-in-out
        ${(isMobile || isTablet) ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        ${isDesktop ? 'shadow-none' : 'shadow-xl'}
      `}>
        {/* Mobile/Tablet Close Button */}
        {(isMobile || isTablet) && (
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <div className="font-semibold text-gray-800">Menu</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="p-1"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Logo */}
        <div className={`p-4 ${(isMobile || isTablet) && sidebarOpen ? 'hidden' : 'block'} ${isDesktop ? 'border-b border-gray-200' : ''}`}>
          <img 
            src="/src/assets/logo.png"
            alt="Amplyst Logo"
            className={`object-contain ${isMobile ? 'w-32 h-10' : 'w-30 h-8'}`}
          />
        </div>

        {/* Navigation Items */}
        <nav className={`${isMobile ? 'p-3' : 'p-4'} space-y-1`}>
          {getNavItems().map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`
                w-full justify-start text-left 
                ${isMobile ? 'h-12 text-base px-3' : 'h-10 text-sm px-3'}
                hover:bg-gray-100 transition-colors duration-200
              `}
              onClick={() => {
                if (isMobile || isTablet) setSidebarOpen(false);
                navigate(item.href);
              }}
            >
              <item.icon className={`${isMobile ? 'w-6 h-6 mr-4' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
              <span className="truncate">{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* User Info Section - Mobile Only */}
        {isMobile && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="bg-primary-100 text-primary-700">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {userRole}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className={`${isMobile ? 'px-3 py-3' : isTablet ? 'px-4 py-3' : 'px-6 py-4'} flex items-center justify-between`}>
            {/* Left Side - Mobile Menu + Search */}
            <div className="flex items-center space-x-3">
              {/* Mobile/Tablet Menu Button */}
              {(isMobile || isTablet) && (
                <Button
                  variant="ghost"
                  size={isMobile ? "sm" : "default"}
                  onClick={() => setSidebarOpen(true)}
                  className={`${isMobile ? 'p-2' : 'p-3'}`}
                >
                  <Menu className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                </Button>
              )}

              {/* Desktop Search */}
              {isDesktop && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    className="pl-10 pr-4 py-2 w-64 xl:w-80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
              )}

              {/* Tablet Search */}
              {isTablet && !searchOpen && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-48 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2">
              {/* Mobile Search Toggle */}
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2"
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size={isMobile ? "sm" : "default"}
                className={`relative ${isMobile ? 'p-2' : 'p-3'}`}
              >
                <Bell className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              <div className={`${isMobile ? 'ml-1' : 'ml-2'}`}>
                <SignedIn>
                  <div className="flex items-center space-x-2">
                    {!isMobile && (
                      <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                      </div>
                    )}
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: isMobile ? "w-8 h-8" : "w-10 h-10"
                        }
                      }}
                    />
                  </div>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:text-primary"
                      size={isMobile ? "sm" : "default"}
                    >
                      {isMobile ? "Sign In" : "Sign In"}
                    </Button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar - Expandable */}
          {isMobile && searchOpen && (
            <div className="px-3 pb-3 border-t border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  autoFocus
                />
              </div>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className={`
          ${isMobile ? 'p-3' : isTablet ? 'p-4' : 'p-6 lg:p-8'} 
          min-h-[calc(100vh-4rem)] 
          ${isDesktop ? 'max-w-none' : 'max-w-full'}
        `}>
          <div className={`${isDesktop ? 'max-w-7xl mx-auto' : 'w-full'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;