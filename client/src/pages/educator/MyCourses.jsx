import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from "../../components/student/Loading"

const MyCourses = () => {
  const { currency, allCourses } = useContext(AppContext)
  const [course, setCourse] = useState(null);
  const fetchEducatorCourses = async () => {
    setCourse(allCourses);
  }
  useEffect(() => {
    fetchEducatorCourses();
  }, [])
  return course ? (
    <div className='min-h-screen flex flex-col items-start justify-between  md:p-8 p-4 pt-8 pb-0'>
      <div className="w-full">
        <h1 className='font-medium text-lg pb-4'>My Courses</h1>
        <table className='w-full'>
          <tr className='text-left border rounded'>
            <th className='p-2'>All Courses</th>
            <th>Earning</th>
            <th>Students</th>
            <th>Published on</th>
          </tr>
          {
            course?.map((item, key) => (
              <tr key={key} className='border text-gray-600'>
                <td className='p-4' ><p className='flex items-center gap-1'><img src={item.courseThumbnail} alt="image" className='w-16 h-auto' /><span className='truncate hidden md:block'>{item.courseTitle}</span></p></td>
                <td>{currency}{Math.floor(item?.enrolledStudents?.length * (item.coursePrice - item.discount * item.coursePrice / 100))}</td>
                <td className=''>{item.enrolledStudents.length}</td>
                <td className=''>{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          }
        </table>
      </div>
    </div>
  ) :
    <Loading />
}

export default MyCourses
