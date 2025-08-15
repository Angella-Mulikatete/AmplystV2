import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Target, ArrowLeft } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function BrandProfileEdit() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const brandProfile = useQuery(api.brands.getMyBrandProfile);
  const updateBrandProfile = useMutation(api.brands.updateBrandProfile);
  const userRole = useQuery(api.users.getMyRole);

  const [profileData, setProfileData] = useState({
    companyName: "",
    contactPerson: "",
    businessEmail: "",
    industry: "",
    location: "",
    campaignGoal: "",
    targetAudience: "",
    budgetRange: "",
    description: "",
    website: ""
  });

  useEffect(() => {
    if (brandProfile) {
      setProfileData({
        companyName: brandProfile.companyName || "",
        contactPerson: brandProfile.contactPerson || "",
        businessEmail: brandProfile.businessEmail || "",
        industry: brandProfile.industry || "",
        location: brandProfile.location || "",
        campaignGoal: brandProfile.campaignGoal || "",
        targetAudience: brandProfile.targetAudience || "",
        budgetRange: brandProfile.budgetRange || "",
        description: brandProfile.description || "",
        website: brandProfile.website || ""
      });
    }
  }, [brandProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await updateBrandProfile(profileData);
      toast({
        title: "Success",
        description: "Brand profile updated successfully!",
        variant: "success",
      });
      navigate("/brand/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message || "Please try again."}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const required = {
      companyName: profileData.companyName?.trim(),
      industry: profileData.industry,
      contactPerson: profileData.contactPerson?.trim(),
      businessEmail: profileData.businessEmail?.trim(),
      location: profileData.location,
      campaignGoal: profileData.campaignGoal,
      targetAudience: profileData.targetAudience?.trim(),
      budgetRange: profileData.budgetRange
    };
    return Object.values(required).every(value => value && value !== "");
  };

  if (brandProfile === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (brandProfile === null) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">No brand profile found. Please create one first.</p>
          <Button onClick={() => navigate("/brand/setup")} className="mt-4">
            Create Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout userRole={userRole || "brand"}>
      <div className="w-full max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate("/brand/dashboard")}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-800">
            Edit Brand Profile
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Update your brand information and preferences
          </p>
        </div>

        {/* Scrollable Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(100vh-150px)] space-y-6"
        >
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Building2 className="w-5 h-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name..."
                    value={profileData.companyName}
                    onChange={e => setProfileData(prev => ({ ...prev, companyName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Enter contact person name..."
                    value={profileData.contactPerson}
                    onChange={e => setProfileData(prev => ({ ...prev, contactPerson: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessEmail">Business Email *</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    placeholder="Enter business email..."
                    value={profileData.businessEmail}
                    onChange={e => setProfileData(prev => ({ ...prev, businessEmail: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://www.yourcompany.com"
                    value={profileData.website}
                    onChange={e => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    value={profileData.industry}
                    onValueChange={value => setProfileData(prev => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Beauty">Beauty</SelectItem>
                      <SelectItem value="Fitness">Fitness</SelectItem>
                      <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Select
                    value={profileData.location}
                    onValueChange={value => setProfileData(prev => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Uganda">Uganda</SelectItem>
                      <SelectItem value="Kenya">Kenya</SelectItem>
                      <SelectItem value="Tanzania">Tanzania</SelectItem>
                      <SelectItem value="Rwanda">Rwanda</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your company..."
                  value={profileData.description}
                  onChange={e => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Campaign Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Target className="w-5 h-5" />
                Campaign Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div>
                <Label htmlFor="campaignGoal">Primary Campaign Goal *</Label>
                <Select
                  value={profileData.campaignGoal}
                  onValueChange={value => setProfileData(prev => ({ ...prev, campaignGoal: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brand Awareness">Brand Awareness</SelectItem>
                    <SelectItem value="Product Launch">Product Launch</SelectItem>
                    <SelectItem value="Sales Growth">Sales Growth</SelectItem>
                    <SelectItem value="Community Building">Community Building</SelectItem>
                    <SelectItem value="Content Creation">Content Creation</SelectItem>
                    <SelectItem value="Lead Generation">Lead Generation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Young professionals aged 25-35..."
                  value={profileData.targetAudience}
                  onChange={e => setProfileData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="budgetRange">Typical Budget Range *</Label>
                <Select
                  value={profileData.budgetRange}
                  onValueChange={value => setProfileData(prev => ({ ...prev, budgetRange: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$1,000 - $5,000">$1,000 - $5,000</SelectItem>
                    <SelectItem value="$5,000 - $15,000">$5,000 - $15,000</SelectItem>
                    <SelectItem value="$15,000 - $50,000">$15,000 - $50,000</SelectItem>
                    <SelectItem value="$50,000 - $100,000">$50,000 - $100,000</SelectItem>
                    <SelectItem value="$100,000+">$100,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/brand/dashboard")}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/100 hover:to-[#88B04B]/90"
              disabled={!isFormValid() || loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
