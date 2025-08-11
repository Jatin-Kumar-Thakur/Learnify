import React, { use, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';

const CourseDetails = () => {
  const { id } = useParams();
  const {
    allCourses,
    averageRating,
    educatorNameByEducatorId,
    calculateNumberOfLectures,
    calculcateCourseDuration,
    calculcateChapterDuration
  } = useContext(AppContext);
  const [course, setCourse] = useState(null);
  const [educatorName, setEducatorName] = useState(null);
  const [totalLectures, setTotalLectures] = useState(0);
  const [courseDuration, setCourseDuration] = useState('');
  const [openSection, setOpenSection] = useState({});


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
    if (course) {
      const lecturesCount = calculateNumberOfLectures(course);
      setTotalLectures(lecturesCount);
      const duration = calculcateCourseDuration(course);
      setCourseDuration(duration);
    }

  }, [course]);

  const toggleSection = (index) => {
    setOpenSection(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }
  return (
    <>
      <div className='flex px-2 md:px-32 py-10 md:py-20 md:gap-10'>
        {/* //left side */}
        <div className='flex flex-col gap-5 text-left p-3 md:basis-2/3 md:max-w-xl'>
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
              <p className='text-gray-500'>{course?.courseContent.length} sections-{totalLectures} lectures-</p>
            </div>
          </div>
          <div className="">
            {
              course?.courseContent?.map((chapter, index) => (
                <>
                  <div className="flex items-center justify-between border border-gray-300 px-2 md:px-5 py-2  bg-gray-100 gap-2 md:gap-5" key={index}>
                    <div className="flex items-center gap-2 md:gap-5 cursor-pointer" onClick={() => toggleSection(index)}>
                      <img src={assets.down_arrow_icon} alt="down_arrow" className='w-3' />
                      <h1 className='font-semibold text-sm md:text-lg whitespace-nowrap overflow-hidden text-ellipsis'>{chapter.chapterTitle}</h1>
                    </div>
                    <div className="">
                      <p>{chapter?.chapterContent.length} {chapter?.chapterContent.length > 1 ? "lectures" : "lecture"}-{calculcateChapterDuration(chapter)}</p>
                    </div>
                  </div>
                  <div className={`py-3 pr-5 pl-2 border border-gray-300 transition-all duration-300 ${openSection[index] ? 'max-h-96 py-0 block' : 'max-h-0 hidden'}`}>
                    {
                      chapter?.chapterContent?.map((lecture, lectureIndex) => (
                        <div className="flex items-center justify-between" key={lectureIndex}>
                          <div className="flex items-center gap-3 md:p-2 py-2 cursor-pointer">
                            <img src={assets.play_icon} alt="play_icon" />
                            <p className='whitespace-nowrap overflow-hidden text-ellipsis'>{lecture.lectureTitle}</p>
                          </div>
                          <div className=" flex items-center gap-2">
                            {
                              lecture?.isPreviewFree && <span className='text-blue-600 cursor-pointer'>Preview</span>
                            }
                            <p className=''>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>

                </>
              ))
            }

          </div>
        </div>
        {/* //right side */}
        <div className="md:basis-1/3">

        </div>
      </div>
    </>
  )
}

export default CourseDetails
