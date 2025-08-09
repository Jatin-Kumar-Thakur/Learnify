import { Link } from "react-router-dom"
import { assets } from "../../assets/assets";

const TestimonialCard = ({ testimonial }) => {
    console.log(testimonial);
    return (
        <div>
            <div className='border rounded-lg overflow-hidden shadow-[0px_4px_15px_0px] shadow-black/5'>
                <div className="flex items-center bg-[#F3F3F3] p-3 gap-4 text-left">
                    <img src={testimonial?.image} alt="user" className=' w-14' />
                    <div>
                        <h1 className='font-semibold text-xl'>{testimonial?.name}</h1>
                        <p className='text-md text-gray-500'>{testimonial?.role}</p>
                    </div>
                </div>
                <div className='text-left p-3 my-3'>
                    <div className="flex flex-col text-left items-left gap-3 mb-3">
                        <div className="flex items-center ml-2 text-sm">
                            {
                                [...Array(5)].map((_, index) => (
                                    <span key={index} >
                                        <img src={index < Math.floor(testimonial?.rating) ? assets?.star : assets?.star_blank} alt="star" className=' w-[14px]' />
                                    </span>
                                ))
                            }
                        </div>
                        <p className='pl-2 text-gray-500 '>{testimonial.feedback}</p>
                    </div>
                    <Link to={"/"} className="ml-2 text-blue-600 text-sm underline">Read more</Link>
                </div>
            </div>
        </div>
    )
}

export default TestimonialCard
