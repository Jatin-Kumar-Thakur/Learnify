import { createContext, useEffect, useState } from "react";
import { dummyCourses, dummyTestimonial } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    // all States
    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const [allTestimonials, setAllTestimonials] = useState([]);
    const navigate = useNavigate();


    const fetchCourses = () => {
        setAllCourses(dummyCourses);
    }
    const fetchTestimonials = () => {
        // This function would typically fetch testimonials from an API
        // For now, we will use dummy data
        setAllTestimonials(dummyTestimonial);
    }
    useEffect(() => {
        fetchCourses();
        fetchTestimonials();
    }, []);

    const averageRating = (ratings) => {
        if (!ratings || ratings?.length === 0) return 0;
        let total = 0;
        ratings.forEach(ratingObj => {
            total += ratingObj?.rating;
        });

        return (total / ratings.length).toFixed(1);
    }




    // Get the currency from environment variables
    const currency = import.meta.env.VITE_CURRENCY || '$';

    // Provide the context value
    const value = {
        currency,
        allCourses,
        averageRating,
        isEducator,
        setIsEducator,
        allTestimonials,
        navigate
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}