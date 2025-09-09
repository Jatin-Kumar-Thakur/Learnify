import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import axios from 'axios';
import Loading from '../../components/student/Loading';
import { toast } from 'react-toastify';
const Dashboard = () => {
  const { enrolledStudents, currency, backend_url, isEducator, getToken } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backend_url + '/api/educator/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (data.success) {
        setDashboardData(data.dashBoardData);
      }
      else {
        toast.error(data.message);
      }
    }
    catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator])
  return dashboardData ? (
    <div className='px-8'>
      <div className="flex items-center gap-4 py-8">
        <div className="flex items-center text-gray-600 border border-blue-800 py-4 px-3 min-w-48 gap-2 rounded">
          <img src={assets.patients_icon} alt="image" className='w-8 h-8' />
          <div className="">
            <p className='font-medium text-xl'>{dashboardData?.enrolledStudentsData?.length}</p>
            <p>Total Enrollments</p>
          </div>
        </div>
        <div className="flex items-center text-gray-600 border border-blue-800 py-4 px-3 min-w-48 gap-2 rounded">
          <img src={assets.my_course_icon} alt="image" className='w-8 h-8' />
          <div className="">
            <p className='font-medium text-xl'>{dashboardData?.totalCourses}</p>
            <p>Total Courses</p>
          </div>
        </div>
        <div className="flex items-center text-gray-600 border border-blue-800 py-4 px-3 min-w-48 gap-2 rounded">
          <img src={assets.earning_icon} alt="image" className='w-8 h-8' />
          <div className="">
            <p className='font-medium text-xl'>{currency} {dashboardData?.totalEarning}</p>
            <p>Total Earnings</p>
          </div>
        </div>
      </div>
      <div className="">
        <h1 className='font-medium text-lg'>Latest Enrollments</h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border rounded">
              <th className="p-2">#</th>
              <th>Student name</th>
              <th>Course Title</th>
              {/* <th>Date</th> */}
            </tr>
          </thead>
          <tbody>
            {dashboardData?.enrolledStudentsData?.map((item, key) => (
              <tr key={key} className="border">
                <td className="p-4">{key + 1}</td>
                <td>
                  <p className="flex items-center gap-1">
                    <img
                      src={item.student.imageUrl}
                      alt="student"
                      className="w-8 h-8 rounded-full"
                    />
                    {item.student.name}
                  </p>
                </td>
                <td>{item.courseTitle}</td>
                {/* <td>{item.purchaseDate.slice(0, 10)}</td> */}
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
    :
    <Loading />
}

export default Dashboard
