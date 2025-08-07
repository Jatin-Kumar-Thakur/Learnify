import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar.jsx'
const Hero = () => {
  return (
    <div className={`h-full py-20 flex flex-col text-center items-center md:pt-36 pt-20 lg:px-28 px-7 md:px-0 space-y-7 bg-gradient-to-b from-cyan-100/70 w-full`}>
      <h1 className='md:text-home-heading-large text-home-heading-small font-bold relative max-w-3xl mx-auto'>
        Empower your future with the courses designed to{' '}
        <span className='text-blue-600 relative inline-block'>
          fit your choice.
          <img
            src={assets.sketch}
            alt="sketch"
            className='md:block hidden absolute -bottom-7 left-0 w-full pointer-events-none'
          />
        </span>
      </h1>

      <br />
      <h6 className='text-center md:text-sm text-xs text-gray-500 max-w-xl'>We bring together world-class instructors, interactive content, and a supportive
        community to help you achieve your personal and professional goals.</h6>
      <br />
      <SearchBar />
    </div>
  )
}

export default Hero
