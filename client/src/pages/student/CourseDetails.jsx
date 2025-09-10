import React, { use, useContext, useEffect, useState } from 'react'
import Footer from '../../components/student/Footer'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import Loading from '../../components/student/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';

const CourseDetails = () => {
  const { id } = useParams();
  const {
    allCourses,
    averageRating,
    educatorNameByEducatorId,
    calculateNumberOfLectures,
    calculcateCourseDuration,
    calculcateChapterDuration,
    currency,
    backend_url,
    userData,
    getToken
  } = useContext(AppContext);
  const [course, setCourse] = useState(null);
  const [educatorName, setEducatorName] = useState(null);
  const [totalLectures, setTotalLectures] = useState(0);
  const [courseDuration, setCourseDuration] = useState('');
  const [openSection, setOpenSection] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);


  const getCourseById = async () => {
    try {
      const { data } = await axios.get(backend_url + '/api/course/' + id);
      if (data.success) {
        setCourse(data.courseData);
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const enrollCourse = async () => {
    try {
      if (!userData) {
        toast.warn("Please login to enroll the course");
        return;
      }
      if (isEnrolled) {
        toast.info("You are already enrolled in this course");
        return;
      }
      const token = await getToken();
      const { data } = await axios.post(backend_url + '/api/user/purchase', { courseId: course?._id }, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        const { success_url } = data;
        toast.success(data.message);
        window.location.replace(success_url);
        setIsEnrolled(true);
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    getCourseById();
  }, []);
  useEffect(() => {
    if (userData && course) {
      setIsEnrolled(userData.enrolledCourses.includes(course._id) ? true : false);
    }
  }, [userData, course]);

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
      {
        !course ? <Loading /> :
          <>
            <div className='flex flex-col-reverse md:flex-row px-2 md:px-32 py-10 md:py-20 md:gap-10'>
              {/* //left side */}
              <div className='flex flex-col gap-5 text-left p-3 md:max-w-xl'>
                <h1 className='font-semibold text-3xl'>{course?.courseTitle}</h1>
                <p className='text-md text-gray-500'>{course?.courseDescription}</p>
                <div>
                  <div className="flex items-center space-x-2">
                    <p>{averageRating(course?.courseRating)}</p>
                    <div className="flex items-center ml-2 text-sm">
                      {
                        [...Array(5)].map((_, index) => (
                          <span key={index} className={`text-yellow-500 ${index < 4 ? 'text-yellow-500' : 'text-gray-300'}`}>
                            <img src={index < Math.floor(averageRating(course?.courseRating)) ? assets.star : assets.star_blank} alt="star" className=' w-[14px]' />
                          </span>
                        ))
                      }
                    </div>
                    <p className='pl-1 text-gray-500 '>( {course?.courseRating?.length} {course?.courseRating?.length > 1 ? `ratings` : `rating`} )</p>
                  </div>
                  <p className='text-gray-500 mt-1'>Course by <span className='text-blue-600 underline'>{course?.educator?.name}</span></p>
                </div>
                <div className="mt-5">
                  <div className="">
                    <h1 className='font-semibold text-xl'>Course Structure</h1>
                    <p className='text-gray-500'>{course?.courseContent?.length} sections - {totalLectures} lectures - {courseDuration}</p>
                  </div>
                </div>
                <div className="">
                  {
                    course?.courseContent?.map((chapter, index) => (
                      <div key={index}>
                        <div className="flex flex-col md:flex-row md:items-center items-start justify-between border border-gray-300 px-2 md:px-5 py-2  bg-gray-100 gap-2 md:gap-5" key={index}>
                          <div className="flex items-center gap-2 md:gap-5 cursor-pointer" onClick={() => toggleSection(index)}>
                            <img src={assets.down_arrow_icon} alt="down_arrow" className={`w-3 transform transition-transform ${openSection[index] ? 'rotate-180' : ''}`} />
                            <h1 className='font-semibold text-sm md:text-lg whitespace-nowrap overflow-hidden text-ellipsis'>{chapter.chapterTitle}</h1>
                          </div>
                          <div className="">
                            <p>{chapter?.chapterContent?.length} {chapter?.chapterContent?.length > 1 ? "lectures" : "lecture"}-{calculcateChapterDuration(chapter)}</p>
                          </div>
                        </div>
                        <div className={`overflow-hidden pr-5 pl-2 border border-gray-300 transition-all duration-300 ${openSection[index] ? 'max-h-96 py-3' : 'max-h-0'}`}>
                          {
                            chapter?.chapterContent?.map((lecture, lectureIndex) => (
                              <div className="flex flex-col md:flex-row md:items-center items-start justify-between" key={lectureIndex}>
                                <div className="flex items-center gap-3 md:p-2 py-2 cursor-pointer">
                                  <img src={assets.play_icon} alt="play_icon" />
                                  <p className='whitespace-nowrap overflow-hidden text-ellipsis'>{lecture.lectureTitle}</p>
                                </div>
                                <div className=" flex items-center gap-2">
                                  {
                                    lecture?.isPreviewFree && <span className='text-blue-600 cursor-pointer' onClick={() => setPlayerData({
                                      videoId: lecture.lectureUrl.split('/').pop()
                                    })}>Preview</span>
                                  }
                                  <p className=''>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                                </div>
                              </div>
                            ))
                          }
                        </div>

                      </div>
                    ))
                  }

                </div>
              </div>
              {/* //right side */}
              <div className="">
                <div className="shadow-course-card rounded overflow-hidden pb-5">
                  {
                    playerData ?
                      <YouTube
                        videoId={playerData.videoId}
                        opts={{ playerVars: { autoplay: 1 } }} iframeClassName="w-full aspect-video" />
                      :

                      <img src={course?.courseThumbnail} alt="" className='w-full aspect-[16/10] overflow-hidden' />
                  }
                  <div className="px-4 my-5 flex flex-col gap-5">

                    <div className='flex flex-col gap-3'>
                      <div className='flex items-center gap-2'>
                        <img className='w-3.5' src={assets.time_left_clock_icon} alt="clock" />
                        <p className='text-red-500'><span className='font-medium'>5 Days</span> left at this price!</p>
                      </div>
                      <div className="flex gap-3 items-center">
                        <p className='textt-gray-800 lg:text-3xl text-2xl font-semibold'>{currency} {(course?.coursePrice - course?.discount * course?.coursePrice / 100).toFixed(2)}</p>
                        <p className='md:text-lg text-gray-500 line-through'>{currency} {course?.coursePrice}</p>
                        <p className='md:text-lg text-gray-500'>{course?.discount}% off</p>
                      </div>

                      <div className="flex items-center text-gray-500 gap-3 text-sm">
                        <div className="flex  items-center gap-1">
                          <img src={assets.star} alt="star" className='max-w-course-card' />
                          <p>{averageRating(course?.courseRating)}</p>
                        </div>
                        <div className="h-4 w-px bg-gray-500/40"></div>
                        <div className="flex items-center gap-1">
                          <img src={assets.time_clock_icon} alt="clocl_icon" />
                          <p>{courseDuration}</p>
                        </div>
                        <div className="h-4 w-px bg-gray-500/40"></div>
                        <div className="flex items-center gap-1"><img src={assets.lesson_icon} alt="lesson_icon" />
                          <p>{totalLectures} {totalLectures > 1 ? "Lessons" : "Lesson"}</p>
                        </div>
                      </div>
                    </div>
                    <button onClick={enrollCourse} className='bg-blue-600 text-white w-full py-3 rounded-lg'>{isEnrolled ? "Already Enrolled" : "Enroll Now"}</button>
                    <div className="">
                      <h1 className='font-medium text-lg'>What's in the course?</h1>
                      <ul className='list-disc pl-5 text-gray-500 mt-2 text-sm'>
                        <li>Lifetime access with free updates.</li>
                        <li>Step-by-step, hands-on project guidance.</li>
                        <li>Downloadable resources and source code.</li>
                        <li>Quizzes to test your knowledge.</li>
                        <li>Certificate of completion.</li>
                        <li>Quizzes to test your knowledge.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </>
      }
    </>
  )
}

export default CourseDetails
