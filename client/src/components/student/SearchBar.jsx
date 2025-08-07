import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
const SearchBar = ({ data }) => {

  const naviagte = useNavigate();
  const [input, setInput] = useState(data ? data : '');
  const handleInput = (e) => {
    setInput(e.target.value);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') {
      return;
    }
    naviagte('/course-list/' + input.trim().toLowerCase());
    setInput(''); // Clear the input after submission
    e.target.reset(); // Reset the form to clear the input field
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className='flex items-center border border-gray-300 rounded h-12 md:h-14 w-full max-w-xl justify-between'>
        <img src={assets.search_icon} alt="search_icon" className='md:w-auto w-10 px-3' />
        <input onChange={(e) => handleInput(e)} value={input} type="text" placeholder='Search for courses' className=' p-2 rounded w-full bg-transparent focus:outline-none text-gray-500' />
        <button type='submit' className='border rounded bg-blue-600 md:py-3 py-2 mx-1 md:px-10 px-7'>Search</button>
      </form>
    </div>
  )
}

export default SearchBar
