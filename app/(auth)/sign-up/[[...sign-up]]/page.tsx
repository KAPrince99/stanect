import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex items-center justify-center min-h-screen  p-6">
      <SignUp routing="path" path="/sign-up" signInUrl="/login" />
    </main>
  );
}
