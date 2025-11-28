"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpDto, TSignUpDto } from "@/common/auth.dto";

const RegisterForm = () => {
  const router = useRouter();
  const [successScreen, setSuccessScreen] = useState(false)
  const [loading, setLoading] = useState(false)

  const levelsMap = {
    LECTURER: ['senior', 'junior', 'professor'],
    STUDENT: ["100", "200", "300", "400", "500", "600"],
    ADMIN: ["SUPER"]
  }
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TSignUpDto>({
    resolver: zodResolver(signUpDto),
  });

  const roleWatcher = watch('role');
  const [serverError, setServerError] = useState<string>();

  const onSubmit = async (formPayload: TSignUpDto) => {
    setLoading(true)

    console.log("form", formPayload)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPayload),
      })
      const json = await res.json()
      console.log('signup response', res.status, json)

      if (!res.ok) {
        setServerError(json.error || json.message || 'Registration failed')
        setLoading(false)
        return
      }

    } catch (e) {
      setServerError((e as Error).message)
      setLoading(false)
      return
    }


  toast.success('Registration successful — please login')
  setLoading(false)
  router.push('/login')


  };

  return (
    <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {!successScreen ? <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">Create your account</h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link href={`/login`} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              Login here
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <input
                placeholder="Fullname"
                {...register('fullname')}
                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${errors.fullname ? "border-red-500" : "border-slate-300 dark:border-slate-700"
                  } bg-gray-50 dark:bg-gray-900 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              />
              {errors.fullname && <p className="mt-1 text-sm text-red-500">{errors.fullname.message}</p>}
            </div>
            {/* Email */}
            <div>
              <input
                placeholder="Email"
                {...register('email')}
                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${errors.email ? "border-red-500" : "border-slate-300 dark:border-slate-700"
                  } bg-gray-50 dark:bg-gray-900 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message || serverError}</p>}
            </div>

            {/* Gender */}
            <div>
              <select

                {...register('gender')}
                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${errors.gender ? "border-red-500" : "border-slate-300 dark:border-slate-700"
                  } bg-gray-50 dark:bg-gray-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              >
                <option value="">Select Gender</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>
              {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>}
            </div>
            {/* Role */}
            <div>
              <select
                {...register('role')}
                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${errors.role ? "border-red-500" : "border-slate-300 dark:border-slate-700"
                  } bg-gray-50 dark:bg-gray-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              >
                <option value="">Select Role</option>
                <option value="LECTURER">LECTURER</option>
                <option value="STUDENT">STUDENT</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
            </div>
            {/* Level */}
            <div>
              <select
                {...register('level')}
                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${errors.level ? "border-red-500" : "border-slate-300 dark:border-slate-700"
                  } bg-gray-50 dark:bg-gray-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              >
                <option value="ADMIN">Select Level</option>
                {levelsMap[roleWatcher]?.map((level) => <option value={level} key={level}>{level.toUpperCase()}</option>)}
              </select>
              {errors.level && <p className="mt-1 text-sm text-red-500">{errors.level.message}</p>}
            </div>

            {/* Password */}
            <div>
              <input
                {...register('password')}
                type="password"
                placeholder="Password"
                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${errors.password ? "border-red-500" : "border-slate-300 dark:border-slate-700"
                  } bg-gray-50 dark:bg-gray-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="Confirm Password"
                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${errors.confirmPassword ? "border-red-500" : "border-slate-300 dark:border-slate-700"
                  } bg-gray-50 dark:bg-gray-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

          </div>
          <div>{serverError}</div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 text-sm font-bold rounded-lg text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div> : <div> Signup successful. you can proceed to login. <Link href="/login">Log in</Link></div>}


    </main>
  );
};

export default RegisterForm;
