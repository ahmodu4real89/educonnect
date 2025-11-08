import Link from "next/link";
import { useUser } from "../context/UserContext";
 
const menuItem = [
  {
    icon: "/home.png",
    label: "Dashboard",
    href: "/lecturer", 
  },
  {
    icon: "/course.png",
    label: "Courses",
    href: "/lecturer/courses",
  },
  {
    icon: "/assignment.png",
    label: "Extension Request",
    href: "/lecturer/assignments",
  },
  {
    icon: "/student.png",
    label: "Students",
    href: "/lecturer/students",
  },
];

const Menu = () => {
  const { logout } = useUser();
  return (
    <div className="mt-6 text-lg">
      {menuItem.map((item) => (
        <Link
          href={item.href}
          key={item.label}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
        >
          
          <span className="text-gray-700 font-medium">{item.label}</span>
        </Link>
      ))}

      
              <button
              onClick={logout}
              className="px-4 py-2 text-sm font-bold rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800 transition-colors"
            >
              LogOut
            </button>
    </div>

     );
};

export default Menu;




