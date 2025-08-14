import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  CalendarIcon,
  Target,
  DollarSign,
  Users,
  Briefcase,
  Image,
  Video,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

const objectives = [
  "Brand Awareness",
  "Lead Generation",
  "Sales Conversion",
  "Engagement",
  "Reach",
  "Website Traffic"
];

const contentTypes = [
  "Instagram Post",
  "Instagram Story",
  "Instagram Reel",
  "TikTok Video",
  "YouTube Video",
  "Blog Post",
  "Tweet",
  "LinkedIn Post"
];

const steps = [
  { number: 1, title: "Campaign Details", icon: Briefcase },
  { number: 2, title: "Target & Budget", icon: Target },
  { number: 3, title: "Content Requirements", icon: Image },
  { number: 4, title: "Review & Launch", icon: Users }
];

export default function CampaignCreation() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const createCampaign = useMutation(api.campaign.createCampaign);
  const userRole = useQuery(api.users.getMyRole);

  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    category: "",
    budget: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    objectives: [] as string[],
    targetAudience: {
      ageRange: "",
      location: "",
      interests: [] as string[]
    },
    deliverables: "",
    contentTypes: [] as string[],
    brandGuidelines: "",
  });

  // Field handlers
  const handleObjectiveToggle = (objective: string) => {
    setCampaignData(prev => ({
      ...prev,
      objectives: prev.objectives.includes(objective)
        ? prev.objectives.filter(o => o !== objective)
        : [...prev.objectives, objective]
    }));
  };

  const handleContentTypeToggle = (type: string) => {
    setCampaignData(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type]
    }));
  };

  // Step renderers (same as your new UI, but with value bindings)
  const renderStep1 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div>
        <Label htmlFor="campaignName">Campaign Name</Label>
        <Input
          id="campaignName"
          placeholder="Enter campaign name..."
          value={campaignData.name}
          onChange={e => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your campaign goals and vision..."
          value={campaignData.description}
          onChange={e => setCampaignData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1"
          rows={4}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select 
          value={campaignData.category}
          onValueChange={value => setCampaignData(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select campaign category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fashion">Fashion & Style</SelectItem>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="lifestyle">Lifestyle</SelectItem>
            <SelectItem value="fitness">Health & Fitness</SelectItem>
            <SelectItem value="food">Food & Beverage</SelectItem>
            <SelectItem value="Beauty & Skincare">Beauty & Skincare</SelectItem>
            <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
            <SelectItem value="Gaming">Gaming</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Entertainment">Entertainment</SelectItem>
            <SelectItem value="Home & Garden">Home & Garden</SelectItem>
            <SelectItem value="Arts & Crafts">Arts & Crafts</SelectItem>
            <SelectItem value="Music">Music</SelectItem>
            <SelectItem value="Photography">Photography</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Campaign Objectives</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {objectives.map(objective => (
            <Badge
              key={objective}
              variant={campaignData.objectives.includes(objective) ? "default" : "outline"}
              className={`cursor-pointer ${campaignData.objectives.includes(objective) ? "bg-primary text-white" : "hover:bg-primary-50"}`}
              onClick={() => handleObjectiveToggle(objective)}
            >
              {objective}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div>
        <Label htmlFor="budget">Campaign Budget</Label>
        <div className="relative mt-1">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="budget"
            placeholder="Enter total budget..."
            value={campaignData.budget}
            onChange={e => setCampaignData(prev => ({ ...prev, budget: e.target.value }))}
            className="pl-10"
            required
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal mt-1"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {campaignData.startDate ? format(campaignData.startDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={campaignData.startDate}
                onSelect={date => setCampaignData(prev => ({ ...prev, startDate: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal mt-1"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {campaignData.endDate ? format(campaignData.endDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={campaignData.endDate}
                onSelect={date => setCampaignData(prev => ({ ...prev, endDate: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Separator />
      <div>
        <Label htmlFor="ageRange">Target Age Range</Label>
        <Select 
          value={campaignData.targetAudience.ageRange}
          onValueChange={value => setCampaignData(prev => ({ 
            ...prev, 
            targetAudience: { ...prev.targetAudience, ageRange: value }
          }))}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select age range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="18-24">18-24</SelectItem>
            <SelectItem value="25-34">25-34</SelectItem>
            <SelectItem value="35-44">35-44</SelectItem>
            <SelectItem value="45-54">45-54</SelectItem>
            <SelectItem value="55+">55+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="location">Target Location</Label>
        <Select 
          value={campaignData.targetAudience.location}
          onValueChange={value => setCampaignData(prev => ({ 
            ...prev, 
            targetAudience: { ...prev.targetAudience, location: value }
          }))}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select target location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ug">Uganda</SelectItem>
            <SelectItem value="ke">Kenya</SelectItem>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
            <SelectItem value="au">Australia</SelectItem>
            <SelectItem value="global">Global</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div>
        <Label>Content Types Required</Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {contentTypes.map(type => (
            <div
              key={type}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                campaignData.contentTypes.includes(type)
                  ? "border-primary bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleContentTypeToggle(type)}
            >
              <div className="flex items-center gap-2">
                {type.includes('Video') ? <Video className="w-4 h-4" /> : 
                 type.includes('Post') || type.includes('Story') ? <Image className="w-4 h-4" /> : 
                 <FileText className="w-4 h-4" />}
                <span className="text-sm font-medium">{type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">Campaign Summary</h3>
        <div className="space-y-3">
          <div><span className="font-medium">Name:</span> {campaignData.name}</div>
          <div><span className="font-medium">Category:</span> {campaignData.category}</div>
          <div><span className="font-medium">Budget:</span> ${campaignData.budget}</div>
          <div>
            <span className="font-medium">Duration:</span> {
              campaignData.startDate && campaignData.endDate
                ? `${format(campaignData.startDate, "MMM dd")} - ${format(campaignData.endDate, "MMM dd, yyyy")}`
                : "Not set"
            }
          </div>
          <div>
            <span className="font-medium">Objectives:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {campaignData.objectives.map(obj => (
                <Badge key={obj} variant="secondary">{obj}</Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="font-medium">Content Types:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {campaignData.contentTypes.map(type => (
                <Badge key={type} variant="outline">{type}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Ready to Launch?</h4>
        <p className="text-blue-700 text-sm">
          Your campaign will be live and visible to influencers once you launch it. 
          You can always edit details later from your campaign dashboard.
        </p>
      </div>
    </motion.div>
  );

  // Submit handler with Convex logic
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createCampaign({
        title: campaignData.name,
        description: campaignData.description,
        budget: campaignData.budget ? Number(campaignData.budget) : undefined,
        startDate: campaignData.startDate ? campaignData.startDate.toISOString() : undefined,
        endDate: campaignData.endDate ? campaignData.endDate.toISOString() : undefined,
        targetAudience: `${campaignData.targetAudience.ageRange}, ${campaignData.targetAudience.location}, Interests: ${campaignData.targetAudience.interests.join(', ')}`,
        contentTypes: campaignData.contentTypes,
        // brandGuidelines: campaignData.brandGuidelines,
        status: "active",
        role: "brand"
      });
      toast({
        title: "Success",
        description: "Campaign created successfully!",
        variant: "success",
      });
      navigate("/brand/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <DashboardLayout 
      userRole={userRole || "brand"}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary-800">Create New Campaign</h1>
          <p className="text-gray-600 mt-1">Set up your influencer marketing campaign in just a few steps</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center gap-3 ${
                    step.number <= currentStep ? 'text-primary' : 'text-gray-400'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.number <= currentStep 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div className="hidden md:block">
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm opacity-75">Step {step.number}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-px mx-4 ${
                      step.number < currentStep ? 'bg-primary' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{steps.find(s => s.number === currentStep)?.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || loading}
          >
            Previous
          </Button>
          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              className="bg-primary hover:bg-primary-600"
              disabled={loading}
            >
              Next Step
            </Button>
          ) : (
            <Button
              className="bg-secondary hover:bg-secondary-600"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Launching..." : "Launch Campaign"}
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>

  );
}








