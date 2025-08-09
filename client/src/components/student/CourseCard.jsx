import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const CourseCard = ({ props }) => {
  const { currency, averageRating } = useContext(AppContext);

  return (
    <Link to={'/course/' + props._id} onClick={() => scrollTo(0, 0)} className='border rounded-lg overflow-hidden '>
      <img src={props.courseThumbnail} alt="course_image" className='w-full' />
      <div className='text-left p-3'>
        <h1 className='font-semibold text-xl'>{props.courseTitle}</h1>
        <p className='text-md text-gray-500'>props.educator.name</p>
        <div className="flex items-center space-x-2">
          <p>{averageRating(props?.courseRatings)}</p>
          <div className="flex items-center ml-2 text-sm">
            {
              [...Array(5)].map((_, index) => (
                <span key={index} className={`text-yellow-500 ${index < 4 ? 'text-yellow-500' : 'text-gray-300'}`}>
                  <img src={index < Math.floor(averageRating(props?.courseRatings)) ? assets.star : assets.star_blank} alt="star" className=' w-[14px]' />
                </span>
              ))
            }
          </div>
          <p className='pl-2 text-gray-500 '>{props.courseRatings.length}</p>
        </div>
        <p className='font-bold text-[18px]'>{currency}{props.coursePrice}</p>
      </div>
    </Link>
  )
}

export default CourseCard
