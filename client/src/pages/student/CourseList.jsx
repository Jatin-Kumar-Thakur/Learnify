import React, { useContext, useEffect, useState } from 'react'
import SearchBar from '../../components/student/SearchBar'
import { AppContext } from '../../context/AppContext';
import CourseCard from '../../components/student/CourseCard';
import Footer from '../../components/student/Footer';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';

const CourseList = () => {
  const { allCourses, navigate } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourses, setFilteredCourses] = useState(allCourses);

  const handleFilter = () => {
    setFilteredCourses(allCourses);
    navigate('/course-list');
  }
  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      if (input) {
        const searchTerm = input.toLowerCase();
        const filtered = allCourses.filter(course =>
          course?.courseTitle?.toLowerCase().includes(searchTerm) ||
          course?.courseDescription?.toLowerCase().includes(searchTerm)
        );
        setFilteredCourses(filtered);
      } else {
        setFilteredCourses(allCourses);
      }

    }
  }, [allCourses, input]);
  return (
    <>
      <div className=' px-10 md:px-32 py-10'>
        <div className="flex justify-between items-center">
          <h1 className='font-semibold text-2xl'>Course List</h1>
          <SearchBar data={input} />
        </div>
        {
          input &&
          <div className="">
            <span className='flex gap-2 border rounded w-fit px-3 py-1'>{input} <img onClick={handleFilter} src={assets.cross_icon} alt="cross_icon" className=' cursor-pointer' /></span>
          </div>
        }
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-flow-cols-4 px-4 gap-4 md:px-0 md:my-16 my-10">
          {
            filteredCourses.map((course, index) => (
              <CourseCard key={index} props={course} />
            ))
          }
        </div>
        {/* <div className="flex justify-center items-ce
      nter my-10">
          <button className='border rounded text-gray-500 md:py-2 py-2 mx-1 md:px-10 px-7  hover:border-gray-600/30'>
            Load more
          </button>
        </div> */}
      </div>
      <Footer />
    </>
  )
}

export default CourseList
