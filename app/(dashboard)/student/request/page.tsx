"use client";
import React from "react";

 const  RequestExtensionPage = ()=> {
  return (
    <div className="min-h-screen flex flex-col font-display bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 text-primary">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                EduConnect
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {["Dashboard", "Courses", "Assignments", "Grades", "Messages"].map(
                (item, i) => (
                  <a
                    key={i}
                    href="#"
                    className={`text-sm font-medium transition-colors ${
                      item === "Assignments"
                        ? "text-primary"
                        : "text-gray-600 dark:text-gray-300 hover:text-primary"
                    }`}
                  >
                    {item}
                  </a>
                )
              )}
            </nav>

            {/* Profile */}
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDUTli5cav6A5Ymgpupn2vYZ8SsmVwNLON_hmPw7St3Bh4Fx8SYNYKioZqggrM2e_Ag3K6UsLZHjmu4DoJGBZ1BW2FNSTS7Ia3cO2IfHYGlkx-WyUGm8OXD2MhqN9Qtojh0N5UJJlKkdahUSdU2gaYl4ftL51zX3udd18QGeftKv_PQTXcIeJIoVQXCu0PtwkES12g4eqqHM_mY2c_qBAktAiaoQP_W-jmqORGA9pFNJMbR4u89Moksb2pe1st_iyqOP1hFCw2Ty5U")',
                }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Request Assignment Extension
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Fill out the form below to request an extension for your
              assignment.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 sm:p-8">
            <form className="space-y-6">
              {/* Assignment */}
              <div>
                <label
                  htmlFor="assignment"
                  className="block text-sm font-medium mb-1"
                >
                  Assignment
                </label>
                <select
                  id="assignment"
                  name="assignment"
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option>Select an assignment...</option>
                  <option>History Essay - The Renaissance</option>
                  <option>Calculus Problem Set 3</option>
                  <option>Physics Lab Report - Kinematics</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium mb-1"
                >
                  Reason for Extension
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={5}
                  placeholder="Please provide a clear and concise reason for your request."
                  className="w-full bg-transparent border border-gray-300  rounded-md px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:outline-none"
                ></textarea>
              </div>

              {/* New Deadline */}
              <div>
                <label
                  htmlFor="new-deadline"
                  className="block text-sm font-medium mb-1"
                >
                  Suggested New Deadline
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <span className="material-symbols-outlined">
                      calendar_today
                    </span>
                  </span>
                  <input
                    id="new-deadline"
                    name="new-deadline"
                    type="text"
                    placeholder="e.g., October 25, 2024"
                    className="w-full pl-10 bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 text-white bg-primary rounded-lg font-medium hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default  RequestExtensionPage