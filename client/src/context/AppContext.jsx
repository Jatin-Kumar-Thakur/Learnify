import { createContext, useEffect, useState } from "react";
import { dummyCourses, dummyEducatorData, dummyTestimonial, dummyStudentEnrolled } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from '@clerk/clerk-react'
import axios, { all } from 'axios';
import { toast } from "react-toastify";


export const AppContext = createContext();

export const AppContextProvider = (props) => {

    // all States
    const [allCourses, setAllCourses] = useState([]);
    const [educator, setEducator] = useState([]);
    const [isEducator, setIsEducator] = useState(false);
    const [allTestimonials, setAllTestimonials] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    //
    const { getToken } = useAuth();
    const { user } = useUser();
    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const fetchUserData = async () => {

        if (user.publicMetadata.role === 'educator') {
            setIsEducator(true);
        }
        try {
            const token = await getToken();
            const { data } = await axios.get(backend_url + '/api/user/data', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.success) {
                setUserData(data.user);
            }
            else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get(backend_url + '/api/course/all');
            if (data.success) {

                setAllCourses(data.courses)
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
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

    const fetchAllEnrolledCourses = async () => {
        // setEnrolledCourses(dummyCourses);
        try {
            const token = await getToken();
            const { data } = await axios.get(backend_url + '/api/user/enrolled-courses', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.success) {
                const enrollCourses=data.enrolledCourses;
                setEnrolledCourses(data.enrolledCourses.reverse())
            }
            else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    const fetchAllEnrolledStudents = async () => {
        setEnrolledStudents(dummyStudentEnrolled);
    }
    useEffect(() => {
        fetchCourses();
        fetchTestimonials();
        fetchEducator();
        fetchAllEnrolledStudents();
    }, []);

    const logToken = async () => {
        console.log(await getToken());
    }

    useEffect(() => {
        if (user) {
            logToken();
            fetchUserData();
            fetchAllEnrolledCourses();
        }
    }, [user]);

    const averageRating = (ratings) => {
        if (!ratings || ratings?.length === 0) return 0;
        let total = 0;
        ratings.forEach(ratingObj => {
            total += ratingObj?.rating;
        });

        return Math.floor((total / ratings.length).toFixed(1));
    }

    const calculcateChapterDuration = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration);
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
    }

    const calculcateCourseDuration = (course) => {
        let time = 0;
        course?.courseContent?.map((chapter) => {
            chapter?.chapterContent?.map((lecture) => time += lecture.lectureDuration);
        })
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
    }

    const calculateNumberOfLectures = (course) => {
        let count = 0;
        course?.courseContent?.forEach((chapter) => {
            if (Array.isArray(chapter?.chapterContent)) {
                count += chapter?.chapterContent?.length;
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
        calculcateCourseDuration,
        fetchAllEnrolledCourses,
        enrolledCourses,
        setEnrolledCourses,
        enrolledStudents,
        setEnrolledStudents,
        userData,
        setUserData,
        fetchUserData,
        backend_url,
        getToken,
        fetchCourses


    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}