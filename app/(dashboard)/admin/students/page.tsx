import { fetchUsers } from "@/server/actions/user.actions";

export default async function StudentList() {
  const {data: students} = await fetchUsers('STUDENT', {})
  // const students = [
  //   { id: 1, name: "Alice Green", email: "alice@example.com" },
  //   { id: 2, name: "Bob Brown", email: "bob@example.com" },
  // ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Students</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {students?.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-4 py-2">{s.fullname}</td>
                <td className="px-4 py-2 text-gray-600">{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
