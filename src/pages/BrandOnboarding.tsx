
// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";

// const BrandOnboarding = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 3;

//   const nextStep = () => {
//     if (currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="mb-8">
//         <Progress value={(currentStep / totalSteps) * 100} className="mb-4" />
//         <p className="text-sm text-gray-600 text-center">
//           Step {currentStep} of {totalSteps}
//         </p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Brand Onboarding</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {currentStep === 1 && (
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Business Information</h3>
//               <p>Step 1 content goes here...</p>
//             </div>
//           )}
          
//           {currentStep === 2 && (
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Campaign Goals</h3>
//               <p>Step 2 content goes here...</p>
//             </div>
//           )}
          
//           {currentStep === 3 && (
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Setup Complete</h3>
//               <p>Step 3 content goes here...</p>
//             </div>
//           )}

//           <div className="flex justify-between mt-8">
//             <Button 
//               variant="outline" 
//               onClick={prevStep} 
//               disabled={currentStep === 1}
//             >
//               Previous
//             </Button>
//             <Button 
//               onClick={nextStep} 
//               disabled={currentStep === totalSteps}
//               className="bg-[#3A7CA5] hover:bg-[#3A7CA5]/90"
//             >
//               {currentStep === totalSteps ? "Complete" : "Next"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default BrandOnboarding;


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";

const industries = [
  "Fashion", "Beauty", "Tech", "Food & Beverage", "Health & Wellness", "Travel", "Other"
];

const campaignGoals = [
  "Brand Awareness", "Product Launch", "Sales/Conversions", "User-Generated Content", "Event Promotion", "Other"
];

const influencerTypes = [
  "Nano (1K–10K)", "Micro (10K–100K)", "Macro (100K+)", "Celebrity"
];

const contentTypes = [
  "Instagram Post", "Instagram Story", "TikTok Video", "YouTube Review", "Blog Post", "Other"
];

const BrandOnboarding = () => { 
    // Fetch brand profile and campaigns
  const brandProfile = useQuery(api.brands.getMyBrandProfile);
  const campaigns = useQuery(api.campaign.listMyCampaigns);
  const influencers = useQuery(api.influencers.listInfluencers);
  const insertBrandProfile = useMutation(api.brands.insertBrandProfile);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    website: "",
    businessEmail: "",
    contactPerson: "",
    location: "",
    description: "",
    campaignGoal: "",
    targetAudience: "",
    influencerType: "",
    influencerNiche: "",
    budgetRange: "",
    contentType: "",
    campaignDescription: "",
    agreeToTerms: false,
  });

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  // You would handle final submission here
 const handleComplete = async () => {
  try {
    await insertBrandProfile({
      companyName: form.companyName,
      industry: form.industry,
      website: form.website,
      businessEmail: form.businessEmail,
      contactPerson: form.contactPerson,
      location: form.location,
      description: form.description,
      campaignGoal: form.campaignGoal,
      targetAudience: form.targetAudience,
      influencerType: form.influencerType,
      influencerNiche: form.influencerNiche,
      budgetRange: form.budgetRange,
      contentType: form.contentType,
      campaignDescription: form.campaignDescription,
    });
    navigate("/brand/dashboard");
  } catch (err) {
    console.error("Failed to save brand profile:", err);
    // Show error to user if needed
  }
};


  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Progress value={(currentStep / totalSteps) * 100} className="mb-4" />
        <p className="text-sm text-gray-600 text-center">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brand Onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Business Information</h3>
              <Input
                placeholder="Brand Name"
                value={form.companyName}
                onChange={e => handleChange("companyName", e.target.value)}
                required
              />
              <Select
                value={form.industry}
                onValueChange={value => handleChange("industry", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(ind => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Website URL"
                value={form.website}
                onChange={e => handleChange("website", e.target.value)}
              />
              <Input
                placeholder="Business Email"
                value={form.businessEmail}
                onChange={e => handleChange("businessEmail", e.target.value)}
                required
              />
              <Input
                placeholder="Contact Person Name"
                value={form.contactPerson}
                onChange={e => handleChange("contactPerson", e.target.value)}
                required
              />
              <Input
                placeholder="Location/Headquarters"
                value={form.location}
                onChange={e => handleChange("location", e.target.value)}
              />
              <Textarea
                placeholder="Brief Company Description"
                value={form.description}
                onChange={e => handleChange("description", e.target.value)}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Campaign Preferences & Goals</h3>
              <Select
                value={form.campaignGoal}
                onValueChange={value => handleChange("campaignGoal", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Primary Campaign Goal" />
                </SelectTrigger>
                <SelectContent>
                  {campaignGoals.map(goal => (
                    <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Target Audience (e.g. 18-30, USA, fashion lovers)"
                value={form.targetAudience}
                onChange={e => handleChange("targetAudience", e.target.value)}
              />
              <Select
                value={form.influencerType}
                onValueChange={value => handleChange("influencerType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Preferred Influencer Type" />
                </SelectTrigger>
                <SelectContent>
                  {influencerTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Preferred Influencer Niche"
                value={form.influencerNiche}
                onChange={e => handleChange("influencerNiche", e.target.value)}
              />
              <Input
                placeholder="Budget Range (e.g. $500–$2000)"
                value={form.budgetRange}
                onChange={e => handleChange("budgetRange", e.target.value)}
              />
              <Select
                value={form.contentType}
                onValueChange={value => handleChange("contentType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Content Types Sought" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Describe a typical campaign or what you expect"
                value={form.campaignDescription}
                onChange={e => handleChange("campaignDescription", e.target.value)}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Setup Complete</h3>
              <p>Review your details and get started!</p>
              <div className="bg-gray-50 p-4 rounded">
                <strong>Brand Name:</strong> {form.companyName} <br />
                <strong>Industry:</strong> {form.industry} <br />
                <strong>Website:</strong> {form.website} <br />
                <strong>Contact:</strong> {form.contactPerson} ({form.businessEmail})<br />
                <strong>Campaign Goal:</strong> {form.campaignGoal} <br />
                <strong>Audience:</strong> {form.targetAudience} <br />
                <strong>Influencer Type:</strong> {form.influencerType} <br />
                <strong>Budget Range:</strong> {form.budgetRange} <br />
                <strong>Content Type:</strong> {form.contentType} <br />
                <strong>Description:</strong> {form.campaignDescription} <br />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  checked={form.agreeToTerms}
                  onCheckedChange={checked => handleChange("agreeToTerms", !!checked)}
                  id="terms"
                  required
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>
                </label>
              </div>
              <p className="mt-4 text-green-700 font-medium">
                You can now create your first campaign or discover influencers!
              </p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            {currentStep < totalSteps ? (
              <Button 
                onClick={nextStep} 
                className="bg-[#3A7CA5] hover:bg-[#3A7CA5]/90"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                disabled={!form.agreeToTerms}
                className="bg-[#3A7CA5] hover:bg-[#3A7CA5]/90"
              >
                Complete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandOnboarding;
