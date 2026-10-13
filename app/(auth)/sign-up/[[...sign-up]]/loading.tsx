import { AuthRouteLoading } from "@/components/ui/auth/AuthSkeleton";

export default function Loading() {
  return (
    <main className="flex items-center justify-center min-h-screen py-10 px-4 md:py-12 overflow-y-auto">
      <AuthRouteLoading mode="signup" />
    </main>
  );
}
