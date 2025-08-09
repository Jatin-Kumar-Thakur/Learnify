import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import CourseCard from './CourseCard'
import { AppContext } from '../../context/AppContext'

const CourseSection = () => {

  const { allCourses } = useContext(AppContext);
  return (
    <div className='flex flex-col items-center pt-6 pb-16 px-8 md:px-20 w-full text-base text-center gap-2'>
      <h2 className='font-medium text-3xl'>Learn from the best</h2>
      <p className='text-gray-500 text-sm md:text-base mt-3'>Discover our top-rated courses across various categories. From coding and design to <br /> business and wellness, our courses are crafted to deliver results.</p>
      <div className="grid grid-cols-auto px-4 gap-4 md:px-0 md:my-16 my-10">
        {
          allCourses.slice(0, 4).map((course, index) => (
            <CourseCard key={index} props={course} />
          ))
        }
      </div>
      <Link to="/course-list" onClick={() => scrollTo(0, 0)} className='border rounded text-gray-500 md:py-2 py-2 mx-1 md:px-10 px-7  hover:border-gray-600/30'>
        Show all Courses
      </Link>
    </div>
  )
}

export default CourseSection
