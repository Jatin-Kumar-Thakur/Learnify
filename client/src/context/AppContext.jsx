import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    // all States
    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);


    const fetchCourses = () => {
        setAllCourses(dummyCourses);
    }
    useEffect(() => {
        fetchCourses();
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
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}