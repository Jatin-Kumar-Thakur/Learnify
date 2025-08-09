import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className='flex flex-col items-center pt-6 pb-16 px-8 md:px-20 w-full text-base text-center gap-2'>
      <h2 className='font-medium text-3xl'>Learn anything, anytime, anywhere</h2>
      <p className='text-gray-500 text-sm md:text-sm mt-3'>Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id <br /> veniam aliqua proident excepteur commodo do ea.</p>
      <div className=" flex items-center gap-3 mt-3">
        <button className='bg-blue-600 text-white py-2 px-8 border rounded'>Get Started</button>
        <button className='flex items-center gap-1 text-gray-500 text-sm'>Learn more <img src={assets.arrow_icon} alt="arrow_icon" className='w-3' /></button>
      </div>
    </div>
  )
}

export default CallToAction
