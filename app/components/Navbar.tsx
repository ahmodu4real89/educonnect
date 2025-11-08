"use client"
import Link from "next/link";
import { useUser } from "../context/UserContext";

export const Navbar = () => {
  const { logout } = useUser();
  return (
    <header className="bg-white backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-blue-600 dark:text-blue-400">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              EduConnect
            </h2>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/student"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              DashBoard
            </Link>
            <Link
              href="/student/courses"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/student/assignment"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Assignemts
            </Link>

              <Link
              href="/student/extension"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Request Extension
            </Link>

              <Link
              href="/student/grades"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Grades
            </Link>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-subtle-light dark:hover:bg-subtle-dark transition-colors">
                <svg
                  fill="currentColor"
                  height="20px"
                  width="20px"
                  viewBox="0 0 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
                </svg>
              </button>

              <div
                className="w-10 h-10 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDf8upOwuUOkVVWUKotbej9x7bHZDJ851aXJ1-CqPqivNIDA8s5fEQoxOvjOCwjBaTs5Ls5nZoGdo_seZEXKtlvv4kLVXuPVZJPcVfCaitOSIdHVbkiekHnMyxBQNEL6Y39bqp5MEpxBQiBUvXmUYWW1xLRfU7sKRm5s79_ji3MNpJw1S6FriytLrvQcAYa7r2bcXfr_eTKn8MkghrDta8v1XnlVydguQUgNx1DamIZILdTfAxVn4ZFGZ6lDWoaugDqqTCD05FQgUg')",
                }}
              ></div>

              <button
              onClick={logout}
              className="px-4 py-2 text-sm font-bold rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800 transition-colors"
            >
              LogOut
            </button>
            </div>
        </div>
      </div>
    </header>
  );
};


