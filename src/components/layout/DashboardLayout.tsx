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
import logo from '@/assets/logo.png'
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";


// Dashboard Layout Component
const DashboardLayout = ({ children, userRole = "brand", userName = "Brand Co", activeTab, onTabChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      { 
        label: "Dashboard", 
        href: `/${userRole}/dashboard`, 
        icon: Home, 
        tabValue: "overview",
        description: "Overview and stats"
      },
      { 
        label: "Messages", 
        href: `/${userRole}/messages`, 
        icon: MessageSquare,
        description: "Chat and communications",
        comingSoon: true
      },
      { 
        label: "Settings", 
        href: `/${userRole}/settings`, 
        icon: Settings,
        description: "Account preferences",
        comingSoon: true
      },
    ];

    const brandItems = [
      ...commonItems.slice(0, 1), // Dashboard
      { 
        label: "Discover Influencers", 
        href: "/brand/discover-influencers", 
        icon: Users,
        description: "Find content creators"
      },
      { 
        label: "Campaigns", 
        href: "/brand/campaigns", 
        icon: Target,
        description: "Manage your campaigns"
      },
      { 
        label: "Applications", 
        href: "/brand/applications", 
        icon: Briefcase,
        description: "Review applications"
      },
      { 
        label: "Analytics", 
        href: "/brand/analytics", 
        icon: BarChart3,
        description: "Performance insights",
        comingSoon: true
      },
      ...commonItems.slice(1), // Messages, Settings
    ];

    const influencerItems = [
      { 
        label: "Dashboard", 
        href: "/influencer/dashboard", 
        icon: Home, 
        tabValue: "overview",
        description: "Overview and stats"
      },
      { 
        label: "Discover Campaigns", 
        href: "/influencer/discover-campaigns", 
        icon: Target, 
        tabValue: "discover",
        description: "Find new opportunities"
      },
      { 
        label: "Discover Brands", 
        href: "/influencer/discover-brands", 
        icon: Users, 
        tabValue: "brands",
        description: "Explore brand partnerships"
      },
      { 
        label: "My Applications", 
        href: "/influencer/applications", 
        icon: Briefcase, 
        tabValue: "applications",
        description: "Track your applications"
      },
      { 
        label: "Messages", 
        href: "/influencer/messages", 
        icon: MessageSquare,
        description: "Chat and communications",
        comingSoon: true
      },
      { 
        label: "Settings", 
        href: "/influencer/settings", 
        icon: Settings,
        description: "Account preferences",
        comingSoon: true
      },
    ];

    const agencyItems = [
      ...commonItems.slice(0, 1), // Dashboard
      { 
        label: "Manage Brands", 
        href: "/agency/brands", 
        icon: Target,
        description: "Brand management"
      },
      { 
        label: "Manage Influencers", 
        href: "/agency/influencers", 
        icon: Users,
        description: "Influencer network"
      },
      { 
        label: "Campaigns", 
        href: "/agency/campaigns", 
        icon: Briefcase,
        description: "Campaign oversight"
      },
      { 
        label: "Analytics", 
        href: "/agency/analytics", 
        icon: BarChart3,
        description: "Performance metrics",
        comingSoon: true
      },
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

  const handleNavClick = (item) => {
    if (isMobile || isTablet) setSidebarOpen(false);
    
    // Check if the feature is coming soon
    if (item.comingSoon) {
      toast({
        title: "Coming Soon! 🚀",
        description: `${item.label} feature is currently in development and will be available soon.`,
        duration: 3000,
      });
      return;
    }
    
    // If the item has a tabValue and onTabChange function is provided, change tab
    if (item.tabValue && onTabChange) {
      onTabChange(item.tabValue);
    } else {
      // Otherwise, navigate to the route
      navigate(item.href);
    }
  };

  const getSidebarWidth = () => {
    if (isMobile) return 'w-80'; 
    if (isTablet) return 'w-72';
    return 'w-72'; // Desktop - increased width for better spacing
  };

  const isActiveTab = (item) => {
    return item.tabValue && activeTab === item.tabValue;
  };

  const getActiveStyles = (item) => {
    const isActive = isActiveTab(item);
    const isHovered = hoveredItem === item.label;
    const isComingSoon = item.comingSoon;
    
    if (isActive) {
      return {
        button: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 border border-primary-400",
        icon: "text-white",
        text: "text-white font-semibold"
      };
    }
    
    if (isComingSoon) {
      return {
        button: "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200/50 opacity-75 cursor-not-allowed",
        icon: "text-amber-500",
        text: "text-amber-700 font-medium"
      };
    }
    
    if (isHovered && !isComingSoon) {
      return {
        button: "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 shadow-md border border-gray-200 transform translate-x-1",
        icon: "text-primary-600",
        text: "text-gray-800 font-medium"
      };
    }
    
    return {
      button: "bg-transparent text-gray-600 hover:bg-gray-50 border border-transparent",
      icon: "text-gray-500",
      text: "text-gray-600"
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Mobile/Tablet Sidebar Overlay */}
      {(isMobile || isTablet) && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobile || isTablet ? 'fixed' : 'static'} 
        flex flex-col min-h-screen top-0 left-0 h-full ${getSidebarWidth()} 
        bg-white/95 backdrop-blur-xl border-r border-gray-200/50 z-50 
        transform transition-all duration-500 ease-out
        ${(isMobile || isTablet) ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        ${isDesktop ? 'shadow-xl shadow-gray-900/5' : 'shadow-2xl shadow-gray-900/20'}
      `}>
        {/* Mobile/Tablet Close Button */}
        {(isMobile || isTablet) && (
          <div className="flex justify-between items-center p-6 border-b border-gray-200/50 bg-gradient-to-r from-primary-50 to-primary-100/50">
            <div className="font-bold text-gray-800 text-lg">Navigation</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-white/50 transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        )}

        {/* Logo */}
        <div className={`p-6 ${(isMobile || isTablet) && sidebarOpen ? 'hidden' : 'block'} ${isDesktop ? 'border-b border-gray-200/30' : ''}`}>
          <img 
            src={logo} 
            alt="Amplyst Logo"
            className={`object-contain ${isMobile ? 'w-36 h-12' : 'w-32 h-10'}`}
          />
        </div>

        {/* Navigation Items */}
        <nav className={`${isMobile ? 'p-4' : 'p-6'} space-y-2 flex-1`}>
          {getNavItems().map((item, index) => {
            const styles = getActiveStyles(item);
            
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Button
                  variant="ghost"
                  className={`
                    w-full justify-start text-left relative overflow-hidden
                    ${isMobile ? 'h-16 text-base px-4 py-4' : 'h-14 text-sm px-4 py-3'}
                    ${styles.button}
                    transition-all duration-300 ease-out
                    rounded-xl group
                  `}
                  onClick={() => handleNavClick(item)}
                  style={{
                    transitionDelay: `${index * 50}ms`
                  }}
                >
                  {/* Background gradient animation */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    ${item.comingSoon ? 'from-amber-400/10 to-orange-400/10' : ''}
                  `} />
                  
                  {/* Icon container */}
                  <div className={`
                    ${isMobile ? 'w-8 h-8 mr-4' : 'w-6 h-6 mr-4'} 
                    flex-shrink-0 flex items-center justify-center
                    relative z-10
                  `}>
                    <item.icon 
                      className={`
                        w-full h-full transition-all duration-300 
                        ${styles.icon}
                        ${hoveredItem === item.label && !item.comingSoon ? 'transform scale-110' : ''}
                        ${isActiveTab(item) ? 'drop-shadow-sm' : ''}
                        ${item.comingSoon ? 'opacity-60' : ''}
                      `} 
                    />
                    {/* Coming Soon Badge */}
                    {item.comingSoon && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                  
                  {/* Text content */}
                  <div className="flex-1 min-w-0 relative z-10">
                    <span className={`
                      block truncate transition-all duration-300
                      ${styles.text}
                      ${isMobile ? 'text-base' : 'text-sm'}
                    `}>
                      {item.label}
                    </span>
                    
                    {/* Description - shown on hover for desktop */}
                    {!isMobile && item.description && (
                      <span className={`
                        block text-xs opacity-0 group-hover:opacity-70 
                        transition-all duration-300 mt-1 truncate
                        ${isActiveTab(item) ? 'text-white/80' : item.comingSoon ? 'text-amber-600/80' : 'text-gray-500'}
                      `}>
                        {item.comingSoon ? `${item.description} - Coming Soon!` : item.description}
                      </span>
                    )}
                    
                    {/* Mobile description */}
                    {isMobile && item.description && (
                      <span className={`
                        block text-xs truncate mt-1
                        ${item.comingSoon ? 'text-amber-500' : 'text-gray-400'}
                      `}>
                        {item.comingSoon ? `${item.description} - Coming Soon!` : item.description}
                      </span>
                    )}
                  </div>

                  {/* Active indicator */}
                  {isActiveTab(item) && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  )}

                  {/* Hover indicator */}
                  <div className={`
                    absolute left-0 top-1/2 transform -translate-y-1/2 w-1 rounded-r-full
                    transition-all duration-300 ease-out
                    ${item.comingSoon ? 'bg-amber-400' : 'bg-primary-500'}
                    ${hoveredItem === item.label && !item.comingSoon ? 'h-8 opacity-100' : 'h-0 opacity-0'}
                  `} />
                </Button>
              </div>
            );
          })}
        </nav>

        {/* User Info Section - Enhanced */}
        <div className="mt-auto p-4 border-t border-gray-200/30 bg-gradient-to-r from-gray-50/50 to-gray-100/30">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 shadow-sm border border-white/50">
            <Avatar className={`${isMobile ? 'w-12 h-12' : 'w-10 h-10'} ring-2 ring-primary-100 shadow-sm`}>
              <AvatarImage src="" alt={userName} />
              <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold">
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className={`${isMobile ? 'text-sm' : 'text-sm'} font-semibold text-gray-900 truncate`}>
                {userName}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-500 capitalize">
                  {userRole}
                </p>
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-600">Online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Navigation - Enhanced */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className={`${isMobile ? 'px-4 py-4' : isTablet ? 'px-6 py-4' : 'px-8 py-5'} flex items-center justify-between`}>
            {/* Left Side - Mobile Menu + Search */}
            <div className="flex items-center space-x-4">
              {/* Mobile/Tablet Menu Button - Enhanced */}
              {(isMobile || isTablet) && (
                <Button
                  variant="ghost"
                  size={isMobile ? "sm" : "default"}
                  onClick={() => setSidebarOpen(true)}
                  className={`
                    ${isMobile ? 'p-3' : 'p-3'} 
                    rounded-xl bg-white/50 hover:bg-white/80 
                    border border-gray-200/50 hover:border-gray-300/50
                    shadow-sm hover:shadow-md transition-all duration-200
                  `}
                >
                  <Menu className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-gray-600`} />
                </Button>
              )}

              {/* Desktop Search - Enhanced */}
              {isDesktop && (
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search campaigns, brands, influencers..."
                    className="pl-12 pr-6 py-3 w-80 xl:w-96 bg-white/50 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 text-sm shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm"
                  />
                </div>
              )}

              {/* Tablet Search - Enhanced */}
              {isTablet && !searchOpen && (
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2.5 w-56 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 text-sm shadow-sm transition-all duration-200"
                  />
                </div>
              )}
            </div>

            {/* Right Side - Enhanced */}
            <div className="flex items-center space-x-3">
              {/* Mobile Search Toggle */}
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-3 rounded-xl bg-white/50 hover:bg-white/80 border border-gray-200/50 shadow-sm"
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </Button>
              )}

              {/* Notifications - Enhanced */}
              <Button 
                variant="ghost" 
                size={isMobile ? "sm" : "default"}
                className={`
                  relative ${isMobile ? 'p-3' : 'p-3'} 
                  rounded-xl bg-white/50 hover:bg-white/80 
                  border border-gray-200/50 hover:border-gray-300/50
                  shadow-sm hover:shadow-md transition-all duration-200
                `}
              >
                <Bell className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-gray-600`} />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white text-xs shadow-lg animate-pulse">
                  3
                </Badge>
              </Button>

              {/* User Menu - Enhanced */}
              <div className={`${isMobile ? 'ml-1' : 'ml-2'}`}>
                <SignedIn>
                  <div className="flex items-center space-x-3">
                    {!isMobile && (
                      <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                      </div>
                    )}
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: `${isMobile ? "w-10 h-10" : "w-11 h-11"} ring-2 ring-primary-100 shadow-md hover:ring-primary-200 transition-all duration-200`
                        }
                      }}
                    />
                  </div>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:text-primary bg-white/50 hover:bg-white/80 border border-gray-200/50 shadow-sm rounded-xl px-6"
                      size={isMobile ? "sm" : "default"}
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar - Enhanced */}
          {isMobile && searchOpen && (
            <div className="px-4 pb-4 border-t border-gray-100/50 bg-gradient-to-r from-gray-50/30 to-gray-100/30">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search campaigns, brands, influencers..."
                  className="w-full pl-12 pr-6 py-4 bg-white/70 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 text-base shadow-sm backdrop-blur-sm"
                  autoFocus
                />
              </div>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className={`
          ${isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8 lg:p-10'} 
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