import { createContext, useEffect, useState } from "react";
import { dummyCourses, dummyEducatorData, dummyTestimonial } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    // all States
    const [allCourses, setAllCourses] = useState([]);
    const [educator, setEducator] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const [allTestimonials, setAllTestimonials] = useState([]);
    const navigate = useNavigate();


    const fetchCourses = () => {
        setAllCourses(dummyCourses);
    }
    const fetchEducator = () => {
        // This function would typically fetch educator data from an API
        // For now, we will use dummy data
        setEducator(dummyEducatorData);
    }
    const fetchTestimonials = () => {
        // This function would typically fetch testimonials from an API
        // For now, we will use dummy data
        setAllTestimonials(dummyTestimonial);
    }
    useEffect(() => {
        fetchCourses();
        fetchTestimonials();
        fetchEducator();
    }, []);

    const averageRating = (ratings) => {
        if (!ratings || ratings?.length === 0) return 0;
        let total = 0;
        ratings.forEach(ratingObj => {
            total += ratingObj?.rating;
        });

        return (total / ratings.length).toFixed(1);
    }

    const calculcateChapterDuration = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration);
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
    }

    const calculcateCourseDuration = (course) => {
        let time = 0;
        course.courseContent.map((chapter) => {
            chapter.chapterContent.map((lecture) => time += lecture.lectureDuration);
        })
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
    }

    const calculateNumberOfLectures = (course) => {
        let count = 0;
        course.courseContent.forEach((chapter) => {
            if (Array.isArray(chapter.chapterContent)) {
                count += chapter.chapterContent.length;
            }
        });
        return count;
    }

    const educatorNameByEducatorId = (educatorId) => {
        const educatorData = educator.find(ed => ed._id === educatorId);
        return educatorData ? educatorData.name : 'Unknown Educator';
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
        navigate,
        educatorNameByEducatorId,
        calculcateChapterDuration,
        calculateNumberOfLectures,
        calculcateCourseDuration

    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}