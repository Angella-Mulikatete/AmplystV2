import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, Upload, Building, Target, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Checkbox } from "@/components/ui/checkbox";

interface BrandOnboardingProps {
  userType: 'brand' | 'agency';
}

// Constants for dropdown options
const industries = [
  "Beauty & Skincare", "Fashion & Style", "Fitness & Health", "Food & Cooking",
  "Travel", "Technology", "Lifestyle", "Gaming", "Education", "Entertainment",
  "Business", "Parenting", "Home & Garden", "Arts & Crafts", "Music", "Sports",
  "Photography", "Other"
];

const campaignGoals = [
  "Brand Awareness", "Product Launch", "Sales/Conversions", 
  "User-Generated Content", "Event Promotion", "Other"
];

const influencerTypes = [
  "Nano (1K–10K)", "Micro (10K–100K)", "Macro (100K+)", "Celebrity"
];

const contentTypes = [
  "Instagram Post", "Instagram Story", "TikTok Video", 
  "YouTube Review", "Blog Post", "Other"
];

const BrandOnboarding = ({ userType }: BrandOnboardingProps) => {
  const insertBrandProfile = useMutation(api.brands.insertBrandProfile);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 4;

  // Form state with all required fields
  const [formData, setFormData] = useState({
    // Brand Profile Fields
    companyName: "",
    industry: "",
    website: "",
    businessEmail: "",
    contactPerson: "",
    location: "",
    description: "",
    companySize: "",
    
    // Campaign Preferences
    campaignGoal: "",
    targetAudience: "",
    influencerType: "",
    influencerNiche: "",
    budgetRange: "",
    contentType: "",
    campaignDescription: "",
    campaignGoals: [] as string[],
    preferredNiches: [] as string[],
    
    // Legal
    agreeToTerms: false,
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string | string[] | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    return newArray;
  };

  const handleComplete = async () => {
    try {
      await insertBrandProfile({
        companyName: formData.companyName,
        industry: formData.industry,
        website: formData.website,
        businessEmail: formData.businessEmail,
        contactPerson: formData.contactPerson,
        location: formData.location,
        description: formData.description,
        companySize: formData.companySize,
        targetAudience: formData.targetAudience,
        influencerType: formData.influencerType,
        influencerNiche: formData.influencerNiche,
        budgetRange: formData.budgetRange,
        contentType: formData.contentType,
        campaignDescription: formData.campaignDescription,
        campaignGoal: formData.campaignGoal,
        campaignCount: 0,
        activeCampaigns: [],
        totalBudget: 0,
        influencerCollaborations: []
      });
      navigate('/brand/dashboard');
    } catch (err) {
      console.error("Failed to save brand profile:", err);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-2">Company Information</h2>
              <p className="text-primary-600">Tell us about your {userType === 'brand' ? 'company' : 'agency'}.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">{userType === 'brand' ? 'Company' : 'Agency'} Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  placeholder={`Enter your ${userType} name`}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select 
                    onValueChange={(value) => updateFormData('industry', value)}
                    value={formData.industry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select 
                    onValueChange={(value) => updateFormData('companySize', value)}
                    value={formData.companySize}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  placeholder="https://www.yourcompany.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <textarea
                  id="description"
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Brief description of your company..."
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-2">Contact Information</h2>
              <p className="text-primary-600">Primary contact details for campaign management.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Name</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => updateFormData('contactPerson', e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessEmail">Email Address</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => updateFormData('businessEmail', e.target.value)}
                  placeholder="contact@company.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-2">
              <Label>Company Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload your company logo</p>
                <Button variant="outline" className="mt-2">Choose File</Button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-2">Campaign Preferences</h2>
              <p className="text-primary-600">Help us understand your campaign goals and preferences.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Monthly Campaign Budget</Label>
                <Select 
                  onValueChange={(value) => updateFormData('budgetRange', value)}
                  value={formData.budgetRange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1k-5k">$1K - $5K</SelectItem>
                    <SelectItem value="5k-10k">$5K - $10K</SelectItem>
                    <SelectItem value="10k-25k">$10K - $25K</SelectItem>
                    <SelectItem value="25k-50k">$25K - $50K</SelectItem>
                    <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                    <SelectItem value="100k+">$100K+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Primary Campaign Goals</Label>
                <div className="grid grid-cols-2 gap-2">
                  {campaignGoals.map((goal) => (
                    <Button
                      key={goal}
                      variant={formData.campaignGoals.includes(goal) ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFormData('campaignGoals', toggleArrayItem(formData.campaignGoals, goal))}
                      className="justify-start"
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <textarea
                  id="targetAudience"
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
                  value={formData.targetAudience}
                  onChange={(e) => updateFormData('targetAudience', e.target.value)}
                  placeholder="Describe your target audience demographics and interests..."
                />
              </div>
              <div className="space-y-2">
                <Label>Influencer Type</Label>
                <Select 
                  onValueChange={(value) => updateFormData('influencerType', value)}
                  value={formData.influencerType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select influencer type" />
                  </SelectTrigger>
                  <SelectContent>
                    {influencerTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select 
                  onValueChange={(value) => updateFormData('contentType', value)}
                  value={formData.contentType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-2">Review & Complete</h2>
              <p className="text-primary-600">Review your information before submitting.</p>
            </div>
            <Card className="bg-secondary-50 border-secondary-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Company Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Company Name</p>
                        <p className="font-medium">{formData.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Industry</p>
                        <p className="font-medium">{formData.industry}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Company Size</p>
                        <p className="font-medium">{formData.companySize}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Website</p>
                        <p className="font-medium">{formData.website || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Contact Person</p>
                        <p className="font-medium">{formData.contactPerson}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{formData.businessEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{formData.location || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Campaign Preferences</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Budget Range</p>
                        <p className="font-medium">{formData.budgetRange}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Campaign Goals</p>
                        <p className="font-medium">{formData.campaignGoals.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Influencer Type</p>
                        <p className="font-medium">{formData.influencerType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Content Type</p>
                        <p className="font-medium">{formData.contentType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => updateFormData('agreeToTerms', checked)}
              />
              <label htmlFor="terms" className="text-sm">
                I agree to the <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-accent-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="bg-secondary-100 text-secondary-700">
              {userType === 'brand' ? 'Brand' : 'Agency'} Setup
            </Badge>
            <span className="text-sm text-primary-600">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-secondary h-2 rounded-full"
              initial={{ width: "25%" }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="bg-secondary hover:bg-secondary-600"
                disabled={currentStep === totalSteps && !formData.agreeToTerms}
              >
                {currentStep === totalSteps ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Complete Setup
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandOnboarding;





// 'use client'
// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "../../convex/_generated/api";
// import { useNavigate } from "react-router-dom";

// const industries = [
//   "Beauty & Skincare",
//   "Fashion & Style",
//   "Fitness & Health",
//   "Food & Cooking",
//   "Travel",
//   "Technology",
//   "Lifestyle",
//   "Gaming",
//   "Education",
//   "Entertainment",
//   "Business",
//   "Parenting",
//   "Home & Garden",
//   "Arts & Crafts",
//   "Music",
//   "Sports",
//   "Photography",
//   "Other"
// ];

// const campaignGoals = [
//   "Brand Awareness", "Product Launch", "Sales/Conversions", "User-Generated Content", "Event Promotion", "Other"
// ];

// const influencerTypes = [
//   "Nano (1K–10K)", "Micro (10K–100K)", "Macro (100K+)", "Celebrity"
// ];

// const contentTypes = [
//   "Instagram Post", "Instagram Story", "TikTok Video", "YouTube Review", "Blog Post", "Other"
// ];

// const BrandOnboarding = () => { 
//   const insertBrandProfile = useMutation(api.brands.insertBrandProfile);
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 3;

//   const [form, setForm] = useState({
//     // Brand Profile Fields
//     companyName: "",
//     industry: "",
//     website: "",
//     businessEmail: "",
//     contactPerson: "",
//     location: "",
//     description: "",
    
//     // Campaign Preferences
//     campaignGoal: "",
//     targetAudience: "",
//     influencerType: "",
//     influencerNiche: "",
//     budgetRange: "",
//     contentType: "",
//     campaignDescription: "",
    
//     // Legal
//     agreeToTerms: false,
//   });

//   // Add fields required by dashboard analytics
//   const handleComplete = async () => {
//     try {
//       await insertBrandProfile({
//         companyName: form.companyName,
//         industry: form.industry,
//         website: form.website,
//         businessEmail: form.businessEmail,
//         contactPerson: form.contactPerson,
//         location: form.location,
//         description: form.description,
//         campaignGoal: form.campaignGoal,
//         targetAudience: form.targetAudience,
//         influencerType: form.influencerType,
//         influencerNiche: form.influencerNiche,
//         budgetRange: form.budgetRange,
//         contentType: form.contentType,
//         campaignDescription: form.campaignDescription,
//         campaignCount: 0,
//         activeCampaigns: [],
//         totalBudget: 0,
//         influencerCollaborations: []
//       });
//       navigate("/brand/dashboard");
//     } catch (err) {
//       console.error("Failed to save brand profile:", err);
//     }
//   };

//   // Existing form steps with enhanced validation
//   return (
//     <div className="max-w-2xl mx-auto">
//       {/* Progress indicator */}
//       <div className="mb-8">
//         <Progress value={(currentStep / totalSteps) * 100} />
//         <p className="text-sm text-muted-foreground text-center mt-2">
//           Step {currentStep} of {totalSteps}
//         </p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold">Brand Setup</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {/* Step 1: Core Brand Information */}
//           {currentStep === 1 && (
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold mb-4">Business Information</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Company Name</label>
//                   <Input
//                     type="text"
//                     value={form.companyName}
//                     onChange={(e) => setForm({ ...form, companyName: e.target.value })}
//                     placeholder="Your company name"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Industry</label>
//                   <Select value={form.industry} onValueChange={(value) => setForm({ ...form, industry: value })}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select industry" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {industries.map((industry) => (
//                         <SelectItem key={industry} value={industry}>
//                           {industry}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Website</label>
//                   <Input
//                     type="url"
//                     value={form.website}
//                     onChange={(e) => setForm({ ...form, website: e.target.value })}
//                     placeholder="https://yourcompany.com"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Business Email</label>
//                   <Input
//                     type="email"
//                     value={form.businessEmail}
//                     onChange={(e) => setForm({ ...form, businessEmail: e.target.value })}
//                     placeholder="contact@yourcompany.com"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Contact Person</label>
//                   <Input
//                     type="text"
//                     value={form.contactPerson}
//                     onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
//                     placeholder="Full name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Location</label>
//                   <Input
//                     type="text"
//                     value={form.location}
//                     onChange={(e) => setForm({ ...form, location: e.target.value })}
//                     placeholder="City, Country"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Description</label>
//                   <Textarea
//                     value={form.description}
//                     onChange={(e) => setForm({ ...form, description: e.target.value })}
//                     placeholder="Tell us about your brand..."
//                     rows={4}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Campaign Preferences */}
//           {currentStep === 2 && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Campaign Goal</label>
//                 <Select value={form.campaignGoal} onValueChange={(value) => setForm({ ...form, campaignGoal: value })}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select campaign goal" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {campaignGoals.map((goal) => (
//                       <SelectItem key={goal} value={goal}>
//                         {goal}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Target Audience</label>
//                 <Input
//                   type="text"
//                   value={form.targetAudience}
//                   onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
//                   placeholder="Describe your target audience"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Influencer Type</label>
//                 <Select value={form.influencerType} onValueChange={(value) => setForm({ ...form, influencerType: value })}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select influencer type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {influencerTypes.map((type) => (
//                       <SelectItem key={type} value={type}>
//                         {type}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Influencer Niche</label>
//                 <Input
//                   type="text"
//                   value={form.influencerNiche}
//                   onChange={(e) => setForm({ ...form, influencerNiche: e.target.value })}
//                   placeholder="e.g., Fashion, Tech, Lifestyle"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Budget Range</label>
//                 <Input
//                   type="text"
//                   value={form.budgetRange}
//                   onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
//                   placeholder="e.g., $1,000 - $5,000"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Content Type</label>
//                 <Select value={form.contentType} onValueChange={(value) => setForm({ ...form, contentType: value })}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select content type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {contentTypes.map((type) => (
//                       <SelectItem key={type} value={type}>
//                         {type}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Campaign Description</label>
//                 <Textarea
//                   value={form.campaignDescription}
//                   onChange={(e) => setForm({ ...form, campaignDescription: e.target.value })}
//                   placeholder="Describe your campaign goals and requirements..."
//                   rows={4}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Step 3: Review & Complete */}
//           {currentStep === 3 && (
//             <div className="space-y-4">
//               <div className="bg-muted p-4 rounded-lg">
//                 <h4 className="font-semibold mb-2">Brand Summary</h4>
//                 {/* Display all collected fields */}
//                 <p><strong>Company:</strong> {form.companyName}</p>
//                 <p><strong>Industry:</strong> {form.industry}</p>
//                 {/* Add other review fields */}
//               </div>
//               <div className="flex items-center space-x-2 mt-2">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="terms"
//                     checked={form.agreeToTerms}
//                     onCheckedChange={(checked) => setForm({...form, agreeToTerms: !!checked})}
//                   />
//                   <label htmlFor="terms" className="text-sm">
//                     I agree to the <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>
//                   </label>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Navigation Controls */}
//           <div className="flex justify-between mt-8">
//             <Button 
//               variant="outline" 
//               onClick={() => setCurrentStep(currentStep - 1)}
//               disabled={currentStep === 1}
//             >
//               Back
//             </Button>
//             {currentStep < totalSteps ? (
//               <Button onClick={() => setCurrentStep(currentStep + 1)}>
//                 Continue
//               </Button>
//             ) : (
//               <Button 
//                 onClick={handleComplete}
//                 disabled={!form.agreeToTerms}
//               >
//                 Complete Setup
//               </Button>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default BrandOnboarding;
