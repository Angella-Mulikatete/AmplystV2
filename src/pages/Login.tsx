import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useSignIn();
  const navigate = useNavigate();
  const createOrGetUser = useMutation(api.users.createOrGetUser);
  const getUserRoleByIdentifier = useAction(api.users.getUserRoleByIdentifier);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // Clerk sign-in
      const result = await signIn?.create({
        identifier,
        password,
      });
      if (result?.status === "complete") {
        // Ensure user exists in Convex after Clerk sign-in
        await createOrGetUser();

        // Now check Convex for user and role
        const convexUser = await getUserRoleByIdentifier({ identifier });
        console.log("Convex User in the login component:", convexUser);
        if (convexUser && convexUser.exists) {
          // Redirect based on role
          switch (convexUser.role) {
            case "influencer":
              navigate("/influencer/dashboard");
              break;
            case "brand":
              navigate("/brand/dashboard");
              break;
            case "agency":
              navigate("/agency/dashboard");
              break;
            default:
              setError("No dashboard found for your role.");
          }
        } else {
          // User not found in Convex, show onboarding or error
          navigate("/onboarding/influencer"); // or show a message
        }
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errors' in err) {
        const clerkError = err as { errors?: Array<{ message: string }> };
        setError(clerkError.errors?.[0]?.message || "Login failed.");
      } else {
        setError("An unexpected error occurred during login.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Amplyst</span>
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Username or Email</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="Enter your username or email"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Sign In
            </Button>
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Continue with Google
          </Button>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-600 hover:underline">
              Sign up
            </Link>
          </div>
          <div className="text-center">
            <Link to="/" className="text-sm text-gray-600 hover:text-purple-600">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;











// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Link, useNavigate } from "react-router-dom";
// import { useSignIn, useAuth } from "@clerk/clerk-react";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "../../convex/_generated/api";

// const Login = () => {
//   const [identifier, setIdentifier] = useState(""); // username or email
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [profileExists, setProfileExists] = useState<boolean | null>(null);
//   const { signIn } = useSignIn();
//   const { userId: clerkUserId } = useAuth();
//   const navigate = useNavigate();

//   // Convex query to check if profile exists for this user
//   const checkProfile = useMutation(api.users.checkInfluencerProfile);

//   // Handler for login
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       // Clerk sign-in (using username or email)
//       const result = await signIn?.create({
//         identifier, // username or email
//         password,
//       });
//       if (result?.status === "complete") {
//         // Get user ID from Clerk session
//         setUserId(clerkUserId || null); // Ensure userId is string | null

//         // Check if this influencer has a profile in Convex
//         const exists = await checkProfile({ identifier });
//         setProfileExists(exists);

//         if (exists) {
//           navigate("/influencer/dashboard");
//         }
//         // else: show "Complete Profile" button
//       } else {
//         setError("Login failed. Please check your credentials.");
//       }
//     } catch (err: unknown) {
//       if (err && typeof err === 'object' && 'errors' in err) {
//         const clerkError = err as { errors?: Array<{ message: string }> };
//         setError(clerkError.errors?.[0]?.message || "Login failed.");
//       } else {
//         setError("An unexpected error occurred during login.");
//       }
//     }
//   };

//   // Handler for "Complete Profile" button
//   const handleCompleteProfile = () => {
//     navigate("/onboarding/influencer");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center">
//           <div className="flex items-center justify-center space-x-2 mb-4">
//             <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">A</span>
//             </div>
//             <span className="text-xl font-bold text-gray-900">Amplyst</span>
//           </div>
//           <CardTitle className="text-2xl">Welcome back</CardTitle>
//           <CardDescription>
//             Sign in to your account to continue
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <form onSubmit={handleLogin} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="identifier">Username or Email</Label>
//               <Input
//                 id="identifier"
//                 type="text"
//                 placeholder="Enter your username or email"
//                 value={identifier}
//                 onChange={e => setIdentifier(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <Button
//               type="submit"
//               className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
//             >
//               Sign In
//             </Button>
//             {error && <div className="text-red-500 text-sm">{error}</div>}
//           </form>
//           {profileExists === false && (
//             <Button
//               onClick={handleCompleteProfile}
//               className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600"
//             >
//               Complete Profile
//             </Button>
//           )}
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <span className="w-full border-t" />
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
//             </div>
//           </div>
//           <Button variant="outline" className="w-full">
//             Continue with Google
//           </Button>
//           <div className="text-center text-sm">
//             Don't have an account?{" "}
//             <Link to="/register" className="text-purple-600 hover:underline">
//               Sign up
//             </Link>
//           </div>
//           <div className="text-center">
//             <Link to="/" className="text-sm text-gray-600 hover:text-purple-600">
//               ← Back to home
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Login;











// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Link } from "react-router-dom";

// const Login = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center">
//           <div className="flex items-center justify-center space-x-2 mb-4">
//             <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">A</span>
//             </div>
//             <span className="text-xl font-bold text-gray-900">Amplyst</span>
//           </div>
//           <CardTitle className="text-2xl">Welcome back</CardTitle>
//           <CardDescription>
//             Sign in to your account to continue
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input id="email" type="email" placeholder="Enter your email" />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <Input id="password" type="password" placeholder="Enter your password" />
//           </div>
//           <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
//             Sign In
//           </Button>
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <span className="w-full border-t" />
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
//             </div>
//           </div>
//           <Button variant="outline" className="w-full">
//             Continue with Google
//           </Button>
//           <div className="text-center text-sm">
//             Don't have an account?{" "}
//             <Link to="/register" className="text-purple-600 hover:underline">
//               Sign up
//             </Link>
//           </div>
//           <div className="text-center">
//             <Link to="/" className="text-sm text-gray-600 hover:text-purple-600">
//               ← Back to home
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Login;
