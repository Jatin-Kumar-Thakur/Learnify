import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets.js';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { AppContext } from '../../context/AppContext.jsx';

const Navbar = () => {
  const location = useLocation();
  const isCourseListPage = location.pathname.includes('/course-list');
  const { isEducator, setIsEducator } = useContext(AppContext);

  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <div className={`border-b-2 border-gray-200 h-[60px] flex items-center justify-between px-4 sm:px-10 md:px-8 lg:px-8 bg-white `}>
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
              <li className='text-gray-500'>Hi! {user?.firstName + " " + user?.lastName}</li>
              <li>
                {
                  user ?
                    <UserButton />
                    :
                    <img src={assets.profile_img} className='max-w-8' />
                }
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
