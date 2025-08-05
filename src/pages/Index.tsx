import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, TrendingUp, MessageSquare, CreditCard, Zap, Target, BarChart3, Shield, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { RoleBasedRedirect } from "@/components/roleBasedRedirect";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Onboarding from "@/components/onboarding";
import heroImage from '@/assets/heroImage.jpeg';
import logo from '@/assets/logo.png';
import { useState, useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const stats = useQuery(api.stats.getStats) ?? {
    influencerCount: 0,
    campaignsCount: 0,
    totalPaid: 0
  };

  const brandCount = useQuery(api.brands.countBrands);

  // Testimonials array
  const testimonials = [
    {
      id: 1,
      quote: "Amplyst connected us with the perfect micro-influencers for our sustainable fashion line. The results exceeded our expectations with a 300% increase in sales within just 3 months.",
      name: "Claudia Vine",
      role: "Senior Manager, Social and Influencer Strategy",
      imageSrc: "/src/assets/person.jpg"
    },
    {
      id: 2,
      quote: "As a nano-influencer with 5K followers, I finally found brands that value authentic engagement over follower count. I've earned $2,000 in my first month on the platform!",
      name: "Sarah Johnson",
      role: "Nano-Influencer",
      imageSrc: "/src/assets/person.jpg"
    },
    {
      id: 3,
      quote: "The platform's AI-powered matching system helped us find creators who truly align with our brand values. Our campaign ROI increased by 250% compared to traditional marketing.",
      name: "Michael Chen",
      role: "Marketing Director",
      imageSrc: "/src/assets/person.jpg"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3A7CA5]/5 to-[#88B04B]/5">
      {/* Navigation */}
       <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src={logo}  // or logo.png
              alt="Amplyst Logo"
              className="w-30 h-6 object-contain"  // maintains aspect ratio
            />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">How It Works</a>
            <a href="#success-stories" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">Success Stories</a>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
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
      <section className="w-full bg-white relative overflow-hidden">
        <div className="container mx-auto py-20 px-4 text-center relative z-10">
          {/* Main Content */}
          <div className="max-w-4xl mx-auto relative">
            {/* Social Media Icons Around Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Facebook - Left */}
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">f</span>
              </div>
              
              {/* Instagram - Left */}
              <div className="absolute bottom-4 left-8 w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 via-primary to-orange-400 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              
              {/* YouTube - Right */}
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              
              {/* TikTok - Bottom Right */}
              <div className="absolute bottom-4 right-8 w-12 h-12 rounded-full bg-black flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </div>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight relative z-10">
              Hire Creators & Influencers
              <br />
              <span className="relative">
                To Promote Your Brand
                <svg className="absolute -top-2 -right-8 w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                </svg>
              </span>
            </h1>
            
            {/* Descriptive Text */}
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed relative z-10">
              Social media networks are open to all. Social media is typically used for social interaction and access to news and information, and decision making.
            </p>
            
            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 relative z-10">
              <Button size="lg" className="bg-primary hover:bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-semibold" onClick={() => navigate("/register?role=influencer")}>
                Join as Creator
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary-50 px-8 py-4 rounded-full text-lg font-semibold" onClick={() => navigate("/register?role=brand")}>
                Find Influencers
              </Button>
            </div>
            

          </div>
        </div>
        
        {/* Decorative Blob */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20 transform translate-x-32 translate-y-32"></div>
      </section>

      {/* Influencer Section */}
      <section className="w-full bg-gradient-to-br from-pink-50 to-orange-50 relative overflow-hidden">
        <div className="container mx-auto py-20 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Section - Text Content */}
            <div className="text-left">
              <p className="text-xl lg:text-2xl text-gray-800 font-medium" style={{ lineHeight: '1.6em' }}>
                Sure, we do discovery, campaign management, influencer collaboration and reporting. But we also provide the largest global influencer data set, one-of-a-kind market benchmarking, and a team of experts — to help you make smarter investments.
              </p>
            </div>
            
            {/* Right Section - Single Image */}
            <div className="relative">
              <img
                src="/src/assets/influencer.jpg"
                alt="Influencer profile"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-200 rounded-full opacity-30"></div>
          <div className="absolute top-1/4 right-1/3 w-16 h-16 bg-blue-200 rounded-full opacity-40"></div>
          <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-yellow-200 rounded-full opacity-30"></div>
        </div>
      </section>

             {/* How It Works Section */}
      <section id="how-it-works" className="w-full bg-white relative">
        <div className="container mx-auto py-20 px-4">
          {/* Top Section - Centered Text */}
          <div className="text-center mb-16">
                            <div className="text-sm font-semibold text-primary mb-4">
              MARKETING'S IMPERATIVE
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Make Creator Strategy a Marketing Pillar
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Influencer marketing is no longer a test—it's a strategic necessity.
            </p>
          </div>
          
                     {/* Offset Layout - Video Left, Content Right */}
           <div className="relative flex items-start">
             {/* Video - Sticky on Left */}
             <div className="sticky top-20 w-1/2 pr-8">
               <div className="relative">
                 <video 
                   className="w-full h-auto rounded-lg shadow-lg bg-transparent"
                   autoPlay 
                   muted 
                   loop 
                   playsInline
                 >
                   <source src="/src/assets/how-it-works.webm" type="video/webm" />
                   Your browser does not support the video tag.
                 </video>
               </div>
             </div>
             
             {/* Content Blocks - Scrollable on Right */}
             <div className="w-1/2 pl-8 space-y-16" id="how-it-works-content">
               {/* Content Block 1 */}
               <div className="min-h-[150px]">
                 <h3 className="text-2xl font-bold text-primary mb-4">
                   The Social Singularity is Here
                 </h3>
                 <p className="text-lg text-gray-700 leading-relaxed">
                   Social platforms have overtaken TV in audience size—flipping the marketing landscape forever.
                 </p>
               </div>
               
               {/* Content Block 2 */}
               <div className="min-h-[150px]">
                 <h3 className="text-2xl font-bold text-primary mb-4">
                   Creator Economy Revolution
                 </h3>
                 <p className="text-lg text-gray-700 leading-relaxed">
                   The creator economy is now worth over $100 billion, with creators becoming the new media companies and distribution channels.
                 </p>
               </div>
               
               {/* Content Block 3 */}
               <div className="min-h-[150px]">
                 <h3 className="text-2xl font-bold text-primary mb-4">
                   Authentic Connections Drive Results
                 </h3>
                 <p className="text-lg text-gray-700 leading-relaxed">
                   Consumers trust creators more than traditional advertising. Authentic partnerships deliver 3x higher engagement rates.
                 </p>
               </div>
             </div>
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

      {/* Success Stories Section */}
      <section id="success-stories" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              Real stories from brands and creators who found success with Amplyst
            </p>
          </div>
          
          {/* Success Story Carousel */}
          <div className="max-w-6xl mx-auto relative">
            {/* Testimonial Card with Split Background */}
            <div className="relative overflow-hidden shadow-lg">
              {/* Split Background */}
              <div className="absolute inset-0">
                <div className="w-1/3 h-full bg-gray-100"></div>
                <div className="absolute right-0 top-0 w-2/3 h-full bg-blue-100"></div>
              </div>
              
              {/* Content */}
              <div className="relative grid grid-cols-1 lg:grid-cols-3 min-h-[300px]">
                {/* Left Side - Full Image */}
                <div className="bg-gray-100 flex items-center justify-center p-0">
                  <img 
                    src={testimonials[currentTestimonial].imageSrc}
                    alt={testimonials[currentTestimonial].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Right Side - Testimonial Text */}
                <div className="bg-blue-100 p-8 flex flex-col justify-center lg:col-span-2">
                  <div className="text-left">
                    {/* Quote */}
                    <div className="mb-6">
                      <p className="text-xl text-blue-900 leading-relaxed font-medium">
                        "{testimonials[currentTestimonial].quote}"
                      </p>
                    </div>
                    
                    {/* Attribution */}
                    <div className="mb-4">
                      <div className="font-semibold text-blue-900 text-lg">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-blue-700 text-sm">
                        {testimonials[currentTestimonial].role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            

            

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center">
            {/* Brand Title */}
            <h2 className="text-3xl font-bold text-black mb-4">
              Amplyst
            </h2>
            
            {/* Description */}
            <p className="text-gray-700 mb-8 leading-relaxed max-w-2xl">
            Amplyst connects nano and micro-influencers with small brands<br />
            for authentic partnerships that drive results.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex justify-center space-x-4">
              {/* Facebook */}
              <div className="w-10 h-10 border border-black rounded-lg bg-white flex items-center justify-center shadow-[6px_6px_0_#A2FDE9] hover:bg-black hover:text-white transition-all duration-200">
                <span className="text-teal-600 font-bold text-lg hover:text-white">f</span>
              </div>
              
              {/* Twitter */}
              <div className="w-10 h-10 border border-black rounded-lg bg-white flex items-center justify-center shadow-[6px_6px_0_#A2FDE9] hover:bg-black hover:text-white transition-all duration-200">
                <svg className="w-5 h-5 text-teal-600 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>
              
              {/* Instagram */}
              <div className="w-10 h-10 border border-black rounded-lg bg-white flex items-center justify-center shadow-[6px_6px_0_#A2FDE9] hover:bg-black hover:text-white transition-all duration-200">
                <svg className="w-5 h-5 text-teal-600 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              
              {/* LinkedIn */}
              <div className="w-10 h-10 border border-black rounded-lg bg-white flex items-center justify-center shadow-[6px_6px_0_#A2FDE9] hover:bg-black hover:text-white transition-all duration-200">
                <svg className="w-5 h-5 text-teal-600 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Copyright */}
      <div className="bg-gray-100 py-4 text-center">
        <p className="text-gray-600 text-sm">
          © 2025 Amplyst. Revolutionizing influencer marketing with AI.
        </p>
      </div>
    </div>
  );
};

export default Index;












