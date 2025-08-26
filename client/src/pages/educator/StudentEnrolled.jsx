import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext';

const StudentEnrolled = () => {

  const { enrolledStudents } = useContext(AppContext);

  return (
    <div className='min-h-screen flex flex-col items-start justify-between  md:p-8 p-4 pt-8 pb-0'>
      <div className="w-full">
        <h1 className='font-medium text-lg pb-4'>Students Enrolled</h1>
        <table className='w-full'>
          <tr className='text-left border rounded'>
            <th className='p-2'>#</th>
            <th>Student name</th>
            <th>Course Title</th>
            <th>Date</th>
          </tr>
          {
            enrolledStudents?.map((item, key) => (
              <tr key={key} className='border'>
                <td className='p-4'>{key + 1}</td>
                <td ><p className='flex items-center gap-1'><img src={item.student.imageUrl} alt="image" className='w-8' />{item.student.name}</p></td>
                <td>{item.courseTitle}</td>
                <td>{item.purchaseDate.slice(0, 10)}</td>
              </tr>
            ))
          }
        </table>
      </div>
    </div>
  )
}

export default StudentEnrolled
