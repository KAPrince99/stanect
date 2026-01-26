import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

export default function SuccessView({ planName }: { planName: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="bg-green-100 p-4 rounded-full mb-6">
        <CheckCircleIcon className="w-16 h-16 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Payment Successful!
      </h1>
      <p className="text-gray-600 mb-8 max-w-sm">
        Welcome to the{" "}
        <span className="font-semibold text-gray-900 uppercase">
          {planName}
        </span>{" "}
        tier. Your account features have been unlocked.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <Link
          href="/dashboard"
          className="w-full py-3 px-6 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
