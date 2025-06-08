import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import type { FunctionArgs } from "convex/server"; // Import FunctionArgs

// Define the type for the arguments expected by the Convex mutation
type CreateCampaignMutationArgs = FunctionArgs<typeof api.campaign.createCampaign>;

// Define the shape of the form data, which is slightly different from the mutation args
interface CampaignFormData {
  title: string;
  description: string;
  budget: string; // Stored as string in the form input
  targetAudience: string;
  contentTypes: string[];
  duration: string;
  startDate: string; // Corrected to startDate
  endDate: string;   // Corrected to endDate
  status: CreateCampaignMutationArgs["status"]; // Use the literal type from mutation args
  role: CreateCampaignMutationArgs["role"]; // Use the literal type from mutation args
}

const contentTypeOptions = [
  { value: "image", label: "Image Post" },
  { value: "video", label: "Video Content" },
  { value: "story", label: "Story/Reel" }
];

export default function CampaignCreation() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CampaignFormData>({
    title: "",
    description: "",
    budget: "",
    targetAudience: "",
    contentTypes: [],
    duration: "",
    startDate: "", // Corrected to startDate
    endDate: "",   // Corrected to endDate
    status: "active", // This should now correctly be "active"
    role: "brand" // This should now correctly be "brand"
  });
  const [loading, setLoading] = useState(false);
  const createCampaign = useMutation(api.campaign.createCampaign);
  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  // The field parameter should be a key of CampaignFormData
  const handleChange = (field: keyof CampaignFormData, value: string | string[]) => {
    // Special handling for contentTypes if it's an array
    if (field === "contentTypes") {
      setForm(f => ({ ...f, [field]: value as string[] }));
    } else {
      setForm(f => ({ ...f, [field]: value as string }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data for Convex mutation, converting types as needed
    const campaignData: CreateCampaignMutationArgs = {
      title: form.title,
      description: form.description,
      budget: form.budget ? Number(form.budget) : undefined,
      targetAudience: form.targetAudience || undefined,
      contentTypes: form.contentTypes.length > 0 ? form.contentTypes : undefined,
      duration: form.duration || undefined,
      startDate: form.startDate || undefined, // Corrected to startDate
      endDate: form.endDate || undefined,     // Corrected to endDate
      status: form.status,
      role: form.role,
    };

    await createCampaign(campaignData);
    setLoading(false);
    navigate("/brand/dashboard");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Create a New Campaign</h2>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            <Input
              placeholder="Campaign Title"
              value={form.title}
              onChange={e => handleChange("title", e.target.value)}
              required
            />
            <Textarea
              placeholder="Describe your campaign goals and requirements"
              value={form.description}
              onChange={e => handleChange("description", e.target.value)}
              required
            />
            <Button type="button" onClick={handleNext} className="w-full">
              Next
            </Button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <Input
              placeholder="Target Audience (e.g., 18-25, USA, fashion lovers)"
              value={form.targetAudience}
              onChange={e => handleChange("targetAudience", e.target.value)}
            />
            <div>
              <label className="block mb-2 font-medium">Content Types</label>
              <div className="flex gap-2">
                {contentTypeOptions.map(opt => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={form.contentTypes.includes(opt.value) ? "default" : "outline"}
                    onClick={() =>
                      handleChange(
                        "contentTypes",
                        form.contentTypes.includes(opt.value)
                          ? form.contentTypes.filter(v => v !== opt.value)
                          : [...form.contentTypes, opt.value]
                      )
                    }
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
            <Button type="button" onClick={handleBack} variant="outline">
              Back
            </Button>
            <Button type="button" onClick={handleNext} className="ml-2">
              Next
            </Button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Budget (USD)"
              value={form.budget}
              onChange={e => handleChange("budget", e.target.value)}
            />
            <Input
              type="text"
              placeholder="Campaign Duration (e.g., 1 month)"
              value={form.duration}
              onChange={e => handleChange("duration", e.target.value)}
            />
            <Input
              type="date"
              placeholder="Start Date"
              value={form.startDate}
              onChange={e => handleChange("startDate", e.target.value)}
            />
            <Input
              type="date"
              placeholder="End Date"
              value={form.endDate}
              onChange={e => handleChange("endDate", e.target.value)}
            />
            <Button type="button" onClick={handleBack} variant="outline">
              Back
            </Button>
            <Button type="submit" className="ml-2" disabled={loading}>
              {loading ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}










// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Badge } from "@/components/ui/badge";
// import { CalendarIcon, ArrowLeft, Plus, X } from "lucide-react";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";
// import { useNavigate } from "react-router-dom";
// import BrandNavbar from "@/components/brand/BrandNavbar";

// const CampaignCreation = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     category: "",
//     budget: "",
//     startDate: undefined as Date | undefined,
//     endDate: undefined as Date | undefined,
//     targetAudience: "",
//     goals: [] as string[],
//     requirements: ""
//   });

//   const [newGoal, setNewGoal] = useState("");

//   const categories = [
//     "Fashion & Beauty",
//     "Technology",
//     "Fitness & Health",
//     "Food & Beverage",
//     "Travel & Lifestyle",
//     "Gaming",
//     "Education",
//     "Entertainment"
//   ];

//   const addGoal = () => {
//     if (newGoal.trim() && !formData.goals.includes(newGoal.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         goals: [...prev.goals, newGoal.trim()]
//       }));
//       setNewGoal("");
//     }
//   };

//   const removeGoal = (goal: string) => {
//     setFormData(prev => ({
//       ...prev,
//       goals: prev.goals.filter(g => g !== goal)
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Campaign created:", formData);
//     // Handle campaign creation logic here
//     navigate("/brand/dashboard");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
//       <BrandNavbar />
      
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex items-center mb-8">
//           <Button 
//             variant="ghost" 
//             onClick={() => navigate("/brand/dashboard")}
//             className="mr-4"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Dashboard
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 font-poppins">Create Campaign</h1>
//             <p className="text-gray-600 mt-2 font-sofia">Set up your influencer marketing campaign</p>
//           </div>
//         </div>

//         <Card className="max-w-4xl mx-auto animate-fade-in">
//           <CardHeader>
//             <CardTitle className="text-2xl font-poppins">Campaign Details</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Basic Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Campaign Name</Label>
//                   <Input
//                     id="name"
//                     value={formData.name}
//                     onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                     placeholder="Enter campaign name"
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="category">Category</Label>
//                   <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categories.map((category) => (
//                         <SelectItem key={category} value={category}>
//                           {category}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               {/* Description */}
//               <div className="space-y-2">
//                 <Label htmlFor="description">Campaign Description</Label>
//                 <Textarea
//                   id="description"
//                   value={formData.description}
//                   onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                   placeholder="Describe your campaign objectives and requirements"
//                   rows={4}
//                   required
//                 />
//               </div>

//               {/* Budget and Dates */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="budget">Budget ($)</Label>
//                   <Input
//                     id="budget"
//                     type="number"
//                     value={formData.budget}
//                     onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
//                     placeholder="0"
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Start Date</Label>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className={cn(
//                           "w-full justify-start text-left font-normal",
//                           !formData.startDate && "text-muted-foreground"
//                         )}
//                       >
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {formData.startDate ? format(formData.startDate, "PPP") : "Pick start date"}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0">
//                       <Calendar
//                         mode="single"
//                         selected={formData.startDate}
//                         onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
//                         initialFocus
//                         className="pointer-events-auto"
//                       />
//                     </PopoverContent>
//                   </Popover>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>End Date</Label>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className={cn(
//                           "w-full justify-start text-left font-normal",
//                           !formData.endDate && "text-muted-foreground"
//                         )}
//                       >
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {formData.endDate ? format(formData.endDate, "PPP") : "Pick end date"}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0">
//                       <Calendar
//                         mode="single"
//                         selected={formData.endDate}
//                         onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
//                         initialFocus
//                         className="pointer-events-auto"
//                       />
//                     </PopoverContent>
//                   </Popover>
//                 </div>
//               </div>

//               {/* Target Audience */}
//               <div className="space-y-2">
//                 <Label htmlFor="audience">Target Audience</Label>
//                 <Input
//                   id="audience"
//                   value={formData.targetAudience}
//                   onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
//                   placeholder="e.g., Women 18-35, Tech enthusiasts, Fitness lovers"
//                 />
//               </div>

//               {/* Campaign Goals */}
//               <div className="space-y-2">
//                 <Label>Campaign Goals</Label>
//                 <div className="flex space-x-2">
//                   <Input
//                     value={newGoal}
//                     onChange={(e) => setNewGoal(e.target.value)}
//                     placeholder="Add a goal (e.g., Brand awareness, Sales increase)"
//                     onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
//                   />
//                   <Button type="button" onClick={addGoal} size="icon">
//                     <Plus className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {formData.goals.map((goal) => (
//                     <Badge key={goal} variant="secondary" className="flex items-center space-x-1">
//                       <span>{goal}</span>
//                       <button
//                         type="button"
//                         onClick={() => removeGoal(goal)}
//                         className="ml-1 hover:text-red-500"
//                         title={`Remove goal: ${goal}`}
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </Badge>
//                   ))}
//                 </div>
//               </div>

//               {/* Requirements */}
//               <div className="space-y-2">
//                 <Label htmlFor="requirements">Special Requirements</Label>
//                 <Textarea
//                   id="requirements"
//                   value={formData.requirements}
//                   onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
//                   placeholder="Any specific requirements for influencers (content style, posting schedule, etc.)"
//                   rows={3}
//                 />
//               </div>

//               {/* Submit */}
//               <div className="flex justify-end space-x-4 pt-6">
//                 <Button 
//                   type="button" 
//                   variant="outline"
//                   onClick={() => navigate("/brand/dashboard")}
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   type="submit"
//                   className="bg-primary hover:bg-primary-600"
//                 >
//                   Create Campaign
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CampaignCreation;
