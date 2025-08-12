import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  X, 
  Send, 
  DollarSign, 
  Calendar, 
  Users, 
  Heart,
  CheckCircle,
  AlertCircle,
  Target,
  Lightbulb,
  Award
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useParams, useNavigate } from 'react-router-dom';

interface ApplicationFormProps {
  campaignId: Id<"campaigns">;
  campaign: {
    title: string;
    description: string;
    budget?: number;
    endDate?: string;
    platform?: string;
    targetAudience?: string;
    contentTypes?: string[];
    requirements?: string;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

const CampaignApplyPage: React.FC= () => {

  const { campaignId } = useParams<{ campaignId: Id<"campaigns"> }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    message: '',
    proposedContent: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const createApplication = useMutation(api.applications.createApplication);
    // Fetch campaign details based on campaignId
  const campaign = useQuery(api.campaign.getCampaignById, { campaignId: campaignId! });

  console.log("campaign in campaign apply page", campaign);

  if (!campaign) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-primary">Loading campaign details...</span>
      </div>
    );
  }


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.message.trim()) {
      setErrorMessage('Please tell us why you\'re the perfect fit for this campaign');
      return false;
    }
    if (!formData.proposedContent.trim()) {
      setErrorMessage('Please share your content ideas for this campaign');
      return false;
    }
    if (formData.message.length < 100) {
      setErrorMessage('Please provide more details about why you\'re the best fit (minimum 100 characters)');
      return false;
    }
    if (formData.proposedContent.length < 80) {
      setErrorMessage('Please elaborate on your content ideas (minimum 80 characters)');
      return false;
    }
    return true;
  };

  const handleClose = () => {
    navigate(-1); // Navigate back when closing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await createApplication({
        campaignId,
        message: formData.message.trim(),
        proposedContent: formData.proposedContent.trim()
      });
      alert("Application submitted successfully!");

      setSubmitStatus('success');
       setTimeout(() => {
        navigate("/influencer/dashboard"); 
      }, 2500);
    } catch (error) {
      console.error('Failed to submit application:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        <Card className="border-0 shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-[#3A7CA5] to-[#3A7CA5]/90 text-white">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Show Them You're The Perfect Match
                </CardTitle>
                <CardDescription className="text-blue-100 mt-1">
                  Apply for "{campaign.title}" - Make your case!
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-white hover:bg-white/20 p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Campaign Context */}
            <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-[#3A7CA5]" />
                <h3 className="font-bold text-gray-900">What This Brand Is Looking For</h3>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">{campaign.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                {campaign.budget && (
                  <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                    <DollarSign className="h-4 w-4 text-[#88B04B]" />
                    <div>
                      <div className="font-semibold text-[#88B04B]">${campaign.budget.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Campaign Budget</div>
                    </div>
                  </div>
                )}
                {campaign.endDate && (
                  <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                    <Calendar className="h-4 w-4 text-[#E19629]" />
                    <div>
                      <div className="font-semibold text-[#E19629]">{campaign.endDate}</div>
                      <div className="text-xs text-gray-500">Application Deadline</div>
                    </div>
                  </div>
                )}
                {campaign.platform && (
                  <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                    <Users className="h-4 w-4 text-[#3A7CA5]" />
                    <div>
                      <div className="font-semibold text-[#3A7CA5]">{campaign.platform}</div>
                      <div className="text-xs text-gray-500">Platform Focus</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {campaign.targetAudience && (
                    <Badge className="bg-[#3A7CA5] text-white px-3 py-1">
                      Target: {campaign.targetAudience}
                    </Badge>
                  )}
                  {campaign.contentTypes?.map((type) => (
                    <Badge key={type} variant="outline" className="border-[#3A7CA5] text-[#3A7CA5] px-3 py-1">
                      {type}
                    </Badge>
                  ))}
                </div>

                {campaign.requirements && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                    <div className="font-semibold text-amber-800 text-sm mb-1">Brand Requirements:</div>
                    <div className="text-sm text-amber-700">{campaign.requirements}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Why You're The Perfect Fit */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-[#3A7CA5]" />
                  <Label htmlFor="message" className="text-lg font-semibold text-gray-900">
                    Why Are You The Perfect Fit For This Brand? *
                  </Label>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#3A7CA5] mb-3">
                  <p className="text-sm text-gray-700 italic">
                    💡 Think about: Your audience alignment, brand values match, relevant experience, 
                    personal connection to the brand/product, and what makes you uniquely qualified
                  </p>
                </div>
                <Textarea
                  id="message"
                  placeholder="Example: 'I'm passionate about sustainable fashion and have been following your brand for 2 years. My audience of 50K eco-conscious millennials perfectly aligns with your target demographic. I've successfully promoted similar sustainable brands with 8% engagement rates, and my authentic storytelling style would showcase your products genuinely because I already use and love them personally...'"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="min-h-[140px] border-gray-300 focus:border-[#3A7CA5] focus:ring-[#3A7CA5] text-sm"
                  disabled={isSubmitting}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formData.message.length}/1000 characters</span>
                  <span className={formData.message.length >= 100 ? 'text-green-600' : 'text-amber-600'}>
                    Minimum 100 characters {formData.message.length >= 100 ? '✓' : `(${100 - formData.message.length} more needed)`}
                  </span>
                </div>
              </div>

              {/* Content Strategy */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-[#E19629]" />
                  <Label htmlFor="proposedContent" className="text-lg font-semibold text-gray-900">
                    Your Creative Content Strategy *
                  </Label>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#E19629] mb-3">
                  <p className="text-sm text-gray-700 italic">
                    🎯 Be specific: What content will you create? How will you showcase their product? 
                    What's your unique angle? How does it fit their brand aesthetic?
                  </p>
                </div>
                <Textarea
                  id="proposedContent"
                  placeholder="Example: 'I'll create a 3-part content series: (1) Unboxing reel showing the sustainable packaging, (2) Get-ready-with-me featuring 3 outfit combinations with your pieces, and (3) Behind-the-scenes story highlighting the brand's ethical manufacturing process. Each post will use your brand colors and include authentic testimonials about quality and comfort. I'll also create matching Pinterest graphics to extend reach to my 10K Pinterest followers...'"
                  value={formData.proposedContent}
                  onChange={(e) => handleInputChange('proposedContent', e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-[#3A7CA5] focus:ring-[#3A7CA5] text-sm"
                  disabled={isSubmitting}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formData.proposedContent.length}/800 characters</span>
                  <span className={formData.proposedContent.length >= 80 ? 'text-green-600' : 'text-amber-600'}>
                    Minimum 80 characters {formData.proposedContent.length >= 80 ? '✓' : `(${80 - formData.proposedContent.length} more needed)`}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <span className="text-sm text-red-700">{errorMessage}</span>
                </div>
              )}

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="text-sm text-green-700">
                    <div className="font-semibold">Application submitted successfully! 🎉</div>
                    <div>The brand will review your application and get back to you soon.</div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#3A7CA5] hover:bg-[#3A7CA5]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  disabled={isSubmitting || submitStatus === 'success'}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit My Application
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Success Tips */}
            <div className="mt-8 p-5 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
              <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Pro Tips to Stand Out
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
                <div>
                  <div className="font-semibold mb-1">✨ Show Genuine Interest</div>
                  <div>Mention specific products or campaigns you love</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">📊 Share Relevant Stats</div>
                  <div>Include engagement rates and audience demographics</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">🎨 Be Creative & Specific</div>
                  <div>Detail exactly what content you'll create</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">💝 Show Brand Alignment</div>
                  <div>Explain how your values match theirs</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignApplyPage;