import React from 'react'

const Navbar = () => {
  return (
    <div className={`border-b-2 border-gray-200 h-[60px] flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-28 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src={Logo} alt="Logo" className=' h-[40px] w-[40px]' />
        </Link>
        <Link to="/">
          <h1 className='font-bold text-xl'>Learnify</h1>
        </Link>
      </div>
      <div className='text-[14px]'>
        <ul className='flex items-center gap-4 justify-between'>
          <li>
            <Link to="/course-list" className='text-gray-700 hover:text-blue-500'>Course List</Link>
          </li>
          <li>
            |
          </li>
          <li>
            <Link to="/login" className='text-gray-700 hover:text-blue-500'>Login</Link>
          </li>
          <li>
            <Link to="/create-account" className='p-2 border rounded-full bg-blue-600'>Create Account</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
