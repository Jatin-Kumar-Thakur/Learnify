import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/mycourses', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon }
  ]
  return isEducator && (
    <div className='md:w-64 w-16 border-r min-h-screen border-gray-300'>
        {
          menuItems?.map((items, key) => (
            <NavLink 
            to={items.path} 
            key={items.name}
            end={items.path == '/educator'}
            className={({ isActive }) => `flex items-center gap-2 py-2 pl-8 hover:bg-indigo-100 ${isActive ? 'border-r-4 border-blue-600 bg-indigo-100' : "border-none"}`}> <img src={items.icon} alt="home_icon" />{items.name}</NavLink>
          ))
        }
    </div>
  )
}

export default Sidebar
