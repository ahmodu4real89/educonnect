// export interface CourseRes {
//   id: number;
//   courseName: string;
//   courseCode: string;
//    description: string;
//   image?: string;
//   lecturer?: {
//     name: string;
//     email: string;
//   };
// }


export interface CourseRes {
  id: string;
  name: string;
  code: string;
   description: string;
   level:string;
  image?: string;
  lecturer?: {
    name: string;
    email: string;
  };
}


export interface CourseWithImage extends CourseRes {
  image: string;
}

export interface CourseGridProps {
  apiEndpoint: string;
  title?: string;
  limit?: number;
 linkPrefix?: string;
  onEdit?: (course: CourseRes) => void;
  onDelete?: (courseId: number) => void;
}


export interface Student {
  id: string;
  name: string;
  email: string;
}


export interface Submission {
  id: string;
  assignmentId:string;
  studentId: string;
  filePath: string;
  submissionDate: string;
  grade: number | null;
  feedback: string | null;
  status: string;
  student: Student;
  assignment: {
    title: string;
    course: { courseName: string };
    dueDate: string;
  };
}



// export interface Assignment {
//   id: string;
//   title: string;
//   description: string;
//   dueDate: string;
//   submissions: Submission[];
//   course:Course
//   status: string
//   extensible:boolean
// }



// export interface Lecturer {
//   id: string;
//   name: string;
//   email: string;
// }


export interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  createdAt: string
  extensible: boolean
  lecturerId: string
  courseId: string
}


// export interface CourseRes {
//   id: string ;
//   name: string;
//   description: string;
//   assignments: Assignment[];
// }



export interface CourseRes {
  id: string;
  name: string;
  code: string;
   description: string;
   level:string
  image?: string;
 
}

export interface Students {
    id:string;
  name: string;
  email: string;
  phoneNumber: string;
  sex: string;
  age: string;
};



export interface deadline  {
  id: string
  courseId: string
  title: string
  description: string
  extensible: boolean,
  dueDate: string
  course: Course
  status: string
}

export interface Course {
  id: string
  name: string
  code: string
  description: string
  lecturerId: number
  createdAt: string
  updatedAt: string
}



export interface Extension {
  id: string;
  studentId: string;
  assignmentId: string;
  reason: string;
  requestedDate?: string;
  status: string;
  createdAt: string;
  student: Student;
  assignment: Assignment;
}
