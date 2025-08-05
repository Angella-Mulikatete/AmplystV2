import React from 'react'
import { Button } from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeaderButton = () => {
    const navigate = useNavigate();
  return (
    <div className="flex items-center gap-4">
        <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/influencer/dashboard')}
            className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
        </Button>
        {/* <div>
            <div className="mb-5">
                <h2 className="text-3xl font-bold text-primary-800">Applications Review</h2>
                <p className="text-gray-600 mt-1">Manage influencer applications for your campaigns</p>
            </div>
        </div> */}
    </div>
  )
}

export default HeaderButton