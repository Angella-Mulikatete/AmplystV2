import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Header = () => {
  return (
    <div>
       <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img 
                    src="/src/assets/logo.png"  // or logo.png
                    alt="Amplyst Logo"
                    className="w-30 h-8 object-contain"  // maintains aspect ratio
                  />
                </div>
                <div className="hidden md:flex items-center space-x-8">
                  <a href="#features" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">Features</a>
                  <a href="#how-it-works" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">How It Works</a>
                  <a href="#success-stories" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">Success Stories</a>
                </div>
                <div className="flex items-center space-x-4">
                  <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </div>
            </div>
      </nav>
    </div>
  )
}

export default Header
