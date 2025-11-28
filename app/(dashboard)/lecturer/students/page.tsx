import { User } from "@prisma/client";

const Student = async () => {

  const data: User[] = []
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
                data.map((student) => (
                  <tr className="border-t" key={student.id}>
                    <td className="py-3 px-6">{student.fullname}</td>
                    <td className="py-3 px-6">{student.email}</td>
                    <td className="py-3 px-6">{student.gender}</td>
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
