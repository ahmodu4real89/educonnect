"use client"
import { createCourseDto, TCreateCourse } from '@/common/course.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import FormError from '../ui/FormError';
import { Select } from 'antd';
import FileUploader from './FileUploader';
import { toast } from 'react-toastify';
import { createCourse } from '@/server/actions/course.actions';

type CourseFormProp =  {
  mode: "add" | "edit",
  done: () => void,
  initalValues?: {}
}

export default function CourseForm({mode, done, initalValues}: CourseFormProp) {

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TCreateCourse>({
    resolver: zodResolver(createCourseDto),
    defaultValues: initalValues
  });

  const router = useRouter();

  const onSubmit = async (data: TCreateCourse) => {
    if(mode == 'add'){
      try {
        await createCourse(data)
        // refresh server components so admin course list updates automatically
        router.refresh()
        done()
        toast.success("Course added successfully")
      } catch (err: any) {
        toast.error(err?.message || 'Failed to create course')
      }
    }else{
      try {
        // For edit mode we currently just close the modal; refresh to pick up changes
        // once update logic is added server-side.
        router.refresh()
        done()
        toast.success("Course updated successfully")
      } catch (err: any) {
        toast.error(err?.message || 'Failed to update course')
      }
    }
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* Course Title */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register("name")}
          placeholder="Enter course title"
          className={`w-full px-4 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"
            } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
        />
        <FormError message={errors.name?.message} />
      </div>

      {/* Course Image */}
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course Image URL
        </label>
        <FileUploader />
        <FormError message={errors.image?.message} />
      </div>
      {/* <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course Image URL
            </label>
            <input
              type="text"
              id="image"
              {...register("image")}
              placeholder="Enter image URL"
              className={`w-full px-4 py-2 border ${errors.image ? "border-red-500" : "border-gray-300"
                } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
            />
            <FormError message={errors.image?.message} />
          </div> */}
      {/* Course Code */}
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course Code
        </label>
        <input
          type="text"
          id="image"
          {...register("code")}
          placeholder="Enter course code"
          className={`w-full px-4 py-2 border ${errors.code ? "border-red-500" : "border-gray-300"
            } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
        />
        <FormError message={errors.code?.message} />
      </div>
      {/* Course Level */}
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course Level
        </label>
        <Select
          onChange={(v) => { setValue('level', v) }}
          className="w-full"
          options={[
            { value: '100', label: <span>100</span> },
            { value: '200', label: <span>200</span> },
            { value: '300', label: <span>300</span> },
            { value: '400', label: <span>400</span> },
            { value: '500', label: <span>500</span> },
            { value: '600', label: <span>600</span> },
          ]}
        />
        <FormError message={errors.level?.message} />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description")}
          placeholder="Enter course description (optional)"
          className={`w-full px-4 py-2 border ${errors.description ? "border-red-500" : "border-gray-300"
            } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none`}
        ></textarea>
        <FormError message={errors.description?.message} />
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-md hover:bg-blue-700 transition"
        >
          Create Course
        </button>
      </div>
    </form>
  )
}
