"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Cards = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/login`);
  };

  return (
    <div className=" dark:bg-gray-900 font-sans text-slate-800 dark:text-slate-200 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome to Assignment Manager</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">Choose your role to get started.</p>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => handleClick()}
              className="block w-full text-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300"
            >
              Student
            </button>

            <button
              onClick={() => handleClick()}
              className="block w-full text-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold py-3 px-4 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300"
            >
              Lecturer
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Log In
              </Link>
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              New here?{" "}
              <Link href="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
