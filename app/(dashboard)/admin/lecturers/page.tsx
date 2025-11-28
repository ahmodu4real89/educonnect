import { fetchUsers } from "@/server/actions/user.actions";

export default async function LecturerList() {

  const {data: lecturers} = await fetchUsers('LECTURER', {})
  

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Lecturers</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {lecturers?.map((lecturer) => (
              <tr key={lecturer.id} className="border-t">
                <td className="px-4 py-2">{lecturer.fullname}</td>
                <td className="px-4 py-2 text-gray-600">{lecturer.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
