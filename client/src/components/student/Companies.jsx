import React from 'react'
import { companies } from '../../assets/assets'

const Companies = () => {
  return (
    <div className='flex flex-col items-center pt-6 pb-16 w-full text-base text-gray-500'>
      <h1 >Trusted by lerners from</h1>
      <div className="flex flex-wrap justify-center items-center mt-5 md:mt-10 gap-6 md:gap-16">
        {
          companies && companies.map((company, index) => (
            <img key={index} src={company.file} alt={company.name} className="h-auto w-20 md:w-28" />
          ))
        }
      </div>
    </div>
  )
}

export default Companies
