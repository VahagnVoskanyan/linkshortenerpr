"use client";

import { SignUp } from "@clerk/nextjs";

export function SignUpModal() {
  return (
    <SignUp
      appearance={{ elements: { rootBox: "w-full" } }}
      fallbackRedirectUrl="/dashboard"
    />
  );
}
