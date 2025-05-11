"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Shared AuthForm component to maintain consistent styling
function AuthForm({
  flow,
  setFlow,
  onSubmit,
  error,
  isLoading,
}: {
  flow: "signIn" | "signUp";
  setFlow: (flow: "signIn" | "signUp") => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
  isLoading: boolean;
}) {
  return (
    <form className="flex flex-col gap-2 w-full" onSubmit={onSubmit}>
      <input
        className="bg-background text-foreground rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
        type="email"
        name="email"
        placeholder="Email"
      />
      <input
        className="bg-background text-foreground rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
        type="password"
        name="password"
        placeholder="Password"
      />
      <button
        className="border-2 border-foreground text-foreground rounded-md p-2 font-medium transition-all hover:bg-foreground hover:text-background focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:outline-none relative"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <span className="flex">
              <span className="animate-bounce mx-0.5 h-1.5 w-1.5 rounded-full bg-current"></span>
              <span className="animate-bounce mx-0.5 h-1.5 w-1.5 rounded-full bg-current" style={{ animationDelay: '0.2s' }}></span>
              <span className="animate-bounce mx-0.5 h-1.5 w-1.5 rounded-full bg-current" style={{ animationDelay: '0.4s' }}></span>
            </span>
          </span>
        ) : (
          flow === "signIn" ? "Sign in" : "Sign up"
        )}
      </button>
      <div className="flex flex-row gap-2">
        <span>
          {flow === "signIn"
            ? "Don't have an account?"
            : "Already have an account?"}
        </span>
        <span
          className="text-foreground underline hover:no-underline cursor-pointer"
          onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
        >
          {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
        </span>
      </div>
      {error && (
        <div className="bg-red-500/20 border-2 border-red-500/50 rounded-md p-2">
          <p className="text-foreground font-mono text-xs">
            Error signing in: {error}
          </p>
        </div>
      )}
    </form>
  );
}

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const welcomeMessage = "Welcome to Kite Hostel App";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    formData.set("flow", flow);
    void signIn("password", formData)
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      })
      .then(() => {
        router.push("/");
      });
  };

  return (
    <div className="flex flex-col gap-8 w-96 mx-auto h-screen justify-center items-center">
      <h1 className="text-xl font-bold">{welcomeMessage}</h1>
      <div className="w-full">
        <AuthForm 
          flow={flow} 
          setFlow={setFlow} 
          onSubmit={handleSubmit} 
          error={error}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
