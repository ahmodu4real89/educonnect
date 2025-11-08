
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { toast } from "react-toastify";
import { loginSchema } from "@/app/lib/validations"; 
import { auth } from "../lib/auth";
import { authClient } from "../lib/auth-client";

const LoginPage = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "STUDENT";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as "email" | "password";
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }


    setErrors({});
    setLoading(true);
    try {
       await authClient.signIn.email({
          email: formData.email,
          password: formData.password
        })
        
       const {data} =  await authClient.getSession()
       if(!data?.user){
        toast.error("Email or Password is incorrect")
        return
       }
        toast.success("Login successful!");
        if(data?.user){
          data.user && setUser(data.user);
          if (data.user.role === "STUDENT") {
            router.push("/student");
            return
          } else if (data.user.role === "LECTURER") {
            router.push("/lecturer");
          } else {
            router.push("/");
          }
        }
        

    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center py-12 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg dark:shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Log in to manage your assignments.
          </p>
        </div>

        {/* FORM */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            {/* Email Field */}
            <div>
              <input
                className={`relative block w-full appearance-none rounded-t-lg border ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-transparent px-3 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                id="email-address"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <input
                className={`relative block w-full appearance-none rounded-b-lg border ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-transparent px-3 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                type="password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="block w-full text-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Redirect to Signup */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push(`/register?role=${role}`)}
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
