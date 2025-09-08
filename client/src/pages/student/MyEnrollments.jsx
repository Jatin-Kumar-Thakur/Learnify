import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Line } from "rc-progress"
import Footer from '../../components/student/Footer'
import axios from 'axios';
import { toast } from 'react-toastify';

function MyEnrollments() {
  const { enrolledCourses, calculcateCourseDuration, navigate, userData, backend_url, fetchAllEnrolledCourses, getToken, calculateNumberOfLectures } = useContext(AppContext);
  const [progressArray, setProgressArray] = useState([])
  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(backend_url + `/api/user/get-course-progress`, { courseId: course._id }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          let totalLecture = calculateNumberOfLectures(course);
          let lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;
          return { lectureCompleted, totalLecture };
        }
        ));
      setProgressArray(tempProgressArray);

    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    if (userData) {
      fetchAllEnrolledCourses();
    }
  }, [userData])

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [userData])
  return (
    <>
      <div className='md:px-36 px-8 pt-10 mb-10 min-h-[80vh]'>
        <h1 className='font-semibold text-2xl'>My Enrollments</h1>
        <table className='md:table-auto table-fixed w-full overflow-hidden border mt-10'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
            <tr>
              <th className='px-4 py-3 font-semibold truncate '>Course</th>
              <th className='px-4 py-3 font-semibold truncate '>Duration</th>
              <th className='px-4 py-3 font-semibold truncate '>Completed</th>
              <th className='px-4 py-3 font-semibold truncate '>Status</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {
              enrolledCourses?.map((course, index) => (
                <tr key={index} className='border-b border-gray-500/20 text-left'>
                  <td className='md:px-4 pl-2 md:pl-4 py-3 space-x-3 flex items-center gap-3'>
                    <img src={course?.courseThumbnail} alt="courseThumbnail" className='w-15 sm:w-24 md:w-28' />
                    <div className="flex-1">
                      <p className='mb-1 max-sm:text-sm'>
                        {course.courseTitle}
                      </p>
                      <Line strokeWidth={2} percent={progressArray[index] ? (progressArray[index].lectureCompleted / progressArray[index].totalLecture) * 100 : 0} className='bg-gray-300 rounded-full' />
                    </div>
                  </td>
                  <td className='px-4 py-3 max-sm:hidden'>
                    {calculcateCourseDuration(course)}
                  </td>
                  <td className='px-4 py-3 max-sm:hidden'>
                    {progressArray[index] &&
                      `${progressArray[index].lectureCompleted}/${progressArray[index].totalLecture}`
                    }
                    <span> Lectures</span>
                  </td>
                  <td className='px-4 py-3 max-sm:text-right'>
                    {
                      <button className='bg-blue-600 border px-4 py-2 text-white' onClick={() => navigate('/player/' + course?._id)}>
                        {
                          progressArray[index] &&
                            progressArray[index].lectureCompleted == progressArray[index].totalLecture ? "Completed" : "Ongoing"
                        }
                      </button>
                    }
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  )
}

export default MyEnrollments
