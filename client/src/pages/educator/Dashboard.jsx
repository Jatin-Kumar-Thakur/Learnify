import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
const Dashboard = () => {
  const { enrolledStudents , currency } = useContext(AppContext);
  const dashboardFields = [
    { name: "Total Enrollments", number: 14, image: assets.patients_icon },
    { name: "Total Courses", number: 8, image: assets.my_course_icon },
    { name: "Total Earnings", number: `${currency}245`, image: assets.earning_icon },
  ]
  return (
    <div className='px-8'>
      <div className="flex items-center gap-4 py-8">
        {
          dashboardFields?.map((item) => (
            <div className="flex items-center text-gray-600 border border-blue-800 py-4 px-3 min-w-48 gap-2 rounded" key={item.name}>
              <img src={item.image} alt="image" className='w-8 h-8' />
              <div className="">
                <p className='font-medium text-xl'>{item.number}</p>
                <p>{item.name}</p>
              </div>
            </div>
          ))
        }
      </div>
      <div className="">
        <h1 className='font-medium text-lg'>Latest Enrollments</h1>
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
                <td>{item.purchaseDate.slice(0,10)}</td>
              </tr>
            ))
          }
        </table>
      </div>
    </div>
  )
}

export default Dashboard
