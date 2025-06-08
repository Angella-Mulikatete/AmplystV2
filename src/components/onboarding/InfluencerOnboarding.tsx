
// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { ArrowLeft, ArrowRight } from "lucide-react";
// import BasicInfo from "./steps/BasicInfo";
// import SocialMediaLinked from "./steps/SocialMediaLinked";
// import PortfolioSetup from "./steps/PortfolioSetup";
// import CompletionStep from "./steps/CompletionStep";
// import { useMutation } from "convex/react";
// import { api } from "convex/_generated/api";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "@clerk/clerk-react";
// import { SocialMediaData, SocialMediaAccount, SocialMediaProfileData } from "./steps/SocialMediaLinked";
// import { PortfolioItem } from "./steps/PortfolioSetup";
// import { useConvexUserSync } from "@/hooks/useConvexSync";


// interface InfluencerFormData {
//   firstName: string;
//   lastName: string;
//   role: string;
//   bio: string;
//   niche: string;
//   location: string;
//   followerCount: string;
//   socialAccounts: SocialMediaAccount;
//   portfolio: PortfolioItem[];
//   profileData?: SocialMediaProfileData;
// }


// const InfluencerOnboarding = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState<InfluencerFormData>({
//     firstName: "",
//     lastName: "",
//     bio: "",
//     role: "",
//     niche: "",
//     location: "",
//     followerCount: "",
//     socialAccounts: {
//       instagram: "",
//       tiktok: "",
//       youtube: "",
//       twitter: ""
//     },
//     portfolio: [],
//     profileData: {
//       tiktok: undefined // Initialize profileData with tiktok as undefined
//     }
//   });
//   const insertProfile = useMutation(api.users.insertProfile);
//   const { user } = useUser();
//   const navigate = useNavigate();
//   useConvexUserSync();

//   const totalSteps = 4;
//   const progress = (currentStep / totalSteps) * 100;

//   const handleNext = () => {
//     if (currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const updateFormData = (data: Partial<InfluencerFormData>) => {
//     setFormData(prev => ({ ...prev, ...data }));
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 1:
//         return <BasicInfo data={formData} onUpdate={updateFormData} />;
//       case 2:
//         return <SocialMediaLinked data={formData} onUpdate={updateFormData} />;
//       case 3:
//         return <PortfolioSetup data={formData} onUpdate={updateFormData} />;
//       case 4:
//         return <CompletionStep data={formData} />;
//       default:
//         return <BasicInfo data={formData} onUpdate={updateFormData} />;
//     }
//   };

//   const handleComplete = async () => {
//     try {
//       console.log("Submitting profile data:", formData);
//       // Compose the profile data from formData
//       await insertProfile({
//         role: "influencer",
//         name: `${formData.firstName} ${formData.lastName}`,
//         bio: formData.bio,
//         profilePictureUrl: user?.imageUrl,
//         niche: formData.niche,
//         location: formData.location,
//         followerCount: formData.followerCount,
//         socialAccounts: formData.socialAccounts,
//         portfolio: formData.portfolio,
//         // Add more fields as needed, matching your Convex schema
//       });
//       navigate("/influencer/dashboard");
//     } catch (err) {
//       // Handle error (show toast, etc.)
//       console.error("Failed to save profile:", err);
//     }
//   };


//   const stepTitles = [
//     "Basic Information",
//     "Social Media Accounts",
//     "Portfolio Setup",
//     "Complete Setup"
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
//       <Card className="w-full max-w-2xl animate-fade-in">
//         <CardHeader className="text-center">
//           <div className="flex items-center justify-center space-x-2 mb-4">
//             <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">A</span>
//             </div>
//             <span className="text-xl font-bold text-gray-900 font-poppins">Amplyst</span>
//           </div>
//           <CardTitle className="text-2xl font-poppins">Complete Your Profile</CardTitle>
//           <div className="mt-4">
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
//               <span className="text-sm font-medium text-primary">{Math.round(progress)}% Complete</span>
//             </div>
//             <Progress value={progress} className="h-2" />
//             <p className="text-sm text-gray-600 mt-2 font-sofia">{stepTitles[currentStep - 1]}</p>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="animate-slide-in-right" key={currentStep}>
//             {renderStep()}
//           </div>
          
//           <div className="flex justify-between pt-4">
//             <Button
//               variant="outline"
//               onClick={handlePrevious}
//               disabled={currentStep === 1}
//               className="flex items-center space-x-2"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               <span>Previous</span>
//             </Button>
            
//             {currentStep < totalSteps ? (
//               <Button
//                 onClick={handleNext}
//                 className="flex items-center space-x-2 bg-primary hover:bg-primary-600"
//               >
//                 <span>Next</span>
//                 <ArrowRight className="h-4 w-4" />
//               </Button>
//             ) : (
//               <Button
//                 className="bg-secondary hover:bg-secondary-600"
//                 onClick={handleComplete}
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

// export default InfluencerOnboarding;





// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { ArrowLeft, ArrowRight } from "lucide-react";
// import BasicInfo from "./steps/BasicInfo";
// import SocialMediaLinked from "./steps/SocialMediaLinked";
// import PortfolioSetup from "./steps/PortfolioSetup";
// import CompletionStep from "./steps/CompletionStep";
// import { useMutation } from "convex/react";
// import { api } from "convex/_generated/api";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "@clerk/clerk-react";
// import { SocialMediaData, SocialMediaAccount, SocialMediaProfileData } from "./steps/SocialMediaLinked";
// import { PortfolioItem } from "./steps/PortfolioSetup";
// import { useConvexUserSync } from "@/hooks/useConvexSync";


// interface InfluencerFormData {
//   firstName: string;
//   lastName: string;
//   role: string;
//   bio: string;
//   niche: string;
//   location: string;
//   followerCount: string;
//   socialAccounts: SocialMediaAccount;
//   portfolio: PortfolioItem[];
//   profileData?: SocialMediaProfileData;
// }


// const InfluencerOnboarding = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState<InfluencerFormData>({
//     firstName: "",
//     lastName: "",
//     bio: "",
//     role: "",
//     niche: "",
//     location: "",
//     followerCount: "",
//     socialAccounts: {
//       instagram: "",
//       tiktok: "",
//       youtube: "",
//       twitter: ""
//     },
//     portfolio: [],
//     profileData: {
//       tiktok: undefined // Initialize profileData with tiktok as undefined
//     }
//   });
//   const insertProfile = useMutation(api.users.insertProfile);
//   const { user } = useUser();
//   const navigate = useNavigate();
//   useConvexUserSync();

//   const totalSteps = 4;
//   const progress = (currentStep / totalSteps) * 100;

//   const handleNext = () => {
//     if (currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const updateFormData = (data: Partial<InfluencerFormData>) => {
//     setFormData(prev => ({ ...prev, ...data }));
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 1:
//         return <BasicInfo data={formData} onUpdate={updateFormData} />;
//       case 2:
//         return <SocialMediaLinked data={formData} onUpdate={updateFormData} />;
//       case 3:
//         return <PortfolioSetup data={formData} onUpdate={updateFormData} />;
//       case 4:
//         return <CompletionStep data={formData} />;
//       default:
//         return <BasicInfo data={formData} onUpdate={updateFormData} />;
//     }
//   };

//   const handleComplete = async () => {
//     try {
//       console.log("Submitting profile data:", formData);
//       // Compose the profile data from formData
//       await insertProfile({
//         role: "influencer",
//         name: `${formData.firstName} ${formData.lastName}`,
//         bio: formData.bio,
//         profilePictureUrl: user?.imageUrl,
//         niche: formData.niche,
//         location: formData.location,
//         followerCount: formData.followerCount,
//         socialAccounts: formData.socialAccounts,
//         portfolio: formData.portfolio,
//         // Add more fields as needed, matching your Convex schema
//       });
//       navigate("/influencer/dashboard");
//     } catch (err) {
//       // Handle error (show toast, etc.)
//       console.error("Failed to save profile:", err);
//     }
//   };


//   const stepTitles = [
//     "Basic Information",
//     "Social Media Accounts",
//     "Portfolio Setup",
//     "Complete Setup"
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
//       <Card className="w-full max-w-2xl animate-fade-in">
//         <CardHeader className="text-center">
//           <div className="flex items-center justify-center space-x-2 mb-4">
//             <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">A</span>
//             </div>
//             <span className="text-xl font-bold text-gray-900 font-poppins">Amplyst</span>
//           </div>
//           <CardTitle className="text-2xl font-poppins">Complete Your Profile</CardTitle>
//           <div className="mt-4">
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
//               <span className="text-sm font-medium text-primary">{Math.round(progress)}% Complete</span>
//             </div>
//             <Progress value={progress} className="h-2" />
//             <p className="text-sm text-gray-600 mt-2 font-sofia">{stepTitles[currentStep - 1]}</p>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="animate-slide-in-right" key={currentStep}>
//             {renderStep()}
//           </div>
          
//           <div className="flex justify-between pt-4">
//             <Button
//               variant="outline"
//               onClick={handlePrevious}
//               disabled={currentStep === 1}
//               className="flex items-center space-x-2"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               <span>Previous</span>
//             </Button>
            
//             {currentStep < totalSteps ? (
//               <Button
//                 onClick={handleNext}
//                 className="flex items-center space-x-2 bg-primary hover:bg-primary-600"
//               >
//                 <span>Next</span>
//                 <ArrowRight className="h-4 w-4" />
//               </Button>
//             ) : (
//               <Button
//                 className="bg-secondary hover:bg-secondary-600"
//                 onClick={handleComplete}
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

// export default InfluencerOnboarding;
