// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "../../../convex/_generated/api";
// import { useNavigate } from "react-router-dom";

// interface BrandOnboardingProps {
//   userType: 'brand' | 'agency';
// }

// const BrandOnboarding = ({ userType }: BrandOnboardingProps) => {
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