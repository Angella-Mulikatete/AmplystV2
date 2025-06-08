"use client";

import { ReactNode, useEffect } from "react";
import { ConvexReactClient, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth, useUser } from "@clerk/clerk-react"; // <-- use clerk-react, NOT nextjs
import { api } from "../../convex/_generated/api";

//const convexUrl = import.meta.env.VITE_CONVEX_URL;


// if (!convexUrl) {
//   throw new Error("Missing VITE_CONVEX_URL in your .env file");
// }

const convex = new ConvexReactClient("https://neat-dinosaur-170.convex.cloud");

function UserInitializer() {
  const createOrGetUser = useMutation(api.users.createOrGetUser);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      createOrGetUser().catch((error) =>
        console.error("Failed to create or get user:", error)
      );
    }
  }, [isSignedIn, createOrGetUser]);

  return null;
}

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <UserInitializer />
      {children}
    </ConvexProviderWithClerk>
  );
}
