"use client";
import { MoreOutlined } from '@ant-design/icons';
import Link from 'next/link';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Form, Input, Modal, Space } from 'antd';
import { useRef, useState } from "react";
import FileUploader from "./widgets/SimpleFileUploader";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from "dayjs";
import { createRequest } from '@/server/actions/request.actions';
import { toast } from 'react-toastify';
// remove antd upload types; using SimpleFileUploader onChange(File|null)

type Assignment = {
  id: string;
  title: string;
  courseId: string;
  description: string | null;
  dueDate: Date;
  course?: {
    name: string,
    code: string
  }
  submissions?: {
    grade: string,
    content: string
  }[]
}

type TFormValues = { date: string, reason: string }


const AssignmentTable = ({ assignments = [], tableMode = 'simple', role = 'student' }: { assignments?: Assignment[] , tableMode?: 'student_full' | 'simple', role?: 'student' | 'lecturer' }) => {
  const [modal, setModal] = useState<'submit_assignment' | 'request_extension' | false>(false)
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null)
  const submissionFile = useRef<File | null>(null)

  const modalTitle = {
    submit_assignment: "Submit assignment",
    request_extension: "Request Extension"
  }

  const [form] = Form.useForm<TFormValues>();

  const raiseRequest = async (data: TFormValues) => {
    const msg = {
      subject: `Request for assignment due date extension to ${data.date}`,
      reason: data.reason
    }
    const { error, message } = await createRequest({ message: JSON.stringify(msg), assignmentId: currentAssignment?.id || '' })
    if (error) {
      return toast.error(error)
    }

    form.resetFields()
    setModal(false)
    return toast.success(message)
  }
  const handleAssignmentSubmission = async () => {
    if (!currentAssignment) return toast.error('No assignment selected')
    const formData = new FormData()

    if (submissionFile.current) {
      const MAX_BYTES = 3 * 1024 * 1024;
      if (submissionFile.current.size && submissionFile.current.size > MAX_BYTES) {
        return toast.error('File too large. Maximum allowed size is 3MB.');
      }
      formData.append('file', submissionFile.current)
      try {
        const res = await fetch(`/api/submission?assignmentId=${currentAssignment.id}`, {
          method: 'POST',
          body: formData,
        })
        const body = await res.json()
        if (!res.ok) {
          return toast.error(body?.error || 'Failed to submit')
        }

        // success
        submissionFile.current = null
        setModal(false)
        return toast.success(body?.message || 'Submission successful')
      } catch (e) {
        return toast.error((e as Error).message)
      }
    }

    return toast.error('No file selected for submission')
  }


  const fileChange = (file: File | null) => {
    submissionFile.current = file;
  }
  const openSubmitAssignmentModal = (item: Assignment) => {
    setCurrentAssignment(item)
    setModal('submit_assignment')

  }
  const openRequestExtensionModal = (item: Assignment) => {
    setCurrentAssignment(item)
    setModal('request_extension')
  }

  return (
    <section className="w-full">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Due Date</th>
              {
                tableMode === "student_full" ?
                  <>
                    <th className="px-6 py-3 text-center">Course</th>
                    <th className="px-6 py-3 text-center">Submission</th>
                    <th className="px-6 py-3 text-center">Grade</th>
                  </> :
                  tableMode == "simple" ? <>
                  </> :
                    <>
                    </>
              }
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
              {assignments.map(item => {
              const items: MenuProps['items'] = [
                {
                  key: '1',
                  label: "Submit",
                  onClick: () => openSubmitAssignmentModal(item)
                },
                {
                  key: '2',
                  label: (
                    <button>
                      Request Extension
                    </button>
                  ),
                  onClick: () => openRequestExtensionModal(item)
                },
              ];
              return <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.title}
                </td>
                <td className="px-6 py-4">
                  {new Date(item.dueDate).toLocaleDateString()}
                </td>


                {
                  tableMode == 'student_full' ? <>
                    <td className="px-6 py-4 text-center">
                      {item.course?.name} [{item.course?.code}]
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.submissions?.[0]?.content}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.submissions?.[0]?.grade || ''}
                    </td>
                  </> :
                    tableMode == 'simple' ?
                      <>
                      </> :
                      <>
                      </>
                }
                <td className="px-6 py-4 text-center space-x-2">
                  {role === 'lecturer' ? (
                    <Link href={`/lecturer/assignments/${item.id}`} className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                      <MoreOutlined />
                      <span>More</span>
                      {/** show count of ungraded submissions if available */}
                      {Array.isArray(item.submissions) && (
                        (() => {
                          const ungraded = item.submissions.filter(s => s.grade == null || s.grade === '').length
                          return ungraded ? <span className="ml-2 inline-block bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">{ungraded}</span> : null
                        })()
                      )}
                    </Link>
                  ) : (
                    <Dropdown menu={{ items }}>
                      <Space>
                        <MoreOutlined />
                      </Space>
                    </Dropdown>
                  )}
                </td>
              </tr>
            }
            )}
          </tbody>
        </table>
        <Modal
          title={modalTitle[modal as Exclude<false, typeof modal>]}
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={Boolean(modal)}
          onOk={() => setModal(false)}
          onCancel={() => setModal(false)}
          footer={null}
        >
          <div className='mb-5 mt-3'>
            <h3 className='text-lg font-semibold'>Course: {currentAssignment?.course?.name}</h3>
            <h3 className='font-semibold'>Assignment: {currentAssignment?.title}</h3>
          </div>
          {
            modal === 'submit_assignment' ?
              <div>
                <FileUploader name='file' multiple={false} onChange={fileChange} />
                <Button htmlType='button' onClick={handleAssignmentSubmission}>Submit Assignment</Button>
              </div> :
              <div>
                <Form<TFormValues> onFinish={raiseRequest} >

                  <label htmlFor="date">Date</label>
                  <Space direction="vertical" className="w-full">
                    <Form.Item
                      name="date"
                      rules={[
                        { required: true, message: "Please select a date!" },
                      ]}
                      getValueProps={(value: string) => ({
                        value: value ? dayjs(value, "DD-MM-YYYY") : undefined,
                      })}
                      normalize={(value: Dayjs | null) =>
                        value ? value.format("DD-MM-YYYY") : ""
                      }
                    >
                      <DatePicker className="w-full" format={{ format: 'DD/MM/YYYY' }} disabledDate={(current) => current && current < dayjs()} />
                    </Form.Item>
                  </Space>
                  <label htmlFor="reason">Reason</label>
                  <Form.Item
                    name="reason"
                    rules={[{ required: true, message: 'Provide a reason' }]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                  <div className='flex justify-between w-full'>
                    <Button htmlType='button' onClick={() => setModal(false)}>Cancel</Button>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </div>
                </Form>
              </div>
          }
        </Modal>
      </div>
    </section>
  );
};

export default AssignmentTable;
