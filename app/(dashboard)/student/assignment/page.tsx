import AssignmentTable from "@/app/components/AssignmentTable";
import { fetchMyAssignmentStudent } from "@/server/actions/assignment.actions";


const StudentAssignmentPage = async () => {
  const {data} = await fetchMyAssignmentStudent()
  console.log(data)
  return (
   <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Assignments</h2>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        
          <AssignmentTable tableMode="student_full" assignments={(data || []) as any} />
      </div>
    </section>
  );
};
export default StudentAssignmentPage;
