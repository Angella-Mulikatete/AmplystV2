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
  Lock,
  FileText,
  ArrowLeft,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import React from "react";
import { updateCampaign } from "convex/campaign";


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

type CreateCampaignArgs = {
  role: "influencer" | "brand" | "agency";
  title: string;
  description: string;
  budget?: number;
  status: "draft" | "active" | "completed" | "archived" | "expired";
  targetAudience?: string;
  contentTypes?: string[];
  startDate?: string;
  endDate?: string;
  duration?: string;
  requirements?: string;
};

const steps = [
  { number: 1, title: "Campaign Details", icon: Briefcase },
  { number: 2, title: "Target & Budget", icon: Target },
  { number: 3, title: "Content Requirements", icon: Image },
  { number: 4, title: "Review & Launch", icon: Users }
];

// Campaign status types
const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  LAUNCHED: 'launched',
  PAUSED: 'paused',
  COMPLETED: 'completed'
};

export default function CampaignCreation({ 
  campaignId = null, // Pass null for new campaign, campaign ID for editing
  initialData = null, // Existing campaign data for editing
  mode = 'create', // 'create' or 'edit'
  onSave = (id, data) => Promise.resolve(),
  onCancel = () => {}
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const navigate = useNavigate();
  // Campaign status - determines if editing is allowed
  const [campaignStatus, setCampaignStatus] = useState(
    initialData?.status || CAMPAIGN_STATUS.DRAFT
  );

  const createCampaign = useMutation(api.campaign.createCampaign);
  // Check if campaign can be edited
  const canEditCampaign = !isEditing || (campaignStatus !== CAMPAIGN_STATUS.LAUNCHED && campaignStatus !== CAMPAIGN_STATUS.COMPLETED);
  const updateCampaign = useMutation(api.campaign.updateCampaign); 

  // Check if specific fields can be edited (some fields might be locked even in non-launched campaigns)
  const canEditCriticalFields = campaignStatus === CAMPAIGN_STATUS.DRAFT;

  const [campaignData, setCampaignData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    budget: initialData?.budget || "",
    startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
    endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
    objectives: initialData?.objectives || [],
    targetAudience: {
      ageRange: initialData?.targetAudience?.ageRange || "",
      location: initialData?.targetAudience?.location || "",
      interests: initialData?.targetAudience?.interests || []
    },
    deliverables: initialData?.deliverables || "",
    contentTypes: initialData?.contentTypes || [],
    brandGuidelines: initialData?.brandGuidelines || "",
  });

  // Field handlers
  const handleObjectiveToggle = (objective) => {
    if (!canEditCampaign) return;
    
    setCampaignData(prev => ({
      ...prev,
      objectives: prev.objectives.includes(objective)
        ? prev.objectives.filter(o => o !== objective)
        : [...prev.objectives, objective]
    }));
  };

  const handleContentTypeToggle = (type) => {
    if (!canEditCriticalFields) return;
    
    setCampaignData(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type]
    }));
  };

  // Get status badge variant and text
  const getStatusInfo = (status) => {
    switch (status) {
      case CAMPAIGN_STATUS.DRAFT:
        return { variant: "outline", text: "Draft", color: "text-gray-600" };
      case CAMPAIGN_STATUS.ACTIVE:
        return { variant: "default", text: "Active", color: "text-blue-600" };
      case CAMPAIGN_STATUS.LAUNCHED:
        return { variant: "default", text: "Launched", color: "text-green-600" };
      case CAMPAIGN_STATUS.PAUSED:
        return { variant: "secondary", text: "Paused", color: "text-yellow-600" };
      case CAMPAIGN_STATUS.COMPLETED:
        return { variant: "secondary", text: "Completed", color: "text-gray-600" };
      default:
        return { variant: "outline", text: "Unknown", color: "text-gray-600" };
    }
  };

  // Render read-only field
  const ReadOnlyField = ({ label, value, icon: Icon }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
        <Lock className="w-3 h-3" />
      </Label>
      <div className="px-3 py-2 bg-muted/50 border border-muted rounded-md text-muted-foreground">
        {value || "Not set"}
      </div>
    </div>
  );

  // Step renderers
  const renderStep1 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="space-y-4 sm:space-y-6"
    >
      {/* Status indicator for edit mode */}
      {isEditing && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {canEditCampaign ? (
              <span>You are editing an existing campaign. Some fields may be restricted based on campaign status.</span>
            ) : (
              <span className="text-destructive font-medium">This campaign has been launched and cannot be edited.</span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="campaignName">Campaign Name</Label>
        {canEditCampaign ? (
          <Input
            id="campaignName"
            placeholder="Enter campaign name..."
            value={campaignData.name}
            onChange={e => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1"
            required
          />
        ) : (
          <ReadOnlyField value={campaignData.name} label={undefined} icon={undefined} />
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        {canEditCampaign ? (
          <Textarea
            id="description"
            placeholder="Describe your campaign goals and vision..."
            value={campaignData.description}
            onChange={e => setCampaignData(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1"
            rows={4}
            required
          />
        ) : (
          <ReadOnlyField value={campaignData.description} label={undefined} icon={undefined} />
        )}
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        {canEditCriticalFields ? (
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
              <SelectItem value="beauty">Beauty & Skincare</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="home">Home & Garden</SelectItem>
              <SelectItem value="arts">Arts & Crafts</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="photography">Photography</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <ReadOnlyField value={campaignData.category} icon={Lock} label={undefined} />
        )}
      </div>

      <div>
        <Label>Campaign Objectives</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {objectives.map(objective => (
            <Badge
              key={objective}
              variant={campaignData.objectives.includes(objective) ? "default" : "outline"}
              className={`${canEditCampaign ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} transition-colors ${
                campaignData.objectives.includes(objective) 
                  ? "bg-primary text-white hover:bg-primary/90" 
                  : canEditCampaign ? "hover:bg-gray-50" : ""
              }`}
              onClick={() => handleObjectiveToggle(objective)}
            >
              {objective}
              {!canEditCampaign && campaignData.objectives.includes(objective) && (
                <Lock className="w-3 h-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
        {!canEditCampaign && (
          <p className="text-xs text-muted-foreground mt-1">Campaign objectives cannot be changed after launch</p>
        )}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="space-y-4 sm:space-y-6"
    >
      <div>
        <Label htmlFor="budget">Campaign Budget</Label>
        {canEditCriticalFields ? (
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
        ) : (
          <ReadOnlyField label="" value={`$${campaignData.budget}`} icon={DollarSign} />
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          {canEditCriticalFields ? (
            <Input
              type="date"
              value={campaignData.startDate ? campaignData.startDate.toISOString().split('T')[0] : ''}
              onChange={e => setCampaignData(prev => ({ 
                ...prev, 
                startDate: e.target.value ? new Date(e.target.value) : undefined 
              }))}
              className="mt-1"
            />
          ) : (
            <ReadOnlyField value={campaignData.startDate?.toLocaleDateString()} icon={Calendar} label={undefined} />
          )}
        </div>
        <div>
          <Label>End Date</Label>
          {canEditCriticalFields ? (
            <Input
              type="date"
              value={campaignData.endDate ? campaignData.endDate.toISOString().split('T')[0] : ''}
              onChange={e => setCampaignData(prev => ({ 
                ...prev, 
                endDate: e.target.value ? new Date(e.target.value) : undefined 
              }))}
              className="mt-1"
            />
          ) : (
            <ReadOnlyField value={campaignData.endDate?.toLocaleDateString()} icon={Calendar} label={undefined} />
          )}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <Label htmlFor="ageRange">Target Age Range</Label>
        {canEditCampaign ? (
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
        ) : (
          <ReadOnlyField value={campaignData.targetAudience.ageRange} label={undefined} icon={undefined} />
        )}
      </div>
      
      <div>
        <Label htmlFor="location">Target Location</Label>
        {canEditCampaign ? (
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
        ) : (
          <ReadOnlyField value={campaignData.targetAudience.location} label={undefined} icon={undefined} />
        )}
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="space-y-4 sm:space-y-6"
    >
      <div>
        <Label>Content Types Required</Label>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {contentTypes.map(type => (
            <div
              key={type}
              className={`p-3 sm:p-4 border rounded-lg transition-all hover:shadow-sm ${
                campaignData.contentTypes.includes(type)
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-gray-200"
              } ${
                canEditCriticalFields ? 'cursor-pointer hover:border-gray-300' : 'cursor-not-allowed opacity-60'
              }`}
              onClick={() => handleContentTypeToggle(type)}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {type.includes('Video') ? <Video className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> : 
                 type.includes('Post') || type.includes('Story') ? <Image className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> : 
                 <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
                <span className="text-sm sm:text-base font-medium">{type}</span>
                {!canEditCriticalFields && campaignData.contentTypes.includes(type) && (
                  <Lock className="w-3 h-3 ml-auto" />
                )}
              </div>
            </div>
          ))}
        </div>
        {!canEditCriticalFields && (
          <p className="text-xs text-muted-foreground mt-2">Content types cannot be changed after launch</p>
        )}
      </div>
    </motion.div>
  );

  const renderStep4 = () => {
    const statusInfo = getStatusInfo(campaignStatus);
    
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: -20 }} 
        className="space-y-4 sm:space-y-6"
      >
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg sm:text-xl">Campaign Summary</h3>
            {isEditing && (
              <Badge variant={statusInfo.variant} className={statusInfo.color}>
                {statusInfo.text}
              </Badge>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium text-sm sm:text-base">Name:</span> 
              <span className="text-sm sm:text-base">{campaignData.name || "Not set"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium text-sm sm:text-base">Category:</span> 
              <span className="text-sm sm:text-base capitalize">{campaignData.category || "Not set"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium text-sm sm:text-base">Budget:</span> 
              <span className="text-sm sm:text-base">${campaignData.budget || "Not set"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium text-sm sm:text-base">Duration:</span>
              <span className="text-sm sm:text-base">
                {campaignData.startDate && campaignData.endDate
                  ? `${campaignData.startDate.toLocaleDateString()} - ${campaignData.endDate.toLocaleDateString()}`
                  : "Not set"}
              </span>
            </div>
            <div>
              <span className="font-medium text-sm sm:text-base">Objectives:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {campaignData.objectives.length > 0 ? campaignData.objectives.map(obj => (
                  <Badge key={obj} variant="secondary">{obj}</Badge>
                )) : <span className="text-sm text-gray-500">None selected</span>}
              </div>
            </div>
            <div>
              <span className="font-medium text-sm sm:text-base">Content Types:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {campaignData.contentTypes.length > 0 ? campaignData.contentTypes.map(type => (
                  <Badge key={type} variant="outline">{type}</Badge>
                )) : <span className="text-sm text-gray-500">None selected</span>}
              </div>
            </div>
            <div>
              <span className="font-medium text-sm sm:text-base">Target Audience:</span>
              <div className="text-sm sm:text-base mt-1">
                {campaignData.targetAudience.ageRange && campaignData.targetAudience.location ? (
                  <span>
                    Age: {campaignData.targetAudience.ageRange}, Location: {campaignData.targetAudience.location}
                  </span>
                ) : (
                  <span className="text-gray-500">Not fully configured</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Status-specific alerts */}
        {campaignStatus === CAMPAIGN_STATUS.LAUNCHED ? (
          <Alert className="border-green-200 bg-green-50">
            <Eye className="h-4 w-4" />
            <AlertDescription>
              This campaign has been launched and is visible to influencers. Major changes are not allowed.
            </AlertDescription>
          </Alert>
        ) : campaignStatus === CAMPAIGN_STATUS.ACTIVE ? (
          <Alert className="border-blue-200 bg-blue-50">
            <Target className="h-4 w-4" />
            <AlertDescription>
              This campaign is active. Some critical fields cannot be modified to maintain consistency.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-blue-200 bg-blue-50">
            <Briefcase className="h-4 w-4" />
            <AlertDescription>
              {isEditing ? 
                "You can save changes to update this campaign." : 
                "Your campaign will be saved as draft and visible to influencers once you launch it."
              }
            </AlertDescription>
          </Alert>
        )}
      </motion.div>
    );
  };

  // Submit handler
  const handleSubmit = async () => {

    if (!canEditCampaign) {
      toast({
        title: "Cannot Save",
        description: "This campaign cannot be modified in its current state",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {

      const campaignPayload : CreateCampaignArgs = {
        role: "brand", 
        title: campaignData.name, // Your API expects 'title', component uses 'name'
        description: campaignData.description,
        budget: campaignData.budget ? parseInt(campaignData.budget) : undefined,
        status: campaignStatus,
        targetAudience: `Age: ${campaignData.targetAudience.ageRange}, Location: ${campaignData.targetAudience.location}`, // Convert object to string
        contentTypes: campaignData.contentTypes,
        startDate: campaignData.startDate ? campaignData.startDate.toISOString() : undefined,
        endDate: campaignData.endDate ? campaignData.endDate.toISOString() : undefined,
        requirements: campaignData.deliverables || campaignData.brandGuidelines,

      };

      console.log("Submitting campaign payload:", campaignPayload);


      // if (isEditing) {
      //   await onSave(campaignId, campaignData);
      //   console.log("Campaign updated:", campaignData);
      // } else {
      //   await onSave(null, campaignData);
      //   console.log("Campaign created:", campaignData);
      // }

      if (isEditing && campaignId) {
          // Update existing campaign
          await updateCampaign({
                campaignId,
                ...campaignPayload
        });

        toast({
          title: "Campaign Updated",
          description: `${campaignData.name} has been updated successfully`,
          variant: "success"
          });
      } else {
              // Create new campaign
          const newCampaignId = await createCampaign(campaignPayload);
              
          toast({
                title: "Campaign Created",
                description: `${campaignData.name} has been created successfully`,
                variant: "success"
          });
              
              console.log("New campaign created with ID:", newCampaignId);
            }

           
            await onSave(campaignId, campaignData);
            
            // Navigate back to dashboard
            navigate("/brand/dashboard");
   
      alert(isEditing ? "Campaign updated successfully!" : "Campaign created successfully!");
    } catch (error) {
      console.error("Error saving campaign:", error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} campaign. Please try again.`);
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

  // Validation function
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return campaignData.name && campaignData.description && campaignData.category && campaignData.objectives.length > 0;
      case 2:
        return campaignData.budget && campaignData.startDate && campaignData.endDate && campaignData.targetAudience.ageRange && campaignData.targetAudience.location;
      case 3:
        return campaignData.contentTypes.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/brand/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Button>

          {/* View Mode Toggle for Edit */}
          {isEditing && !canEditCampaign && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <Eye className="w-3 h-3" />
              View Only
            </Badge>
          )}
        </div>

        {/* Title */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            {isEditing ? `Edit Campaign: ${campaignData.name || 'Untitled'}` : 'Create New Campaign'}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {isEditing ? 
              `Modify your campaign details${!canEditCampaign ? ' (View Only)' : ''}` : 
              'Set up your influencer marketing campaign in just a few steps'
            }
          </p>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            {/* Desktop Progress */}
            <div className="hidden lg:flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center gap-3 ${
                    step.number <= currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.number <= currentStep 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm opacity-75">Step {step.number}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-px mx-4 ${
                      step.number < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Mobile/Tablet Progress */}
            <div className="lg:hidden">
              <div className="flex items-center justify-center mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  'bg-primary text-primary-foreground'
                }`}>
                  {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-primary">{steps[currentStep - 1].title}</p>
                  <p className="text-sm text-muted-foreground">Step {currentStep} of {steps.length}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex-1 h-2 rounded-full ${
                      step.number <= currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps.find(s => s.number === currentStep)?.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || loading}
            className="order-2 sm:order-1"
          >
            Previous
          </Button>
          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              disabled={!canProceedToNextStep() || loading}
              className="order-1 sm:order-2"
            >
              Next Step
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !canProceedToNextStep() || !canEditCampaign}
              className="order-1 sm:order-2"
            >
              {loading ? (isEditing ? "Updating..." : "Creating...") : 
               (isEditing ? "Update Campaign" : "Create Campaign")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}




















// const objectives = [
//   "Brand Awareness",
//   "Lead Generation",
//   "Sales Conversion",
//   "Engagement",
//   "Reach",
//   "Website Traffic"
// ];

// const contentTypes = [
//   "Instagram Post",
//   "Instagram Story",
//   "Instagram Reel",
//   "TikTok Video",
//   "YouTube Video",
//   "Blog Post",
//   "Tweet",
//   "LinkedIn Post"
// ];

// const steps = [
//   { number: 1, title: "Campaign Details", icon: Briefcase },
//   { number: 2, title: "Target & Budget", icon: Target },
//   { number: 3, title: "Content Requirements", icon: Image },
//   { number: 4, title: "Review & Launch", icon: Users }
// ];

// export default function CampaignCreation() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const createCampaign = useMutation(api.campaign.createCampaign);
//   const userRole = useQuery(api.users.getMyRole);

//   const [campaignData, setCampaignData] = useState({
//     name: "",
//     description: "",
//     category: "",
//     budget: "",
//     startDate: undefined as Date | undefined,
//     endDate: undefined as Date | undefined,
//     objectives: [] as string[],
//     targetAudience: {
//       ageRange: "",
//       location: "",
//       interests: [] as string[]
//     },
//     deliverables: "",
//     contentTypes: [] as string[],
//     brandGuidelines: "",
//   });

//   // Field handlers
//   const handleObjectiveToggle = (objective: string) => {
//     setCampaignData(prev => ({
//       ...prev,
//       objectives: prev.objectives.includes(objective)
//         ? prev.objectives.filter(o => o !== objective)
//         : [...prev.objectives, objective]
//     }));
//   };

//   const handleContentTypeToggle = (type: string) => {
//     setCampaignData(prev => ({
//       ...prev,
//       contentTypes: prev.contentTypes.includes(type)
//         ? prev.contentTypes.filter(t => t !== type)
//         : [...prev.contentTypes, type]
//     }));
//   };

//   // Step renderers (same as your new UI, but with value bindings)
//   const renderStep1 = () => (
//     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
//       <div>
//         <Label htmlFor="campaignName">Campaign Name</Label>
//         <Input
//           id="campaignName"
//           placeholder="Enter campaign name..."
//           value={campaignData.name}
//           onChange={e => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
//           className="mt-1"
//           required
//         />
//       </div>
//       <div>
//         <Label htmlFor="description">Description</Label>
//         <Textarea
//           id="description"
//           placeholder="Describe your campaign goals and vision..."
//           value={campaignData.description}
//           onChange={e => setCampaignData(prev => ({ ...prev, description: e.target.value }))}
//           className="mt-1"
//           rows={4}
//           required
//         />
//       </div>
//       <div>
//         <Label htmlFor="category">Category</Label>
//         <Select 
//           value={campaignData.category}
//           onValueChange={value => setCampaignData(prev => ({ ...prev, category: value }))}
//         >
//           <SelectTrigger className="mt-1">
//             <SelectValue placeholder="Select campaign category" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="fashion">Fashion & Style</SelectItem>
//             <SelectItem value="tech">Technology</SelectItem>
//             <SelectItem value="lifestyle">Lifestyle</SelectItem>
//             <SelectItem value="fitness">Health & Fitness</SelectItem>
//             <SelectItem value="food">Food & Beverage</SelectItem>
//             <SelectItem value="Beauty & Skincare">Beauty & Skincare</SelectItem>
//             <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
//             <SelectItem value="Gaming">Gaming</SelectItem>
//             <SelectItem value="travel">Travel</SelectItem>
//             <SelectItem value="Education">Education</SelectItem>
//             <SelectItem value="Entertainment">Entertainment</SelectItem>
//             <SelectItem value="Home & Garden">Home & Garden</SelectItem>
//             <SelectItem value="Arts & Crafts">Arts & Crafts</SelectItem>
//             <SelectItem value="Music">Music</SelectItem>
//             <SelectItem value="Photography">Photography</SelectItem>
//             <SelectItem value="Other">Other</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div>
//         <Label>Campaign Objectives</Label>
//         <div className="mt-2 flex flex-wrap gap-2">
//           {objectives.map(objective => (
//             <Badge
//               key={objective}
//               variant={campaignData.objectives.includes(objective) ? "default" : "outline"}
//               className={`cursor-pointer ${campaignData.objectives.includes(objective) ? "bg-primary text-white" : "hover:bg-primary-50"}`}
//               onClick={() => handleObjectiveToggle(objective)}
//             >
//               {objective}
//             </Badge>
//           ))}
//         </div>
//       </div>
//     </motion.div>
//   );

//   const renderStep2 = () => (
//     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
//       <div>
//         <Label htmlFor="budget">Campaign Budget</Label>
//         <div className="relative mt-1">
//           <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <Input
//             id="budget"
//             placeholder="Enter total budget..."
//             value={campaignData.budget}
//             onChange={e => setCampaignData(prev => ({ ...prev, budget: e.target.value }))}
//             className="pl-10"
//             required
//           />
//         </div>
//       </div>
//       <div className="grid md:grid-cols-2 gap-4">
//         <div>
//           <Label>Start Date</Label>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 className="w-full justify-start text-left font-normal mt-1"
//               >
//                 <CalendarIcon className="mr-2 h-4 w-4" />
//                 {campaignData.startDate ? format(campaignData.startDate, "PPP") : "Pick a date"}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0">
//               <Calendar
//                 mode="single"
//                 selected={campaignData.startDate}
//                 onSelect={date => setCampaignData(prev => ({ ...prev, startDate: date }))}
//                 initialFocus
//               />
//             </PopoverContent>
//           </Popover>
//         </div>
//         <div>
//           <Label>End Date</Label>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 className="w-full justify-start text-left font-normal mt-1"
//               >
//                 <CalendarIcon className="mr-2 h-4 w-4" />
//                 {campaignData.endDate ? format(campaignData.endDate, "PPP") : "Pick a date"}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0">
//               <Calendar
//                 mode="single"
//                 selected={campaignData.endDate}
//                 onSelect={date => setCampaignData(prev => ({ ...prev, endDate: date }))}
//                 initialFocus
//               />
//             </PopoverContent>
//           </Popover>
//         </div>
//       </div>
//       <Separator />
//       <div>
//         <Label htmlFor="ageRange">Target Age Range</Label>
//         <Select 
//           value={campaignData.targetAudience.ageRange}
//           onValueChange={value => setCampaignData(prev => ({ 
//             ...prev, 
//             targetAudience: { ...prev.targetAudience, ageRange: value }
//           }))}
//         >
//           <SelectTrigger className="mt-1">
//             <SelectValue placeholder="Select age range" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="18-24">18-24</SelectItem>
//             <SelectItem value="25-34">25-34</SelectItem>
//             <SelectItem value="35-44">35-44</SelectItem>
//             <SelectItem value="45-54">45-54</SelectItem>
//             <SelectItem value="55+">55+</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div>
//         <Label htmlFor="location">Target Location</Label>
//         <Select 
//           value={campaignData.targetAudience.location}
//           onValueChange={value => setCampaignData(prev => ({ 
//             ...prev, 
//             targetAudience: { ...prev.targetAudience, location: value }
//           }))}
//         >
//           <SelectTrigger className="mt-1">
//             <SelectValue placeholder="Select target location" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="ug">Uganda</SelectItem>
//             <SelectItem value="ke">Kenya</SelectItem>
//             <SelectItem value="us">United States</SelectItem>
//             <SelectItem value="uk">United Kingdom</SelectItem>
//             <SelectItem value="ca">Canada</SelectItem>
//             <SelectItem value="au">Australia</SelectItem>
//             <SelectItem value="global">Global</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//     </motion.div>
//   );

//   const renderStep3 = () => (
//     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
//       <div>
//         <Label>Content Types Required</Label>
//         <div className="mt-2 grid grid-cols-2 gap-2">
//           {contentTypes.map(type => (
//             <div
//               key={type}
//               className={`p-3 border rounded-lg cursor-pointer transition-colors ${
//                 campaignData.contentTypes.includes(type)
//                   ? "border-primary bg-primary-50"
//                   : "border-gray-200 hover:border-gray-300"
//               }`}
//               onClick={() => handleContentTypeToggle(type)}
//             >
//               <div className="flex items-center gap-2">
//                 {type.includes('Video') ? <Video className="w-4 h-4" /> : 
//                  type.includes('Post') || type.includes('Story') ? <Image className="w-4 h-4" /> : 
//                  <FileText className="w-4 h-4" />}
//                 <span className="text-sm font-medium">{type}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </motion.div>
//   );

//   const renderStep4 = () => (
//     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
//       <div className="bg-gray-50 rounded-lg p-6">
//         <h3 className="font-semibold text-lg mb-4">Campaign Summary</h3>
//         <div className="space-y-3">
//           <div><span className="font-medium">Name:</span> {campaignData.name}</div>
//           <div><span className="font-medium">Category:</span> {campaignData.category}</div>
//           <div><span className="font-medium">Budget:</span> ${campaignData.budget}</div>
//           <div>
//             <span className="font-medium">Duration:</span> {
//               campaignData.startDate && campaignData.endDate
//                 ? `${format(campaignData.startDate, "MMM dd")} - ${format(campaignData.endDate, "MMM dd, yyyy")}`
//                 : "Not set"
//             }
//           </div>
//           <div>
//             <span className="font-medium">Objectives:</span>
//             <div className="flex flex-wrap gap-1 mt-1">
//               {campaignData.objectives.map(obj => (
//                 <Badge key={obj} variant="secondary">{obj}</Badge>
//               ))}
//             </div>
//           </div>
//           <div>
//             <span className="font-medium">Content Types:</span>
//             <div className="flex flex-wrap gap-1 mt-1">
//               {campaignData.contentTypes.map(type => (
//                 <Badge key={type} variant="outline">{type}</Badge>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//         <h4 className="font-medium text-blue-800 mb-2">Ready to Launch?</h4>
//         <p className="text-blue-700 text-sm">
//           Your campaign will be live and visible to influencers once you launch it. 
//           You can always edit details later from your campaign dashboard.
//         </p>
//       </div>
//     </motion.div>
//   );

//   // Submit handler with Convex logic
//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       await createCampaign({
//         title: campaignData.name,
//         description: campaignData.description,
//         budget: campaignData.budget ? Number(campaignData.budget) : undefined,
//         startDate: campaignData.startDate ? campaignData.startDate.toISOString() : undefined,
//         endDate: campaignData.endDate ? campaignData.endDate.toISOString() : undefined,
//         targetAudience: `${campaignData.targetAudience.ageRange}, ${campaignData.targetAudience.location}, Interests: ${campaignData.targetAudience.interests.join(', ')}`,
//         contentTypes: campaignData.contentTypes,
//         // brandGuidelines: campaignData.brandGuidelines,
//         status: "active",
//         role: "brand"
//       });
//       toast({
//         title: "Success",
//         description: "Campaign created successfully!",
//         variant: "success",
//       });
//       navigate("/brand/dashboard");
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to create campaign. Please try again.",
//         variant: "destructive",
//       });
//       console.error("Error creating campaign:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Render current step
//   const renderCurrentStep = () => {
//     switch (currentStep) {
//       case 1: return renderStep1();
//       case 2: return renderStep2();
//       case 3: return renderStep3();
//       case 4: return renderStep4();
//       default: return renderStep1();
//     }
//   };

//   return (
//     <DashboardLayout 
//       userRole={userRole || "brand"}
//     >
//       <div className="max-w-4xl mx-auto space-y-6">
//         <Button
//             variant="outline"
//             onClick={() => navigate("/brand/dashboard")}
//             className="flex items-center gap-2"
//           >
//           <ArrowLeft className="w-4 h-4" />
//             Back to Dashboard
//         </Button> 
//         <div>
//           <h1 className="text-3xl font-bold text-primary-800">Create New Campaign</h1>
//           <p className="text-gray-600 mt-1">Set up your influencer marketing campaign in just a few steps</p>
//         </div>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               {steps.map((step, index) => (
//                 <div key={step.number} className="flex items-center">
//                   <div className={`flex items-center gap-3 ${
//                     step.number <= currentStep ? 'text-primary' : 'text-gray-400'
//                   }`}>
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                       step.number <= currentStep 
//                         ? 'bg-primary text-white' 
//                         : 'bg-gray-200 text-gray-500'
//                     }`}>
//                       <step.icon className="w-5 h-5" />
//                     </div>
//                     <div className="hidden md:block">
//                       <p className="font-medium">{step.title}</p>
//                       <p className="text-sm opacity-75">Step {step.number}</p>
//                     </div>
//                   </div>
//                   {index < steps.length - 1 && (
//                     <div className={`w-12 h-px mx-4 ${
//                       step.number < currentStep ? 'bg-primary' : 'bg-gray-300'
//                     }`} />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>{steps.find(s => s.number === currentStep)?.title}</CardTitle>
//           </CardHeader>
//           <CardContent className="p-6">
//             {renderCurrentStep()}
//           </CardContent>
//         </Card>

//         <div className="flex justify-between">
//           <Button
//             variant="outline"
//             onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
//             disabled={currentStep === 1 || loading}
//           >
//             Previous
//           </Button>
//           {currentStep < 4 ? (
//             <Button
//               onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
//               className="bg-primary hover:bg-primary-600"
//               disabled={loading}
//             >
//               Next Step
//             </Button>
//           ) : (
//             <Button
//               className="bg-secondary hover:bg-secondary-600"
//               onClick={handleSubmit}
//               disabled={loading}
//             >
//               {loading ? "Launching..." : "Launch Campaign"}
//             </Button>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>

//   );
// }








