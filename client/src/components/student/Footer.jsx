import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className="">

      <div className='grid grid-cols-1 md:grid-cols-3 content-center w-full bg-[#111820] md:px-16 px-8 py-10 text-white'>
        <div className="flex flex-col items-center md:items-start p-2 md:p-5">
          <div className="flex items-center  gap-2 mb-5">
            <Link to="/">
              <img src={assets.logo} alt="Logo" className=' h-[40px] w-[40px]' />
            </Link>
            <Link to="/">
              <h1 className='font-bold text-xl md:text-xl'>Learnify</h1>
            </Link>
          </div>
          <p className='text-gray-400 text-center md:text-left'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.</p>
        </div>
        <div className="p-2 md:p-5 flex flex-col items-center md:text-left ">
          <ul className='text-center md:text-left'>
            <li className='text-lg font-semibold mb-5'>Company</li>
            <div className='flex items-center md:flex-col md:items-start gap-5 md:gap-2 text-gray-400'>
              <button>Home</button>
              <button>About us</button>
              <button>Contact us</button>
              <button>Privacy Policy</button>
            </div>
          </ul>
        </div>
        <div className="p-5 hidden md:block">
          <h2 className='text-lg font-semibold mb-5'>Subscribe to our newsletter</h2>
          <div className="">
            <p className='mb-2 text-gray-400'>The latest news, articles, and resources, sent to your inbox weekly.</p>
            <div>
              <form className='flex items-center border border-gray-300 rounded h-8 md:h-10 w-full max-w-xl justify-between'>
                <input type="email" placeholder='Enter your email' className=' p-2 rounded w-full bg-transparent focus:outline-none text-gray-500' />
                <button type='submit' className='border rounded bg-blue-600 md:py-1 py-1 mx-1 md:px-10 px-7'>Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <p className=' md:hidden bg-[#111820] text-gray-400 p-4 text-center border-t w-full'>Copyright @ 2025 Jatin Kumar</p>
    </div>
  )
}

export default Footer
