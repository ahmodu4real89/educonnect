import { fetchUsers } from '@/server/actions/user.actions'
import { fetchPaginatedCourses } from '@/server/actions/course.actions'

export default async function AdminPage() {
  // fetch lecturers and courses (admin-protected actions)
  const [{ data: lecturers = [] } = {}, { data: courses = [] } = {}] = await Promise.all([
    fetchUsers('LECTURER', {}),
    fetchPaginatedCourses({ page: 1, pageSize: 12 }),
  ])

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Lecturers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {lecturers?.length ? lecturers.map((l: any) => (
            <div key={l.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center gap-4">
                <img src={l.image || 'https://picsum.photos/80/80'} alt={l.fullname} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <div className="font-semibold">{l.fullname}</div>
                  <div className="text-sm text-gray-600">{l.email}</div>
                  <div className="text-sm text-gray-500 mt-1">Role: {l.role}</div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-gray-600">No lecturers found</div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {courses?.length ? courses.map((c: any) => (
            <div key={c.id} className="bg-white shadow rounded-lg overflow-hidden">
              <img src={c.image || 'https://picsum.photos/300/200?random=2'} alt={c.name} className="w-full h-36 object-cover" />
              <div className="p-4">
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-gray-600">{c.code} • Level {c.level}</div>
                <p className="text-sm text-gray-700 mt-2">{c.description}</p>
              </div>
            </div>
          )) : (
            <div className="text-gray-600">No courses found</div>
          )}
        </div>
      </section>
    </div>
  )
}
