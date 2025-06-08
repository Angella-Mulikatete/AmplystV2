import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import ConvexClientProvider from './provider/clerk-provider-provider.tsx'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
//import { ConvexReactClient } from 'convex/react'

import { ConvexProvider, ConvexReactClient } from "convex/react";


const convex = new ConvexReactClient("https://quaint-rat-476.convex.cloud");
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}
console.log("use auth initialized with URL:", useAuth);

createRoot(document.getElementById("root")!)
.render(

        // <ConvexClientProvider>
        //     <App />
        // </ConvexClientProvider>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
      {/* <ConvexProvider client={convex}> <App /></ConvexProvider> */}
      
    </ClerkProvider>
);
