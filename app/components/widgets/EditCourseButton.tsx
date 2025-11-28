"use client"
import { Dropdown, MenuProps, Modal, Space, Select } from 'antd'
import Link from 'next/link';
import { MoreOutlined } from '@ant-design/icons';
import CourseForm from './CourseForm';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';


type TModalMode = "assign_course" | "deassign_course" | "edit_course" | "create_course"
export default function EditCourseButton({course}: {course: any}) {
  const [open, setOpen] = useState(false);
  const [modalMode, setMode] = useState<TModalMode>('edit_course');
  const modalTitle = {
    create_course: "Create new course",
    edit_course: "Edit new course",
    assign_course: "Assign course",
    deassign_course: "Deassign course"
  }


  const closeModal = () => setOpen(false);

  const invokeModal = (action: TModalMode ) => {
    setMode(action)
    setOpen(true)
  }
 

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <button  onClick={() => invokeModal('edit_course')}>
          Edit Course
        </button>
      ),
    },
    {
      key: '2',
      label: (
        <button  onClick={() => invokeModal('assign_course')}>
          Assign Course
        </button>
      ),
    },
    {
      key: '3',
      label: (
        <button  onClick={() => invokeModal('deassign_course')}>
          De-assign Course
        </button>
      ),
    },
  ];
  return (
    <>
      <Dropdown menu={{ items }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <MoreOutlined />
          </Space>
        </a>
      </Dropdown>
      <Modal
        open={open}
        title={modalTitle[modalMode]}
        onCancel={closeModal}
        footer={null}
        destroyOnHidden
      >
        {
          modalMode == 'create_course' ? <CourseForm mode='add' done={closeModal} />:
          modalMode == 'edit_course' ? <CourseForm mode='edit' initalValues={course} done={closeModal} /> :
          modalMode == 'assign_course' ? 
          <AssignSection course={course} close={closeModal} /> : 
          modalMode == 'deassign_course' ?
          <DeassignSection course={course} close={closeModal} /> :
          <>
          <h3 className='text-lg'>Title: {course?.name}</h3>
          <p>Code: {course?.code}</p>
          </>
        }
        
        

      </Modal>
    </>
  )
}

function AssignSection({ course, close }: { course: any, close: () => void }){
  const [lecturers, setLecturers] = useState<any[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/lecturers').then(r => r.json()).then(d => setLecturers(d.data || []))
  }, [])

  const handleAssign = async () => {
    if(!selected) return toast.error('Select a lecturer')
    const res = await fetch('/api/admin/assign-course', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId: course.id, lecturerId: selected }) })
    const json = await res.json()
    if(res.ok) {
      toast.success('Lecturer assigned')
      close()
    } else {
      toast.error(json?.error || json?.message || 'Failed to assign')
    }
  }

  return (
    <div>
      <h3 className='text-lg'>Title: {course?.name}</h3>
      <p className='mb-3'>Code: {course?.code}</p>
      <Select className='w-full mb-4' placeholder='Select a lecturer' onChange={(v) => setSelected(String(v))} options={lecturers.map(l => ({ label: `${l.fullname} (${l.email})`, value: l.id }))} />
      <div className='flex space-x-2'>
        <button onClick={handleAssign} className='px-4 py-2 bg-blue-600 text-white rounded'>Assign</button>
        <button onClick={close} className='px-4 py-2 bg-gray-200 rounded'>Cancel</button>
      </div>
    </div>
  )
}

function DeassignSection({ course, close }: { course: any, close: () => void }){
  const [assigned, setAssigned] = useState<any[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/course/${course.id}/lecturers`).then(r => r.json()).then(d => setAssigned(d.data || []))
  }, [course.id])

  const handleDeassign = async () => {
    if(!selected) return toast.error('Select a lecturer')
    const res = await fetch('/api/admin/deassign-course', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId: course.id, lecturerId: selected }) })
    const json = await res.json()
    if(res.ok) {
      toast.success('Lecturer de-assigned')
      close()
    } else {
      toast.error(json?.error || json?.message || 'Failed to deassign')
    }
  }

  return (
    <div>
      <h3 className='text-lg'>Title: {course?.name}</h3>
      <p className='mb-3'>Code: {course?.code}</p>
      <Select className='w-full mb-4' placeholder='Select assigned lecturer' onChange={(v) => setSelected(String(v))} options={assigned.map(a => ({ label: `${a.lecturer.fullname} (${a.lecturer.email})`, value: a.lecturerId }))} />
      <div className='flex space-x-2'>
        <button onClick={handleDeassign} className='px-4 py-2 bg-red-600 text-white rounded'>De-assign</button>
        <button onClick={close} className='px-4 py-2 bg-gray-200 rounded'>Cancel</button>
      </div>
    </div>
  )
}
