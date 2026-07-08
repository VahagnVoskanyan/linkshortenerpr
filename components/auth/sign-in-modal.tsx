"use client";

import { SignIn } from "@clerk/nextjs";

export function SignInModal() {
  return (
    <SignIn
      appearance={{ elements: { rootBox: "w-full" } }}
      fallbackRedirectUrl="/dashboard"
    />
  );
}
