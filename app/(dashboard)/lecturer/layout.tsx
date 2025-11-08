"use client";
import { useUser } from "@/app/context/UserContext";
import Menu from "../../components/Menu";
import Image from "next/image";

const DashboardLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { user } = useUser();
  return (
    <div className="h-screen flex">
      <div className="w-[14%] md:w-[14%] lg:w[16%] xl:w:[14%] p-4">
        <div className="flex items-center space-x-3 mb-10">
          <Image width={300} height={300} src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
          <div>
            <h2 className="font-semibold text-gray-800">{user?.name || "Admin"}</h2>
          </div>
        </div>
        <Menu />
      </div>

      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll  flex flex-col">{children}</div>
    </div>
  );
};

export default DashboardLayout;
