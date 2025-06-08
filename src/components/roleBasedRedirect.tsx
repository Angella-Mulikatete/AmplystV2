// RoleBasedRedirect.tsx
import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export function RoleBasedRedirect() {
  const { isSignedIn } = useUser();
  const role = useQuery(api.users.getMyRole);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) return;
    if (!role) return;

    if (role === "influencer") {
      navigate("/influencer/dashboard");
    } else if (role === "brand") {
      navigate("/brand/dashboard");
    } else if (role === "agency") {
      navigate("/agency/dashboard");
    }
  }, [isSignedIn, role, navigate]);

  return null;
}
