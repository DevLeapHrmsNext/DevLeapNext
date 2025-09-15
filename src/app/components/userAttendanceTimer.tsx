
// user dashboard timer

'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import 'swiper/css';
import LoadingDialog from './PageLoader';
import moment from 'moment';
import { AttendanceTimer } from '../models/userDashboardModel';
import { formatInTimeZone } from 'date-fns-tz';
import {
    CircularProgressbar,
    buildStyles,

} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import supabase from '../api/supabaseConfig/supabase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ShowAlertMessage from '@/app/components/alert'
import { ALERTMSG_addAssetSuccess, getImageApiURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'

interface breaktimer {
    fullday_working_hours: any
}

const UserAttendanceTimer = ({ data, name, workingHour }: { data: AttendanceTimer, name: any, workingHour: any }) => {
    const { contextClientID, contextCustomerID, contextRoleID, contaxtBranchID, setGlobalState } = useGlobalContext();
    const [attendanceData, setAttendanceData] = useState<AttendanceTimer>(data);
    const [totalHours, setTotalHours] = useState<breaktimer[]>();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        // getTotalWorkedMinutes('');
        // const intervalId = setInterval(() => {
        //     // fetchActivities();
        //     fetchData();
        // }, 5000); // Call fetchActivities every 5 seconds
        // console.log("workingHour:", workingHour);

        setAttendanceData(data);
        // fetchAttendanceTimerData();
        const handleScroll = () => {
            setScrollPosition(window.scrollY); // Update scroll position
            const element = document.querySelector('.mainbox');
            if (window.pageYOffset > 0) {
                element?.classList.add('sticky');
            } else {
                element?.classList.remove('sticky');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            // clearInterval(intervalId);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const calculateTimeDuration = (startDate: any, endDate: any) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = end.getTime() - start.getTime(); // in milliseconds
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        return diffMinutes;
    }
    const WORKING_MINUTES = workingHour;
    // || workingHour;
    function parseDateString(dateStr: string | null): Date | null {
        if (!dateStr) return null;
        // Replace space with T for ISO format
        return new Date(dateStr.replace(' ', 'T'));
    }

    function getTotalWorkedMinutes(
        inTime: string,
        outTime: string | null,
        pauseDurationMinutes: number
    ): { totalMinutes: number; netMinutes: number } {
        if (!inTime) return { totalMinutes: 0, netMinutes: 0 };

        try {
            const now = new Date();

            // Fix format from "YYYY-MM-DD HH:MM:SS+00" → "YYYY-MM-DDTHH:MM:SS+00"
            const start = new Date(inTime.replace(' ', 'T'));
            const end = outTime ? new Date(outTime.replace(' ', 'T')) : now;

            const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
            const netMinutes = totalMinutes - pauseDurationMinutes;

            return {
                totalMinutes: Math.max(0, Math.floor(totalMinutes)),
                netMinutes: Math.max(0, Math.floor(netMinutes)),
            };
        } catch (e) {
            console.error("Invalid date or parsing error:", e);
            return { totalMinutes: 0, netMinutes: 0 };
        }
    }

    const formatMinutesToHours = (minutes: number) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    };
    const { netMinutes } = attendanceData.in_time
        ? getTotalWorkedMinutes(
            attendanceData.in_time,
            attendanceData.out_time || null,
            Number(attendanceData.paused_duration) || 0
        )
        : { netMinutes: 0 };

    // const calculateWorkedMinutes = () => {
    //     if (!attendanceData.in_time || !attendanceData.out_time) return 0;
    //     return calculateTimeDuration(attendanceData.in_time, attendanceData.out_time);
    // };
    const calculateProgressPercentage = () => {
        // const worked = calculateWorkedMinutes();
        // const percent = Math.min(55, 100); // Cap at 100%
        const percent = Math.min((netMinutes / WORKING_MINUTES) * 100, 100); // Cap at 100%
        return Math.round(percent);
    };
    // console.log('in_time:', attendanceData.in_time, 'out_time:', attendanceData.out_time, 'netMinutes:', netMinutes, 'progress:', calculateProgressPercentage());
    return (
        <div className="new_dashboard_greeting_attendancebox">
            <div className="my_new_greeting_attendancebox">
                <LoadingDialog isLoading={isLoading} />
                {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                    setShowAlert(false)
                }} onCloseClicked={function (): void {
                    setShowAlert(false)
                }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                <div className="new_attendancebox_firstbox">
                    <img src={attendanceData.img_attachment ? getImageApiURL + "/uploads/" + attendanceData.img_attachment : staticIconsBaseURL + "/images/user/user.png"} alt="User Image" className="img-fluid" />
                </div>
                <div className="new_attendancebox_middlebox">
                    <div className="new_attendance_middlebox_new_name">
                        <h4>Hello {name}</h4>
                    </div>
                    <div className="new_attendancebox_middlebox_first">
                        <div className="new_attendancebox_middlebox_first_listing_wfh">
                            <div className="wfh_date_listing">
                                <div className="wfh_date_listing_content">{moment().format("dddd")}</div>
                            </div>
                            <div className="wfh_date_listing">
                                <div className="wfh_date_listing_content">{moment().format("LL")}</div>
                            </div>
                            <div className="wfh_date_listing">
                                <div className="wfh_date_listing_content_day">{attendanceData.leap_working_type.type ? attendanceData.leap_working_type.type : "--"}</div>
                            </div>
                        </div>
                        <div className="new_attendancebox_middlebox_first_listing">
                            <div className="new_attendancebox_middlebox_first_listing_leftbox">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32">
                                    <path d="M16.13 31.814a13.514 13.514 0 0 1-9.588-3.966 1.13 1.13 0 1 1 1.597-1.597 11.3 11.3 0 1 0 0-15.98 1.13 1.13 0 1 1-1.597-1.599 13.56 13.56 0 1 1 9.588 23.142z" data-original="#424242" />
                                    <path d="M21.78 25.04a1.13 1.13 0 0 1-.8-.33l-5.65-5.65a1.13 1.13 0 0 1-.33-.8v-7.91a1.13 1.13 0 0 1 2.26 0v7.443l5.318 5.318a1.13 1.13 0 0 1-.798 1.93z" data-original="#424242" />
                                    <path fill="#0f0" d="M11.61 19.39H1.44a1.13 1.13 0 0 1 0-2.26h10.17a1.13 1.13 0 0 1 0 2.26z" data-original="#fbc02d" />
                                    <path fill="#0f0" d="M8.22 22.78a1.13 1.13 0 0 1-.8-1.929l2.592-2.59-2.591-2.592a1.13 1.13 0 0 1 1.597-1.598l3.39 3.39a1.13 1.13 0 0 1 0 1.598l-3.39 3.39a1.13 1.13 0 0 1-.798.331z" data-original="#fbc02d" />
                                    <path d="M18.39 2.44h-4.52a1.13 1.13 0 0 1 0-2.26h4.52a1.13 1.13 0 0 1 0 2.26z" data-original="#424242" />
                                </svg>
                            </div>
                            <div className="new_attendancebox_middlebox_first_listing_rightbox">
                                <div className="new_attendancebox_middlebox_first_listing_heading">In time</div>
                                <div className="new_attendancebox_middlebox_first_listing_time">
                                    {attendanceData.in_time! ? (
                                        <span>
                                            {formatInTimeZone(new Date(attendanceData.in_time), 'UTC', 'hh:mm a')}
                                            {/* {new Date(attendanceData.in_time).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })} */}
                                        </span>
                                    ) : <span>--</span>}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="new_attendancebox_lastbox">
                <img src="/images/user/attendance.png" alt="Attendance Image" className="img-fluid" />
            </div> */}
                <div className="new_attendancebox_lastbox" style={{ width: 140 }}>
                    <div className="dial_container">
                        <div className="dial_overlay">
                            <img src={staticIconsBaseURL + "/images/user/dashboard-background.png"} alt='Attendance Image' className="dial_image img-fluid" />
                        </div>
                        <div className="dial_overlay_office">
                            Working Time
                        </div>
                        <CircularProgressbar
                            value={calculateProgressPercentage()}
                            text={formatMinutesToHours(netMinutes)}
                            background
                            // backgroundPadding={6}
                            styles={buildStyles({
                                backgroundColor: "transparent",
                                textColor: "#000",
                                pathColor: "#ed2024",
                                trailColor: "transparent",
                                textSize: "14px"
                            })}
                        />
                    </div>
                </div>
            </div>

            {/* ---- */}
            <div className="new_attendancebox_middlebox_secondbox">
                <div className="nw_my_sweeper_btn_mainbox">
                    <div className="swiper-button-prev-custom-new">
                        <svg width="15" height="15" x="0" y="0" viewBox="0 0 512 512">
                            <g transform="matrix(-1.4100000000000015,1.7267519867977699e-16,-1.7267519867977699e-16,-1.4100000000000015,616.9607722473147,616.959521942139)">
                                <path d="M398.5 281h-298c-13.81 0-25-11.19-25-25s11.19-25 25-25h298c13.81 0 25 11.19 25 25s-11.19 25-25 25z" fill="#7492a9" opacity="1" data-original="#000000"></path>
                                <path d="M284.01 399.25a24.96 24.96 0 0 1-18.34-8c-9.39-10.12-8.79-25.94 1.33-35.33l107.47-99.67-110.72-99.94c-10.25-9.25-11.06-25.06-1.81-35.31s25.06-11.06 35.31-1.81l131 118.25c5.21 4.7 8.2 11.37 8.25 18.39s-2.85 13.73-8 18.5L301 392.58a24.917 24.917 0 0 1-16.99 6.67z" fill="#7492a9" opacity="1" data-original="#000000"></path>
                            </g>
                        </svg>
                    </div>
                    <div className="swiper-button-next-custom-new">
                        <svg width="15" height="15" x="0" y="0" viewBox="0 0 512 512">
                            <g transform="matrix(1.4100000000000015,0,0,1.4100000000000015,-104.96013137817437,-104.95991867065476)">
                                <path d="M398.5 281h-298c-13.81 0-25-11.19-25-25s11.19-25 25-25h298c13.81 0 25 11.19 25 25s-11.19 25-25 25z" fill="#7492a9" opacity="1" data-original="#000000"></path>
                                <path d="M284.01 399.25a24.96 24.96 0 0 1-18.34-8c-9.39-10.12-8.79-25.94 1.33-35.33l107.47-99.67-110.72-99.94c-10.25-9.25-11.06-25.06-1.81-35.31s25.06-11.06 35.31-1.81l131 118.25c5.21 4.7 8.2 11.37 8.25 18.39s-2.85 13.73-8 18.5L301 392.58a24.917 24.917 0 0 1-16.99 6.67z" fill="#7492a9" opacity="1" data-original="#000000"></path>
                            </g>
                        </svg>
                    </div>
                </div>
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        nextEl: '.swiper-button-next-custom-new',
                        prevEl: '.swiper-button-prev-custom-new',
                    }}
                    spaceBetween={10}
                    slidesPerView={1}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                >
                    {attendanceData != null && attendanceData.pause_start_time ? <>
                        {attendanceData.pause_start_time.map((breakTime, index) =>
                            <SwiperSlide key={index}>
                                <div className="breaks_slider_mainbox" >
                                    <div className="new_attendancebox_middlebox_second_heading">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="15" height="15" x="0" y="0" viewBox="0 0 128 128">
                                                <g>
                                                    <path d="M115.247 48.511h-12.908v-5.253a1.751 1.751 0 0 0-1.75-1.75H16.554a1.751 1.751 0 0 0-1.75 1.75v22.1a40.8 40.8 0 0 0 24.257 37.25H1.75a1.751 1.751 0 0 0-1.75 1.75 10.662 10.662 0 0 0 10.65 10.65h95.843a10.662 10.662 0 0 0 10.65-10.65 1.751 1.751 0 0 0-1.75-1.75H78.082a40.991 40.991 0 0 0 17.685-15.1h19.48A12.765 12.765 0 0 0 128 74.758v-13.5a12.765 12.765 0 0 0-12.753-12.747Zm-12.908 11.5h12.908a1.252 1.252 0 0 1 1.25 1.25v13.5a1.252 1.252 0 0 1-1.25 1.25h-14.329a40.636 40.636 0 0 0 1.421-10.65Zm11.087 46.1a7.161 7.161 0 0 1-6.933 5.4H10.65a7.161 7.161 0 0 1-6.933-5.4h109.709Zm-51.837-3.5h-6.035A37.292 37.292 0 0 1 18.3 65.358v-20.35h80.539v20.35a37.292 37.292 0 0 1-37.25 37.25ZM124.5 74.758a9.261 9.261 0 0 1-9.25 9.25H97.8a40.388 40.388 0 0 0 2-4.5h15.445a4.756 4.756 0 0 0 4.75-4.75v-13.5a4.756 4.756 0 0 0-4.75-4.75h-12.906v-4.5h12.908a9.261 9.261 0 0 1 9.25 9.25ZM40.99 33.875a1.75 1.75 0 0 0 3.5 0 7.729 7.729 0 0 1 .847-3.755 11.124 11.124 0 0 0 1.153-5.185 11.122 11.122 0 0 0-1.153-5.184A7.729 7.729 0 0 1 44.49 16a7.714 7.714 0 0 1 .847-3.751 11.116 11.116 0 0 0 1.153-5.186 1.75 1.75 0 0 0-3.5 0 7.714 7.714 0 0 1-.847 3.751A11.1 11.1 0 0 0 40.99 16a11.114 11.114 0 0 0 1.153 5.185 7.724 7.724 0 0 1 .847 3.754 7.726 7.726 0 0 1-.847 3.755 11.118 11.118 0 0 0-1.153 5.181ZM55.821 33.875a1.75 1.75 0 0 0 3.5 0 7.729 7.729 0 0 1 .847-3.755 11.111 11.111 0 0 0 1.153-5.185 11.11 11.11 0 0 0-1.153-5.184A7.729 7.729 0 0 1 59.321 16a7.714 7.714 0 0 1 .847-3.751 11.1 11.1 0 0 0 1.153-5.182 1.75 1.75 0 0 0-3.5 0 7.714 7.714 0 0 1-.847 3.751A11.116 11.116 0 0 0 55.821 16a11.127 11.127 0 0 0 1.153 5.185 7.724 7.724 0 0 1 .847 3.754 7.726 7.726 0 0 1-.847 3.755 11.13 11.13 0 0 0-1.153 5.181ZM70.653 33.875a1.75 1.75 0 0 0 3.5 0A7.716 7.716 0 0 1 75 30.12a11.126 11.126 0 0 0 1.152-5.185A11.124 11.124 0 0 0 75 19.751 7.716 7.716 0 0 1 74.153 16 7.7 7.7 0 0 1 75 12.245a11.118 11.118 0 0 0 1.152-5.182 1.75 1.75 0 0 0-3.5 0 7.714 7.714 0 0 1-.847 3.751A11.116 11.116 0 0 0 70.653 16a11.127 11.127 0 0 0 1.153 5.185 7.724 7.724 0 0 1 .847 3.754 7.726 7.726 0 0 1-.847 3.755 11.13 11.13 0 0 0-1.153 5.181Z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                </g>
                                            </svg>
                                        </span>Breaks:
                                    </div>
                                    <div className="new_attendance_break_mainbox">
                                        <div className="new_attendance_break_leftbox">
                                            From <span>{formatInTimeZone(new Date(breakTime), 'UTC', 'hh:mm a')}</span>
                                            to <span>{attendanceData.pause_end_time && attendanceData.pause_end_time.length > 0 &&  attendanceData.pause_end_time[index]? formatInTimeZone(new Date(attendanceData?.pause_end_time[index]), 'UTC', 'hh:mm a') : "--"}</span>
                                        </div>
                                        <div className="new_attendance_break_rightbox">
                                            Duration: {attendanceData.pause_end_time && attendanceData.pause_end_time.length > 0 && attendanceData.pause_end_time[index]? calculateTimeDuration(breakTime, attendanceData.pause_end_time[index]) : "--"} mins
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )} </> :
                        <div className="breaks_slider_mainbox">
                            <div className="new_attendancebox_middlebox_second_heading">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="15" height="15" x="0" y="0" viewBox="0 0 128 128">
                                        <g>
                                            <path d="M115.247 48.511h-12.908v-5.253a1.751 1.751 0 0 0-1.75-1.75H16.554a1.751 1.751 0 0 0-1.75 1.75v22.1a40.8 40.8 0 0 0 24.257 37.25H1.75a1.751 1.751 0 0 0-1.75 1.75 10.662 10.662 0 0 0 10.65 10.65h95.843a10.662 10.662 0 0 0 10.65-10.65 1.751 1.751 0 0 0-1.75-1.75H78.082a40.991 40.991 0 0 0 17.685-15.1h19.48A12.765 12.765 0 0 0 128 74.758v-13.5a12.765 12.765 0 0 0-12.753-12.747Zm-12.908 11.5h12.908a1.252 1.252 0 0 1 1.25 1.25v13.5a1.252 1.252 0 0 1-1.25 1.25h-14.329a40.636 40.636 0 0 0 1.421-10.65Zm11.087 46.1a7.161 7.161 0 0 1-6.933 5.4H10.65a7.161 7.161 0 0 1-6.933-5.4h109.709Zm-51.837-3.5h-6.035A37.292 37.292 0 0 1 18.3 65.358v-20.35h80.539v20.35a37.292 37.292 0 0 1-37.25 37.25ZM124.5 74.758a9.261 9.261 0 0 1-9.25 9.25H97.8a40.388 40.388 0 0 0 2-4.5h15.445a4.756 4.756 0 0 0 4.75-4.75v-13.5a4.756 4.756 0 0 0-4.75-4.75h-12.906v-4.5h12.908a9.261 9.261 0 0 1 9.25 9.25ZM40.99 33.875a1.75 1.75 0 0 0 3.5 0 7.729 7.729 0 0 1 .847-3.755 11.124 11.124 0 0 0 1.153-5.185 11.122 11.122 0 0 0-1.153-5.184A7.729 7.729 0 0 1 44.49 16a7.714 7.714 0 0 1 .847-3.751 11.116 11.116 0 0 0 1.153-5.186 1.75 1.75 0 0 0-3.5 0 7.714 7.714 0 0 1-.847 3.751A11.1 11.1 0 0 0 40.99 16a11.114 11.114 0 0 0 1.153 5.185 7.724 7.724 0 0 1 .847 3.754 7.726 7.726 0 0 1-.847 3.755 11.118 11.118 0 0 0-1.153 5.181ZM55.821 33.875a1.75 1.75 0 0 0 3.5 0 7.729 7.729 0 0 1 .847-3.755 11.111 11.111 0 0 0 1.153-5.185 11.11 11.11 0 0 0-1.153-5.184A7.729 7.729 0 0 1 59.321 16a7.714 7.714 0 0 1 .847-3.751 11.1 11.1 0 0 0 1.153-5.182 1.75 1.75 0 0 0-3.5 0 7.714 7.714 0 0 1-.847 3.751A11.116 11.116 0 0 0 55.821 16a11.127 11.127 0 0 0 1.153 5.185 7.724 7.724 0 0 1 .847 3.754 7.726 7.726 0 0 1-.847 3.755 11.13 11.13 0 0 0-1.153 5.181ZM70.653 33.875a1.75 1.75 0 0 0 3.5 0A7.716 7.716 0 0 1 75 30.12a11.126 11.126 0 0 0 1.152-5.185A11.124 11.124 0 0 0 75 19.751 7.716 7.716 0 0 1 74.153 16 7.7 7.7 0 0 1 75 12.245a11.118 11.118 0 0 0 1.152-5.182 1.75 1.75 0 0 0-3.5 0 7.714 7.714 0 0 1-.847 3.751A11.116 11.116 0 0 0 70.653 16a11.127 11.127 0 0 0 1.153 5.185 7.724 7.724 0 0 1 .847 3.754 7.726 7.726 0 0 1-.847 3.755 11.13 11.13 0 0 0-1.153 5.181Z" fill="#000000" opacity="1" data-original="#000000"></path>
                                        </g>
                                    </svg>
                                </span>Breaks:
                            </div>
                            <div className="new_attendance_break_mainbox">
                                <span>No breaks were taken</span>
                            </div>
                        </div>
                    }
                </Swiper>
            </div>
            {/* ---- */}
        </div>
    )
}
export default UserAttendanceTimer

async function getTotalWorkingHours(id: string) {

    let query = supabase
        .from('leap_client')
        .select('fullday_working_hours')
        .eq('client_id', id);

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }
}

async function getUserName(id: string) {

    let query = supabase
        .from('leap_customer')
        .select('name')
        .eq('customer_id', id);

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }
}