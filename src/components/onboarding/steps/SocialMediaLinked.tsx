// "use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Instagram, Music, Youtube, Twitter, CheckCircle, Loader2 } from "lucide-react";
import { runTikTokActor, TikTokProfileData } from '@/services/tiktokService';
import axios from "axios";
import { InstagramProfileData, runInstagramActor } from "@/services/instagramService";

const APIFY_TOKEN = "apify_api_7duCuWXWiRN2DJNi5aEVSalzmMhEc12ijzrz";
const ACTOR_ID = "urbACh26VF8yHR72m"; 

export interface SocialMediaAccount {
  instagram: string;
  tiktok: string;
  youtube: string;
  twitter: string;
}

export interface SocialMediaProfileData {
  tiktok?: TikTokProfileData;
  instagram?: InstagramProfileData;
}

export interface SocialMediaData {
  socialAccounts: SocialMediaAccount;
  profileData?: SocialMediaProfileData;
  primaryPlatform?: string;
}

interface SocialMediaLinkedProps {
  data: SocialMediaData;
  onUpdate: (data: SocialMediaData) => void;
}

const SocialMediaLinked = ({ data, onUpdate }: SocialMediaLinkedProps) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});
  const [profileData, setProfileData] = useState<TikTokProfileData | null>(null);
  const [instaProfileData, setInstaProfileData] = useState<InstagramProfileData | null>(null);
  const [primaryAccount, setPrimaryAccount] = useState<string | null>(null);

  const updateSocialAccount = (platform: string, value: string) => {
    onUpdate({
      ...data,
      socialAccounts: {
        ...data.socialAccounts,
        [platform]: value
      }
    });
  };

    // Function to set primary account and pass data to parent
  const setPrimaryAndPassData = (platform: string, profileData: TikTokProfileData | InstagramProfileData) => {
    setPrimaryAccount(platform);
    
    // Pass the scraped profile data to parent component
    onUpdate({
      ...data,
      socialAccounts: {
        ...data.socialAccounts,
        [platform]: data.socialAccounts[platform]
      },
      profileData: {
        ...data.profileData,
        [platform]: profileData
      },
      primaryPlatform: platform // Add this to track primary platform
    });
  };


  const verifyAccount = async (platform: string, username: string) => {
    if (!username) {
      setError(prev => ({ ...prev, [platform]: 'Please enter a username' }));
      return;
    }

    setLoading(prev => ({ ...prev, [platform]: true }));
    setError(prev => ({ ...prev, [platform]: '' }));

    try {
      // This is a placeholder for other platform verifications
      // For now, it just simulates a successful verification
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      onUpdate({
        ...data,
        socialAccounts: {
          ...data.socialAccounts,
          [platform]: username
        }
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(prev => ({
          ...prev,
          [platform]: err.message || 'Failed to verify account. Please try again.'
        }));
      } else {
        setError(prev => ({
          ...prev,
          [platform]: 'An unknown error occurred during verification.'
        }));
      }
    } finally {
      setLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  async function verifyTikTok(username: string) {
    setLoading(prev => ({ ...prev, tiktok: true }));
    setError(prev => ({ ...prev, tiktok: '' }));

    try {
      const profiles = await runTikTokActor(username);
      console.log("TikTok Profiles in socialMedia links:", profiles);
      console.log("TikTok Profiles[0] in socialMedia links:", profiles[0]);
      
      if (profiles.length === 0) {
        setError(prev => ({ ...prev, tiktok: "No profile found for this username." }));
      } else {
        updateSocialAccount("tiktok", username);
        setProfileData(profiles[0]); 
        setPrimaryAndPassData("tiktok", profiles[0]);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(prev => ({ ...prev, tiktok: e.message || "Error verifying TikTok profile" }));
      } else {
        setError(prev => ({ ...prev, tiktok: "An unknown error occurred during TikTok verification." }));
      }
    } finally {
      setLoading(prev => ({ ...prev, tiktok: false }));
    }
  }

   async function verifyInsta(username: string) {
    setLoading(prev => ({ ...prev, instagram: true }));
    setError(prev => ({ ...prev, instagram: '' }));

    try {
      const profiles = await runInstagramActor(username);
      console.log("Instagram Profiles in socialMedia links:", profiles);
      console.log("Instagram Profiles[0] in socialMedia links:", profiles[0]);
      
      if (profiles.length === 0) {
        setError(prev => ({ ...prev, instagram: "No profile found for this username." }));
      } else {
        updateSocialAccount("instagram", username);
        setInstaProfileData(profiles[0]); 
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(prev => ({ ...prev, tiktok: e.message || "Error verifying TikTok profile" }));
      } else {
        setError(prev => ({ ...prev, tiktok: "An unknown error occurred during TikTok verification." }));
      }
    } finally {
      setLoading(prev => ({ ...prev, tiktok: false }));
    }
  }

  const socialPlatforms = [
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      placeholder: "@yourusername",
      color: "text-pink-600",
      verifyAction: verifyInsta,
    },
    {
      id: "tiktok", 
      name: "TikTok",
      icon: Music,
      placeholder: "@yourusername",
      color: "text-black",
      verifyAction: verifyTikTok,
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      placeholder: "Channel URL or @handle",
      color: "text-red-600",
      verifyAction: (username: string) => verifyAccount("youtube", username),
    },
    {
      id: "twitter",
      name: "Twitter/X",
      icon: Twitter,
      placeholder: "@yourusername",
      color: "text-blue-600",
      verifyAction: (username: string) => verifyAccount("twitter", username),
    }
  ];

  return (
      <div className="space-y-6 animate-fade-in">

        {socialPlatforms.map((platform) => {
        const Icon = platform.icon;
        const isConnected = data.socialAccounts[platform.id];
        return (
          <div key={platform.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon className={`h-5 w-5 ${platform.color}`} />
              <Label htmlFor={platform.id} className="font-medium">
                {platform.name}
              </Label>
              {isConnected && (
                <CheckCircle className="h-4 w-4 text-secondary animate-scale-in" />
              )}
            </div>
            <div className="flex space-x-2">
              <Input
                id={platform.id}
                value={data.socialAccounts[platform.id] || ""}
                onChange={(e) => updateSocialAccount(platform.id, e.target.value)}
                placeholder={platform.placeholder}
                className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
              <Button
                variant="outline"
                size="sm"
                disabled={loading[platform.id]}
                onClick={() => platform.verifyAction(data.socialAccounts[platform.id])}
                className="hover:bg-primary hover:text-white transition-colors duration-200"
              >
                {loading[platform.id] ? "Verifying..." : "Verify"}
              </Button>
            </div>
            {platform.id === "tiktok" && profileData && (
              <div className="mt-2 p-2 border rounded bg-gray-50 text-sm">
                <p><strong>Username:</strong> {profileData.name || "N/A"}</p>
                <p><strong>Followers:</strong> {profileData.fans || "N/A"}</p>
                 <p><strong>likes:</strong> {profileData.heart || "N/A"}</p>
                <p><strong>following:</strong> {profileData.following || "N/A"}</p>
              </div>
            )}
            {error[platform.id] && (
              <div className="text-red-600 text-sm mt-1">{error[platform.id]}</div>
            )}
          </div>
        );
      })}
      
      {/* Add primary account selection */}
      {(profileData || instaProfileData) && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Select your primary account</h4>
          <p className="text-sm text-green-700 mb-3">Choose the account with your highest following to showcase in your portfolio</p>
          
          <div className="flex space-x-3">
            {profileData && (
              <Button 
                variant={primaryAccount === "tiktok" ? "default" : "outline"}
                onClick={() => setPrimaryAndPassData("tiktok", profileData)}
                className="flex items-center space-x-2"
              >
                <Music className="h-4 w-4" />
                <span>TikTok ({profileData.fans || 0} followers)</span>
              </Button>
            )}
            
            {instaProfileData && (
              <Button
                variant={primaryAccount === "instagram" ? "default" : "outline"}
                onClick={() => setPrimaryAndPassData("instagram", instaProfileData)}
                className="flex items-center space-x-2"
              >
                <Instagram className="h-4 w-4" />
                <span>Instagram ({instaProfileData.followersCount || 0} followers)</span>
              </Button>
            )}
          </div>
        </div>
      )}

     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
         <h4 className="font-medium text-blue-900 mb-2">Why connect your accounts?</h4>
         <ul className="text-sm text-blue-700 space-y-1">
           <li>• Automatically pull your follower count and engagement metrics</li>
           <li>• Show brands your authentic audience and reach</li>
           <li>• Track campaign performance in real-time</li>
           <li>• Build trust with verified social media presence</li>
         </ul>
       </div>
    </div>
  );
};

export default SocialMediaLinked;



   // <div className="space-y-6 animate-fade-in">
    //   <div>
    //     <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Connect Your Social Media</h3>
    //     <p className="text-gray-600 text-sm">Link your social media accounts to showcase your reach and engagement</p>
    //   </div>

    //   <div className="space-y-4">
    //      {socialPlatforms.map((platform) => {
    //     const Icon = platform.icon;
    //     const isConnected = data.socialAccounts[platform.id];
    //     return (
    //       <div key={platform.id} className="space-y-2">
    //         <div className="flex items-center space-x-2">
    //           <Icon className={`h-5 w-5 ${platform.color}`} />
    //           <Label htmlFor={platform.id} className="font-medium">
    //             {platform.name}
    //           </Label>
    //           {isConnected && (
    //             <CheckCircle className="h-4 w-4 text-secondary animate-scale-in" />
    //           )}
    //         </div>
    //         <div className="flex space-x-2">
    //           <Input
    //             id={platform.id}
    //             value={data.socialAccounts[platform.id] || ""}
    //             onChange={(e) => updateSocialAccount(platform.id, e.target.value)}
    //             placeholder={platform.placeholder}
    //             className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary"
    //           />
    //           <Button
    //             variant="outline"
    //             size="sm"
    //             disabled={loading[platform.id]}
    //             onClick={() => platform.verifyAction(data.socialAccounts[platform.id])}
    //             className="hover:bg-primary hover:text-white transition-colors duration-200"
    //           >
    //             {loading[platform.id] ? "Verifying..." : "Verify"}
    //           </Button>
    //         </div>
    //         {platform.id === "tiktok" && profileData && (
    //           <div className="mt-2 p-2 border rounded bg-gray-50 text-sm">
    //             <p><strong>Username:</strong> {profileData.name || "N/A"}</p>
    //             <p><strong>Followers:</strong> {profileData.fans || "N/A"}</p>
    //              <p><strong>likes:</strong> {profileData.heart || "N/A"}</p>
    //             <p><strong>following:</strong> {profileData.following || "N/A"}</p>
    //           </div>
    //         )}
    //         {error[platform.id] && (
    //           <div className="text-red-600 text-sm mt-1">{error[platform.id]}</div>
    //         )}
    //       </div>
    //     );
    //   })}
    //   </div>

    //   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    //     <h4 className="font-medium text-blue-900 mb-2">Why connect your accounts?</h4>
    //     <ul className="text-sm text-blue-700 space-y-1">
    //       <li>• Automatically pull your follower count and engagement metrics</li>
    //       <li>• Show brands your authentic audience and reach</li>
    //       <li>• Track campaign performance in real-time</li>
    //       <li>• Build trust with verified social media presence</li>
    //     </ul>
    //   </div>
    // </div>
