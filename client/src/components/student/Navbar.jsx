import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets.js';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const location = useLocation();
  const isCourseListPage = location.pathname.includes('/course-list');

  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <div className={`border-b-2 border-gray-200 h-[60px] flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-28 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src={assets.logo} alt="Logo" className=' h-[30px] w-[30px] md:h-[40px] md:w-[40px]' />
        </Link>
        <Link to="/">
          <h1 className='font-bold text-l md:text-xl'>Learnify</h1>
        </Link>
      </div>
      <div className='hidden md:flex text-[14px]'>
        <ul className='flex items-center gap-4 justify-between'>
          {
            user ? <>
              <li>
                <button className='text-gray-700 hover:text-blue-500'>Become Educator</button>
                {/* <Link to="/become-educator" className='text-gray-700 hover:text-blue-500'>Become Educator</Link> */}
              </li>
              <li>|</li>
              <li>
                <Link to="/myenrollments" className='text-gray-700 hover:text-blue-500'>MyEnrollments</Link>
              </li>
              <li>
                <UserButton />
              </li>
            </>
              :
              <li>
                <button onClick={() => openSignIn()} className='text-white py-1 px-4 border rounded-full bg-blue-600'>Login</button>
              </li>
          }

        </ul>
      </div>
      <div className="md:hidden flex justify-between items-center">
        <ul className='flex items-center gap-4 justify-between'>
          {
            user ? <>
              {/* <li>
                <button className='text-gray-700 hover:text-blue-500'>Become Educator</button>
              </li>
              <li>|</li>
              <li>
                <Link to="/myenrollments" className='text-gray-700 hover:text-blue-500'>MyEnrollments</Link>
              </li> */}
              <li>
                <UserButton />
              </li>
            </>
              :
              <li>
                <button onClick={() => openSignIn()}>
                  <img src={assets.user_icon} alt="User_icon" />
                </button>
              </li>
          }

        </ul>
      </div>
    </div>
  );
};

export default Navbar;
