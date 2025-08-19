import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Footer = () => {


  return (
    <div className={`border-t border-gray-200 h-[50px] flex items-center justify-between px-4 sm:px-10 md:px-8 lg:px-8 bg-white `}>
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src={assets.logo} alt="Logo" className=' h-[25px] w-[25px] md:h-[30px] md:w-[30px]' />
        </Link>
        <Link to="/">
          <h1 className='font-bold text-l md:text-xl'>Learnify</h1>
        </Link>
        |
        <span className='text-xs text-gray-500'>All Right reserved. Copyright @Jatin</span>
      </div>
      <div className="flex items-center gap-1">
        <img src={assets.facebook_icon} alt="icon" className='w-7  cursor-pointer' />
        <img src={assets.twitter_icon} alt="icon" className='w-7 cursor-pointer' />
        <img src={assets.instagram_icon} alt="icon" className='w-7 cursor-pointer' />
      </div>
    </div>
  )
}

export default Footer
