
import { Button } from "@/components/ui/button";
import { Search, Bell, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BrandNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900 font-poppins">Amplyst</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/brand/dashboard")}
              className="text-gray-600 hover:text-primary"
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/brand/discover")}
              className="text-gray-600 hover:text-primary"
            >
              Discover
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-primary"
            >
              Campaigns
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-primary"
            >
              Analytics
            </Button>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BrandNavbar;
