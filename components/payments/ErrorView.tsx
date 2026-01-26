import { XCircleIcon } from "lucide-react";
import Link from "next/link";

interface ErrorViewProps {
  message?: string;
}

export default function ErrorView({ message }: ErrorViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-2xl shadow-sm border border-red-50">
      <div className="bg-red-100 p-4 rounded-full mb-6">
        <XCircleIcon className="w-16 h-16 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
      <p className="text-gray-600 mb-8 max-w-sm">
        {message ||
          "We couldn't process your transaction. This might be due to insufficient funds or an expired card."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <Link
          href="/pricing"
          className="w-full py-3 px-6 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
        >
          Try Again
        </Link>
        <Link
          href="/support"
          className="w-full py-3 px-6 bg-white text-gray-700 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
