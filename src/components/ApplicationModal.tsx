import React, { useState } from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useMutation, useQuery } from 'convex/react';
import { Button } from './ui/button';
import { api } from 'convex/_generated/api';
import { useToast } from './ui/use-toast';
//import logo from '../assets/logo.png';


const ApplicationModal = ({ campaignId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pitch, setPitch] = useState("");
  const applyToCampaign = useMutation(api.campaign.applyToCampaign);
  const withdrawApplication = useMutation(api.campaign.withdrawApplication);
  const { toast } = useToast();


  const existingApplication = useQuery(api.campaign.campaignsForInfluencer)?.find(
    campaign => campaign._id === campaignId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await applyToCampaign({ campaignId, pitch });
      toast({
        variant: "success",
        title: existingApplication ? "Application Updated" : "Application Submitted",
        description: existingApplication 
          ? "Your application has been updated successfully."
          : "Your application has been submitted successfully.",
      });
      onClose();
    } catch (e) {
      setError(e.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    setError("");
    try {
      await withdrawApplication({ campaignId });
      toast({
        variant: "default",
        title: "Application Withdrawn",
        description: "Your application has been withdrawn successfully.",
      });
      onClose();
    } catch (e) {
      setError(e.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {existingApplication ? "Update Application" : "Apply to Campaign"}
        </h2>
        <form onSubmit={handleSubmit}>
            <textarea
            className="w-full border rounded p-2 mb-4"
            rows={4}
            value={pitch}
            onChange={e => setPitch(e.target.value)}
            placeholder="Tell the brand why you're a great fit..."
            required
            />
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div className="flex justify-end gap-2">
            {existingApplication && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleWithdraw}
                disabled={loading}
              >
                Withdraw Application
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : existingApplication ? "Update Application" : "Submit Application"}
            </Button>
            </div>
        </form>
        </div>
    </div>
  )
}

export default ApplicationModal
