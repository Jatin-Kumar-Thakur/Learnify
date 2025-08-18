import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import Footer from '../../components/student/Footer';

const Player = () => {
  const [course, setCourse] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const { enrolledCourses, calculcateChapterDuration } = useContext(AppContext);

  const { courseId } = useParams();

  const getCourseData = () => {
    enrolledCourses.map((item) => {
      if (item._id == courseId) {
        setCourse(item);
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
    getCourseData();
  }, [enrolledCourses])

  return (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
        <div className="text-gray-800">
          <h1 className='text-xl font-semibold'>Course Structure</h1>
          <div className="">
            {
              course?.courseContent?.map((chapter, index) => (
                <>
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
                            <img src={assets.play_icon} alt="play_icon" />
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
                </>
              ))
            }
          </div>
          <div className="flex items-center gap-2 py-3 mt-10">
            <div className="text-xl font-bold">Rate this Course</div>
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
                  <button className='text-blue-600'>{false ? "Completed" : "Mark Complete"}
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
}

export default Player
