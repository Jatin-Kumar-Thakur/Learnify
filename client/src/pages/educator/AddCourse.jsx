import React, { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import uniqid from 'uniqid'
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const { backend_url, getToken } = useContext(AppContext);


  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapter, setChapter] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false
  })
  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt("Enter Chapter Name: ");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapter.length > 0 ? chapter.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapter([...chapter, newChapter]);
      }
    }
    else if (action === 'remove') {
      setChapter(chapter.filter((ch) => ch.chapterId !== chapterId))
    }
    else if (action === 'toggle') {
      setChapter(
        chapter.map((ch) =>
          ch.chapterId === chapterId ? { ...ch, collapsed: !ch.collapsed } : ch
        )
      );
    }
  }

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    }
    else if (action === 'remove') {
      setChapter(
        chapter.map((ch) =>
          ch.chapterId === chapterId
            ? { ...ch, chapterContent: ch.chapterContent.filter((_, i) => i !== lectureIndex) }
            : ch
        )
      );
    }
  }

  const addLecture = () => {
    setChapter(
      chapter.map((ch) =>
        ch.chapterId === currentChapterId
          ? {
            ...ch,
            chapterContent: [
              ...ch.chapterContent,
              {
                ...lectureDetails,
                lectureOrder: ch.chapterContent.length > 0
                  ? ch.chapterContent.slice(-1)[0].lectureOrder + 1
                  : 1,
                lectureId: uniqid()
              },
            ],
          }
          : ch
      )
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!image) {
        toast.error("Please upload a thumbnail image");
        return;
      }
      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapter,
      }
      const formData = new FormData();
      formData.append('image', image);
      formData.append('courseData', JSON.stringify(courseData));
      const token = await getToken();
      const { data } = await axios.post(backend_url + '/api/educator/add-course', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data?.success) {
        toast.success(data.message);
        setCourseTitle('');
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapter([]);
        quillRef.current.root.innerHTML = '';
      }
      else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, [])

  return (
    <div className='min-h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 p-4 pt-8 pb-0'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-5 w-[60%]'>
        <div className="flex flex-col">
          <label htmlFor="title" className='mb-2'>Course Title</label>
          <input onChange={(e) => setCourseTitle(e.target.value)} value={courseTitle} type="text" placeholder='Type here' className='outline-none  border border-gray-500 md:py-2.5 py-2 px-3 rounded ' required />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className='mb-2'>Course Description</label>
          <div ref={editorRef}></div>
        </div>
        <div className="flex justify-between items-center flex-wrap">
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className='mb-2'>Course Price</label>
            <input onChange={(e) => setCoursePrice(e.target.value)} value={coursePrice} type="number" placeholder='0' className='outline-none  border border-gray-500 md:py-2.5 py-2 px-3 w-28 rounded ' required />
          </div>
          <div className="flex md:flex-row flex-col items-center gap-3">
            <p>Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className='flex items-center gap-3'>
              <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded' />
              <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files[0])} accept='image/*' hidden />
              <img className='max-h-10' src={image ? URL.createObjectURL(image) : ''} alt="image" />
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p>Discount %</p>
          <input type="number" placeholder='0' min={0} max={100} onChange={e => setDiscount(e.target.value)} value={discount} className='outline-none  border border-gray-500 md:py-2.5 py-2 px-3 w-28 rounded ' required />
        </div>
        {/* Chapters */}
        <div className="">
          {
            chapter?.map((ch, chapterIndex) => (
              <div key={chapterIndex} className="bg-white border rounded-lg mb-4" >
                <div className="flex justify-between items-center p-4 border-b">
                  <div className="flex items-center">
                    <img src={assets.dropdown_icon} width={14} alt="dropdown_icon" className={`mr-2 cursor-pointer transition-all ${ch.collapsed && "-rotate-90"}`}
                      onClick={() => handleChapter('toggle', ch.chapterId)}
                    />
                    <span className='font-semibold uppercase'>{chapterIndex + 1} . {ch.chapterTitle}</span>
                  </div>
                  <span className='text-gray-500'>{ch?.chapterContent?.length} Lectures</span>
                  <img src={assets.cross_icon} alt="cross_icon" className='cursor-pointer'
                    onClick={() => handleChapter('remove', ch.chapterId)}
                  />
                </div>
                {
                  !ch.collapsed && (
                    <div className="p-4">
                      {
                        ch?.chapterContent?.map((lecture, lectureIndex) => (
                          <div key={lectureIndex} className="flex justify-between items-center mb-2">
                            <span>{lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a href={lecture.lectureUrl} target='_blank' className='text-blue-500'>Link</a> -  {lecture.isPreviewFree ? "Free Preview" : 'Paid'}</span>
                            <img src={assets.cross_icon} alt="cross_icon" className='cursor-pointer'
                              onClick={() => handleLecture('remove', ch.chapterId, lectureIndex)}
                            />
                          </div>
                        ))
                      }
                      <div className='inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2'
                        onClick={() => handleLecture('add', ch.chapterId)}
                      >+ Add Lecture</div>
                    </div>
                  )}
              </div>
            ))}
          <div className="flex justify-center items-center bg-gray-100 p-2 rounded cursor-pointer "
            onClick={() => handleChapter('add')}
          >+ Add Chapter</div>
          {
            showPopup &&
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white px-10 py-4">
                <h2 className='text-lg font-semibold mb-4'>Add Lecture</h2>
                <div className="mb-2">
                  <p>Lecture Title</p>
                  <input type="text"
                    className='outline-none mt-1 block w-full border rounded py-1 px-2'
                    value={lectureDetails.lectureTitle}
                    onChange={e => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <p>Duration(minute)</p>
                  <input type="number"
                    className=' outline-none mt-1 block w-full border rounded py-1 px-2'
                    value={lectureDetails.lectureDuration}
                    onChange={e => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <p>Lecture URL</p>
                  <input type="text"
                    className='outline-none mt-1 block w-full border rounded py-1 px-2'
                    value={lectureDetails.lectureUrl}
                    onChange={e => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                  />
                </div>
                <div className="mb-2 flex justify-between items-center">
                  <p className='w-full'>Is Preview Free?</p>
                  <input type="checkbox"
                    className='outline-none mt-1 block w-full border rounded py-1 px-2'
                    checked={lectureDetails.isPreviewFree}
                    onChange={e => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                  />
                </div>
                <button onClick={addLecture} className='w-full bg-blue-400 text-white px-4 py-2 rounded'>Add</button>
                <img src={assets.cross_icon} onClick={() => setShowPopup(false)} alt="cross_icon" className=' absolute top-4 right-4 w-4 cursor-pointer' />
              </div>
            </div>
          }
        </div>
        <button className='w-full bg-blue-400 text-white px-4 py-2 rounded' onClick={handleSubmit} type='submit'>Add</button>
      </form>
    </div>
  )
}

export default AddCourse
