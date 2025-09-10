import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import Footer from '../../components/student/Footer';
import Rating from '../../components/student/Rating';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loading from '../../components/student/Loading';

const Player = () => {
  const { enrolledCourses, calculcateChapterDuration, backend_url, getToken, userData, fetchAllEnrolledCourses ,fetchCourses} = useContext(AppContext);
  const [course, setCourse] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [intialRating, setIntialRating] = useState(0);

  const { courseId } = useParams();

  const getCourseData = () => {
    enrolledCourses.map((item) => {
      if (item._id == courseId) {
        setCourse(item);
        item.courseRating.map(
          (ratingObj) => {
            if (ratingObj.userId === userData._id) {
              setIntialRating(ratingObj.rating);
            }
          }
        )
      }
    })
  }

  const toggleSection = (index) => {
    setOpenSection(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    }
  }, [enrolledCourses])
  const markLectureAsComplete = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(backend_url + '/api/user/update-course-progress', { courseId, lectureId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (data.success) {
        getCourseProgress();
        toast.success(data.message);
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(backend_url + '/api/user/get-course-progress', { courseId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (data.success) {
        setProgressData(data.progressData);
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const handleRating = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(backend_url + '/api/user/add-rating', { courseId, rating }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (data.success) {
        toast.success(data.message);
        fetchAllEnrolledCourses();
        fetchCourses();
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
    getCourseProgress();
  }, [])
  return course ? (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
        <div className="text-gray-800">
          <h1 className='text-xl font-semibold'>Course Structure</h1>
          <div className="">
            {
              course?.courseContent?.map((chapter, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between border border-gray-300 px-2 md:px-5 py-2  bg-gray-100 gap-2 md:gap-5" key={index}>
                    <div className="flex items-center gap-2 md:gap-5 cursor-pointer" onClick={() => toggleSection(index)}>
                      <img src={false ? assets.blue_tick_icon : assets.down_arrow_icon} alt="down_arrow" className={`w-3 transform transition-transform ${openSection[index] ? 'rotate-180' : ''}`} />
                      <h1 className='font-semibold text-sm md:text-lg whitespace-nowrap overflow-hidden text-ellipsis'>{chapter.chapterTitle}</h1>
                    </div>
                    <div className="">
                      <p>{chapter?.chapterContent.length} {chapter?.chapterContent.length > 1 ? "lectures" : "lecture"}-{calculcateChapterDuration(chapter)}</p>
                    </div>
                  </div>
                  <div className={`overflow-hidden pr-5 pl-2 border border-gray-300 transition-all duration-300 ${openSection[index] ? 'max-h-96 py-3' : 'max-h-0'}`}>
                    {
                      chapter?.chapterContent?.map((lecture, lectureIndex) => (
                        <div className="flex items-center justify-between" key={lectureIndex}>
                          <div className="flex items-center gap-3 md:p-2 py-2 cursor-pointer">
                            <img src={progressData && progressData?.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon} alt="play_icon" />
                            <p className='whitespace-nowrap overflow-hidden text-ellipsis'>{lecture.lectureTitle}</p>
                          </div>
                          <div className=" flex items-center gap-2">
                            {
                              lecture?.lectureUrl && <span className='text-blue-600 cursor-pointer' onClick={() => setPlayerData({
                                ...lecture, chapter: lectureIndex + 1, lecture: index + 1
                              })}>Watch</span>
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
          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this Course : </h1>
            <Rating intialRating={intialRating} onRate={handleRating} />
          </div>
        </div>
        <div className="">
          {
            playerData ?
              <div className="md:mt-7">
                <YouTube
                  videoId={playerData.lectureUrl.split('/').pop()}
                  iframeClassName="w-full aspect-video" />
                <div className="flex justify-between items-center mt-1">
                  <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
                  <button onClick={() => markLectureAsComplete(playerData.lectureId)} className='text-blue-600'>{progressData && progressData?.lectureCompleted.includes(playerData.lectureId) ? "Completed" : "Mark Complete"}
                  </button>
                </div>
              </div>
              :

              <img src={course?.courseThumbnail} alt="" />
          }
        </div>
      </div>
      <Footer />
    </>
  )
    :
    <Loading />
}

export default Player
