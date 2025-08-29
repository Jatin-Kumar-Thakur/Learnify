import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext';
import TestimonialCard from './TestimonialCard';

const TestimonialsSection = () => {
  const { allTestimonials } = useContext(AppContext);
  return (
    <div>
      <div className='flex flex-col items-center pt-6 pb-16 px-8 md:px-20 w-full text-base text-center gap-2'>
        <h2 className='font-medium text-3xl'>Testimonials</h2>
        <p className='text-gray-500 text-sm md:text-base mt-3'>Hear from our learners as they share their journeys of transformation, success, and how our <br /> platform has made a difference in their lives.</p>
        <div className="grid grid-cols-auto px-4 gap-4 md:px-0 md:my-16 my-10">
          {
            allTestimonials?.slice(0, 3).map((data, index) => (
              <TestimonialCard  testimonial={data} key={index}/>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default TestimonialsSection
