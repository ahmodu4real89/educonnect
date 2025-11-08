import { Students } from "@/app/lib/types";

const Student = async () => {
  
  const baseUrl =process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}`: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/register`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch students");
  }
  const data:Students[] = await res.json();

  return (
    <div className="m-10 p-4 w-7xl">
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">All Students</h2>

        <div className="bg-white rounded-sm shadow overflow-hidden">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone Number</th>
                <th className="py-3 px-6 text-left">Sex</th>
                <th className="py-3 px-6 text-left">Age</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((student: Students) => (
                  <tr className="border-t" key={student.id}>
                    <td className="py-3 px-6">{student.name}</td>
                    <td className="py-3 px-6">{student.email}</td>
                    <td className="py-3 px-6">{student.phoneNumber}</td>
                    <td className="py-3 px-6">{student.sex}</td>
                    <td className="py-3 px-6">{student.age}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500 italic">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Student;
