import React, { use, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const CourseDetails = () => {
  const { id } = useParams();
  const { allCourses, currency, averageRating, educatorNameByEducatorId } = useContext(AppContext);
  const [course, setCourse] = useState(null);
  const [educatorName, setEducatorName] = useState(null);

  const getCourseById = (id) => {
    const data = allCourses.find(course => course._id == id);
    console.log("Course Data:", data);
    setCourse(data);
  }
  useEffect(() => {
    if (id) {
      getCourseById(id);
    }
  }, [id, allCourses]);
  useEffect(() => {
    if (course?.educator) {
      const name = educatorNameByEducatorId(course?.educator);
      setEducatorName(name);
    }

  }, [course, course?.educator]);
  return (
    <>
      <div className='flex px-8 md:px-32 py-10 md:py-20 gap-10'>
        {/* //left side */}
        <div className='flex flex-col gap-5 text-left p-3 basis-2/3 max-w-xl'>
          <h1 className='font-semibold text-3xl'>{course?.courseTitle}</h1>
          <p className='text-md text-gray-500'>{course?.courseDescription}</p>
          <div>
            <div className="flex items-center space-x-2">
              <p>{averageRating(course?.courseRatings)}</p>
              <div className="flex items-center ml-2 text-sm">
                {
                  [...Array(5)].map((_, index) => (
                    <span key={index} className={`text-yellow-500 ${index < 4 ? 'text-yellow-500' : 'text-gray-300'}`}>
                      <img src={index < Math.floor(averageRating(course?.courseRatings)) ? assets.star : assets.star_blank} alt="star" className=' w-[14px]' />
                    </span>
                  ))
                }
              </div>
              <p className='pl-1 text-gray-500 '>( {course?.courseRatings.length} {course?.courseRatings.length > 1 ? `ratings` : `rating`} )</p>
            </div>
            <p className='text-gray-500 mt-1'>Course by <span className='text-blue-600 underline'>{educatorName}</span></p>
          </div>
          <div className="mt-5">
            <div className="">
              <h1 className='font-semibold text-xl'>Course Structure</h1>
              <p className='text-gray-500'>{course?.courseContent.length} sections-</p>
            </div>
          </div>
        </div>
        {/* //right side */}
        <div className="basis-1/3">

        </div>
      </div>
    </>
  )
}

export default CourseDetails
