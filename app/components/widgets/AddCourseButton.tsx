"use client"
import { useState } from 'react';
import { Modal } from 'antd';
import CourseForm from './CourseForm';

export default function AddCourseButton() {

  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <>
      <button
        onClick={showModal}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        + Create Course
      </button>
      <Modal
        open={open}
        title="Create New Course"
        onCancel={closeModal}
        footer={null}
        destroyOnHidden
      >
        <CourseForm mode='add' done={closeModal} />
      </Modal>
    </>
  )
}
