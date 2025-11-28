
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginDto, TLoginDto } from "@/common/auth.dto";
import { useForm } from "react-hook-form";
import FormError from "../components/ui/FormError";

import {  useState, useTransition } from "react";
// import { useFormStatus } from "react-dom";
import { login } from "@/server/actions/auth.actions";
import Link from "next/link";
import { useFormValueChange } from "../lib/hooks";
import { useRouter } from "next/navigation";
import { storage } from "@/common/lib";


const LoginPage = () => {
  const [serverError, setServerError] = useState('')
  const [submitStatus, setSubmitStatus] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    subscribe,
    formState: { errors },
  } = useForm<TLoginDto>({
    resolver: zodResolver(loginDto),

  });


  useFormValueChange(subscribe, () => setServerError(''), submitStatus)

  const handleLogin = (credentials: TLoginDto) => {
    setSubmitStatus(true)
    startTransition(async () => {
      const { data:user, message, error } = await login(credentials)
      setServerError(error || '')
      storage.set('user', user)
      switch (user?.role) {
        case 'STUDENT':
          router.push('/student')
          break;
        case 'LECTURER':
          router.push('/lecturer')
          break;
        case 'ADMIN':
          router.push('/admin')
          break;
      
        default:
          break;
      }
    })
  }

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
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleLogin)}>
          <div className="space-y-4 rounded-md shadow-sm">
            {/* Email Field */}
            <div>
              <input
                className={`relative block w-full appearance-none rounded-t-lg border ${errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
                  } bg-transparent px-3 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                id="email-address"
                placeholder="Email"
                type="email"
                {...register('email')}
              />
              <FormError message={errors.email?.message}></FormError>
            </div>

            {/* Password Field */}
            <div>
              <input
                className={`relative block w-full appearance-none rounded-b-lg border ${errors.password
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
                  } bg-transparent px-3 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                id="password"
                placeholder="Password"
                {...register('password')}
                type="password"
              />
              <FormError message={errors.password?.message}></FormError>
            </div>
          </div>
          {serverError && <div className="p-1 bg-blue-300 border border-red-500 rounded-sm">{serverError}</div>}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="block w-full text-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
          >
            {isPending ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Redirect to Signup */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/register"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
