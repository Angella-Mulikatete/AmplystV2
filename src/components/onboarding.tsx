
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import InfluencerOnboarding from "../pages/InfluencerOnboarding";
import BrandOnboarding from "../pages/BrandOnboarding";

const Onboarding = () => {
  const [selectedRole, setSelectedRole] = useState<'influencer' | 'brand' | 'agency' | null>(null);

  if (selectedRole === 'influencer') {
    return <InfluencerOnboarding />;
  }

  if (selectedRole === 'brand' || selectedRole === 'agency') {
    return <BrandOnboarding userType={selectedRole} />;
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="outline" className="mb-4 bg-accent-50 text-accent-700 border-accent-200">
            Welcome to Amplyst
          </Badge>
          <h1 className="text-4xl font-bold text-primary-800 mb-4">
            Let's get you started
          </h1>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Choose your role to customize your Amplyst experience and unlock the right tools for your success.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <Card 
              className="h-full border-2 hover:border-primary-300 transition-colors cursor-pointer group hover:shadow-lg"
              onClick={() => setSelectedRole('influencer')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <CardTitle className="text-primary-800">I'm an Influencer</CardTitle>
                <CardDescription>
                  Connect with brands and manage your campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-primary hover:bg-primary-600">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
            <Card 
              className="h-full border-2 hover:border-secondary-300 transition-colors cursor-pointer group hover:shadow-lg"
              onClick={() => setSelectedRole('brand')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary-200 transition-colors">
                  <Target className="w-8 h-8 text-secondary-600" />
                </div>
                <CardTitle className="text-primary-800">I'm a Brand</CardTitle>
                <CardDescription>
                  Find influencers and launch successful campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-secondary hover:bg-secondary-600">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
            <Card 
              className="h-full border-2 hover:border-accent-300 transition-colors cursor-pointer group hover:shadow-lg"
              onClick={() => setSelectedRole('agency')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-200 transition-colors">
                  <Building2 className="w-8 h-8 text-accent-600" />
                </div>
                <CardTitle className="text-primary-800">I'm an Agency</CardTitle>
                <CardDescription>
                  Manage multiple clients and campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-accent hover:bg-accent-600">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
