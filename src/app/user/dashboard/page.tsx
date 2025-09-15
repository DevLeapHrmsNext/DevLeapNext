

// User dashboard

'use client'
import React, { useEffect, useRef, useState } from 'react'
import LeapHeader from '../../components/header'
import LeftPannel from '../../components/leftPannel';
import { useRouter } from 'next/navigation';
import Footer from '../../components/footer';
import { useGlobalContext } from '../../contextProviders/loggedInGlobalContext';
import { clientAdminDashboard, getImageApiURL, staticIconsBaseURL } from '../../pro_utils/stringConstants';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import ShowAlertMessage from '@/app/components/alert'

interface userPermissionModel {
    permission_id: '',
    is_allowed: false
}
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import GreetingBlock from '@/app/components/userGreetingBlock';
import UserAttendanceTimer from '@/app/components/userAttendanceTimer';
import { CustomerLeavePendingCount } from '@/app/models/leaveModel';
import moment from 'moment';
import {  pageURL_userAnnouncement, pageURL_userApplyLeaveForm, pageURL_userAsset, pageURL_userAttendance, pageURL_userDoc, pageURL_userFillTask, pageURL_userLeave, pageURL_userSupport, pageURL_userSupportForm, pageURL_userTaskListingPage, pageURL_userTeamAttendanceList, pageURL_userTeamLeave } from '@/app/pro_utils/stringRoutes';
import { AttendanceTimer, ManagerData, MyTask, Subordinate, TeamMember, UserNotification} from '@/app/models/userDashboardModel';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import UserNotificationCorner from '@/app/components/userNotification';

const Dashboard = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const swiperRef = useRef<any>(null);
    const [isLoading, setLoading] = useState(false);
    const [balancearray, setBalanceLeave] = useState<CustomerLeavePendingCount[]>([]);
    const [holidays, setHolidays] = useState<any[]>([]);
    const [permissionData, setPermissionData] = useState<userPermissionModel[]>();
    const { contaxtBranchID, contextClientID, contextRoleID, contextCustomerID, setGlobalState } = useGlobalContext();
    const [taskarray, setTask] = useState<MyTask[]>([]);
    const [firstName, setName] = useState<any[]>([]);
    const [workingTime, setWorkingTime] = useState<any[]>([]);
    const [managerData, setManagerData] = useState<ManagerData>();
    const [teamArray, setTeam] = useState<TeamMember[]>([]);
    const [subordinateArray, setSubArray] = useState<Subordinate[]>([]);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [tabSelectedIndex, setTabSelectedIndex] = useState(0);
    const [attendanceData, setAttendanceData] = useState<AttendanceTimer>();
    const [greetArray, setGreetData] = useState<any>();
    const [notificationData, setNotifyData] = useState<UserNotification[]>([]);
    const [showNoti, setShowNoti] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');


    useEffect(() => {

        fetchDashboard();
        fetchTeamMembers();
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

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/clientAdmin/dashboard", {
                method: "POST",
                body: JSON.stringify({
                    "client_id": contextClientID,
                    "branch_id": contaxtBranchID,
                    "customer_id": contextCustomerID,
                    "role_id": contextRoleID,
                    "platform": "web",
                }),
            });
            const response = await res.json();
            if (response.status === 1) {

                setWorkingTime(response.workingHour);
                setGreetData(response.greeting);
                setHolidays(response.upcommingHolidays.holidays);
                setBalanceLeave(response.myLeaveBalances.customerLeavePendingCount);
                setAttendanceData(response.myattendance[0]);
                setTask(response.my_tasks);
                setName(response.my_name.firstName);
                setNotifyData(response.notification);
            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load dashboard");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent("Failed to load");
            setAlertForSuccess(2)
        }
    };

    const fetchTeamMembers = async () => {
        try {
            const res = await fetch(`/api/users/getTeamMembers`, {
                method: "POST",
                body: JSON.stringify({
                    "customer_id": contextCustomerID,
                }),
            });
            const response = await res.json();
            const managerData = response.data.manager;
            const teamData = response.data.teamMembers;
            const subData = response.data.subordinates;
            if (response.status === 1) {
                setManagerData(managerData)
                setTeam(teamData)
                setSubArray(subData)
            } else {
                // setManagerData([]);
                setTeam([]);
                setSubArray([]);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load team members");
                setAlertForSuccess(2)
            }
            setLoadingCursor(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent("Error loading team data");
            setAlertForSuccess(2)
        }
    };

    const checkPermission = (permissionId: any) => {
        if (permissionData) {
            for (let i = 0; i < permissionData?.length; i++) {
                if (permissionData[i].permission_id === permissionId) {
                    return permissionData[i].is_allowed;
                }
            }
        }
    }
    function extractFirstLetters(sentence: string) {
        const words = sentence.split(" ");
        let result = "";
        for (const word of words) {
            result += word.charAt(0);
        }
        return result;
    }
    return (
        <div className='mainbox user_mainbox_new_design'>
            <header>
                <LeapHeader title={clientAdminDashboard} />
            </header>
            <LeftPannel menuIndex={20} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                <div>
                    {/* <LoadingDialog isLoading={isLoading} /> */}
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)
                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-9">
                                <div className="new_user_dashbord_leftbox">
                                    <div className="new_user_left_firstmainbox">
                                         {greetArray && <GreetingBlock greetData = {greetArray}/>}
                                        {attendanceData && < UserAttendanceTimer data={attendanceData} name={firstName} workingHour={workingTime} />}
                                    </div>
                                    {/* {checkPermission(permission_m_leave_7) && */}
                                    <div className="new_user_left_fourthmainbox">
                                        <div className="new_user_fourth_leftbox">
                                            {/* ---- */}
                                            <div className="nw_my_sweeper_btn_mainbox">
                                                <div className="swiper-button-prev-custom">
                                                    <svg width="18" height="18" x="0" y="0" viewBox="0 0 512 512">
                                                        <g transform="matrix(-1,-1.2246467991473532e-16,1.2246467991473532e-16,-1,512.1365356445312,511.99977916479116)">
                                                            <path d="M121.373 457.373 322.745 256 121.373 54.627a32 32 0 0 1 45.254-45.254l224 224a32 32 0 0 1 0 45.254l-224 224a32 32 0 0 1-45.254-45.254z" fill="#7492a9" opacity="1" data-original="#000000"></path>
                                                        </g>
                                                    </svg>
                                                </div>
                                                <div className="swiper-button-next-custom">
                                                    <svg width="18" height="18" x="0" y="0" viewBox="0 0 512 512"><g>
                                                        <path d="M121.373 457.373 322.745 256 121.373 54.627a32 32 0 0 1 45.254-45.254l224 224a32 32 0 0 1 0 45.254l-224 224a32 32 0 0 1-45.254-45.254z" fill="#7492a9" opacity="1" data-original="#000000"></path>
                                                    </g>
                                                    </svg>
                                                </div>
                                            </div>
                                            <Swiper
                                                modules={[Navigation]}
                                                navigation={{
                                                    nextEl: '.swiper-button-next-custom',
                                                    prevEl: '.swiper-button-prev-custom',
                                                }}
                                                // spaceBetween={10}
                                                // slidesPerView={4}
                                                breakpoints={{
                                                    992: {
                                                        slidesPerView: 3,
                                                    },
                                                    // when window width is >= 1200px
                                                    1200: {
                                                        slidesPerView: 4,
                                                    },
                                                }}
                                            >
                                                {balancearray.map((balance, index) =>
                                                    <SwiperSlide key={index}>
                                                        <div className="d_user_leave_balance_listing">
                                                            <CircularProgressbar
                                                                value={balance.leaveBalance}
                                                                maxValue={balance.leaveAllotedCount}
                                                                // text=
                                                                // text={balance.leaveType}
                                                                strokeWidth={12}
                                                                styles={buildStyles({
                                                                    textColor: "#000",
                                                                    pathColor: "#899DAF",
                                                                    trailColor: "#C2D4E4",
                                                                    // textSize: "14px"
                                                                })} />
                                                            <div className="new_home_leave_balance_typebox_remaining_box">
                                                                <div className="new_home_leave_balance_typebox">
                                                                    {extractFirstLetters(balance.leaveType)}
                                                                </div>
                                                                {/* add condition */}
                                                                {
                                                                    (balance.leaveBalance.toString().length > 2 || balance.leaveAllotedCount.toString().length > 2) ? (
                                                                        <div className="new_home_leave_balance_remaining new_home_leave_balance_remaining_three">
                                                                            {balance.leaveBalance + "/" + balance.leaveAllotedCount}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="new_home_leave_balance_remaining">
                                                                            {balance.leaveBalance + "/" + balance.leaveAllotedCount}
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                            <div className='user_balance_tooltip'>
                                                                <div className="ser_tool_tip_content">
                                                                    {balance.leaveType}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                )}
                                            </Swiper>
                                            {/* ---- */}
                                        </div>
                                        <div className="new_user_fourth_rightbox">
                                            <div className="new_user_fourth_right_btnbox">
                                                <a href={pageURL_userApplyLeaveForm}>
                                                    <div className="new_user_apply_new_btnbox">
                                                        <div className="new_user_apply_new_leftbox">
                                                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="20" x="0" y="0" viewBox="0 0 520 520">
                                                                <g transform="matrix(1.13,0,0,1.13,-33.799775848388606,-33.800293083190866)">
                                                                    <path d="M239.987 460.841a10 10 0 0 1-7.343-3.213L34.657 243.463A10 10 0 0 1 42 226.675h95.3a10.006 10.006 0 0 1 7.548 3.439l66.168 76.124c7.151-15.286 20.994-40.738 45.286-71.752 35.912-45.85 102.71-113.281 216.994-174.153a10 10 0 0 1 10.85 16.712c-.436.341-44.5 35.041-95.212 98.6-46.672 58.49-108.714 154.13-139.243 277.6a10 10 0 0 1-9.707 7.6z" data-name="6-Check" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div className="new_user_apply_new_rightbox">Apply Leave</div>
                                                    </div>
                                                </a>
                                            </div>
                                            {contextRoleID != "5" &&
                                                <div className="new_user_fourth_right_btnbox">
                                                    <a href={pageURL_userTeamLeave}>
                                                        <div className="new_user_apply_new_btnbox">
                                                            <div className="new_user_apply_new_leftbox">
                                                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="20" x="0" y="0" viewBox="0 0 24 24">
                                                                    <g transform="matrix(1.0999999999999999,0,0,1.0999999999999999,-1.199999940395351,-1.1999999999999957)">
                                                                        <path d="M17.233 15.328a4.773 4.773 0 0 0-4.7-4.078h-1.064a4.773 4.773 0 0 0-4.7 4.078l-.51 3.566a.75.75 0 0 0 .213.636c.2.2 1.427 1.22 5.53 1.22s5.327-1.016 5.53-1.22a.75.75 0 0 0 .213-.636zM7.56 11.8a5.7 5.7 0 0 0-1.78 3.39l-.37 2.56c-2.97-.02-3.87-1.1-4.02-1.32a.739.739 0 0 1-.13-.56l.22-1.24a4.093 4.093 0 0 1 6.08-2.83zM22.74 15.87a.739.739 0 0 1-.13.56c-.15.22-1.05 1.3-4.02 1.32l-.37-2.56a5.7 5.7 0 0 0-1.78-3.39 4.093 4.093 0 0 1 6.08 2.83zM7.73 9.6a2.714 2.714 0 0 1-2.23 1.15A2.75 2.75 0 1 1 7.15 5.8 4.812 4.812 0 0 0 7 7a5.01 5.01 0 0 0 .73 2.6zM21.25 8a2.748 2.748 0 0 1-2.75 2.75 2.714 2.714 0 0 1-2.23-1.15A5.01 5.01 0 0 0 17 7a4.812 4.812 0 0 0-.15-1.2 2.75 2.75 0 0 1 4.4 2.2z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                        <circle cx="12" cy="7" r="3.75" fill="#ffffff" opacity="1" data-original="#000000"></circle>
                                                                    </g>
                                                                </svg>
                                                            </div>
                                                            <div className="new_user_apply_new_rightbox">My Team</div>
                                                        </div>
                                                    </a>
                                                </div>}
                                        </div>
                                    </div>
                                    {/* } */}
                                    <div className="new_user_btns">
                                        <a href={pageURL_userAnnouncement}>
                                            <div className="new_user_btnlist ">
                                                {/* new_user_btnlist_announcement */}
                                                <div className="new_user_btnlist_left">
                                                    <img src={staticIconsBaseURL + "/images/user/megaphone.gif"} alt="Assets Icon" className="img-fluid" />
                                                </div>
                                                <div className="new_user_btnlist_right">
                                                    Announcement
                                                </div>
                                                {/* <div className="new_user_announcement_countbox">
                                                    2
                                                </div> */}
                                            </div>
                                        </a>
                                        <a href={pageURL_userFillTask}>
                                            <div className="new_user_btnlist">
                                                <div className="new_user_btnlist_left">
                                                    <img src={staticIconsBaseURL + "/images/user/task_gif.gif"} alt="Salary Slip Icon" className="img-fluid" />
                                                </div>
                                                <div className="new_user_btnlist_right">
                                                    Add Task
                                                </div>
                                            </div>
                                        </a>
                                        {/* }  */}
                                        {/* {checkPermission(permission_m_asset_6) && */}
                                        <a href={pageURL_userAsset}>
                                            <div className="new_user_btnlist">
                                                <div className="new_user_btnlist_left">
                                                    <img src={staticIconsBaseURL + "/images/user/asset.gif"} alt="Assets Icon" className="img-fluid" />
                                                </div>
                                                <div className="new_user_btnlist_right">
                                                    My Assets
                                                </div>
                                            </div>
                                        </a>
                                        {/* }  */}
                                        {/* {checkPermission(permission_m_document_8) && */}
                                        <a href={pageURL_userDoc}>
                                            <div className="new_user_btnlist">
                                                <div className="new_user_btnlist_left">
                                                    <img src={staticIconsBaseURL + "/images/user/document.gif"} alt="Documents Icon" className="img-fluid" />
                                                </div>
                                                <div className="new_user_btnlist_right">
                                                    Documents
                                                </div>
                                            </div>
                                        </a>
                                        {/* }  */}
                                        {/* {checkPermission(permission_m_help_10) && */}
                                        <a href={pageURL_userSupportForm}>
                                            <div className="new_user_btnlist">
                                                <div className="new_user_btnlist_left">
                                                    <img src={staticIconsBaseURL + "/images/user/help.gif"} alt="Help Icon" className="img-fluid" />
                                                </div>
                                                <div className="new_user_btnlist_right">
                                                    Need Help
                                                </div>
                                            </div>
                                        </a>
                                        {/* } */}
                                    </div>
                                    <div className="new_user_left_thirdmainbox">
                                        <div className="new_home_tabbing_mainbox">
                                            <div className="new_home_tabs_box">
                                                <ul>
                                                    <li className={tabSelectedIndex == 0 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={0}>
                                                        <a onClick={(e) => { setTabSelectedIndex(0), setLoadingCursor(true) }} className={tabSelectedIndex == 0 ? "nw_user_selected" : "new_list_view_heading"}>
                                                            <div className="nw_user_tab_icon">
                                                                <svg width="20" height="20" x="0" y="0" viewBox="0 0 64 64">
                                                                    <g transform="matrix(1.2300000000000009,0,0,1.2300000000000009,-7.360000000000028,-7.360000000000028)"><path d="M14.186 42.406c-.047 0-.095-.003-.144-.01a19.84 19.84 0 0 1-6.513-2.132 1.001 1.001 0 0 1 .942-1.766 17.78 17.78 0 0 0 5.856 1.917 1.001 1.001 0 0 1-.141 1.991zM49.814 42.406a1 1 0 0 1-.141-1.99 17.773 17.773 0 0 0 5.856-1.917 1.002 1.002 0 0 1 .942 1.766 19.84 19.84 0 0 1-6.513 2.132 1.184 1.184 0 0 1-.144.009zM39.354 33.429a.998.998 0 0 1-.837-1.546 7.622 7.622 0 0 1 6.405-3.471 1 1 0 1 1 0 2 5.624 5.624 0 0 0-4.729 2.563.997.997 0 0 1-.839.454z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                                        <path d="M47.139 30.412c-3.545 0-6.539-2.994-6.539-6.538s2.994-6.538 6.539-6.538c3.544 0 6.538 2.994 6.538 6.538s-2.994 6.538-6.538 6.538zm0-11.076c-2.46 0-4.539 2.078-4.539 4.538s2.079 4.538 4.539 4.538 4.538-2.078 4.538-4.538-2.078-4.538-4.538-4.538z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                                        <path d="M56 37.059a1 1 0 0 1-1-1 5.653 5.653 0 0 0-5.646-5.646 1 1 0 1 1 0-2c4.216 0 7.646 3.431 7.646 7.646a1 1 0 0 1-1 1z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                                        <path d="M49.354 30.412h-4.431a1 1 0 1 1 0-2h4.431a1 1 0 1 1 0 2zM56 40.382a1 1 0 0 1-1-1v-3.323a1 1 0 1 1 2 0v3.323a1 1 0 0 1-1 1zM20.185 41.12a1 1 0 0 1-1-1c0-5.438 4.424-9.861 9.861-9.861a1 1 0 1 1 0 2c-4.335 0-7.861 3.526-7.861 7.861a1 1 0 0 1-1 1z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                                        <path d="M34.954 32.259h-5.908a1 1 0 1 1 0-2h5.908a1 1 0 1 1 0 2zM24.646 33.429a1 1 0 0 1-.839-.454 5.627 5.627 0 0 0-4.729-2.563 1 1 0 1 1 0-2 7.62 7.62 0 0 1 6.405 3.471 1 1 0 0 1-.837 1.546zM20.185 45.551a1 1 0 0 1-1-1V40.12a1 1 0 1 1 2 0v4.431a1 1 0 0 1-1 1z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                                        <path d="M32 32.259c-4.545 0-8.385-3.84-8.385-8.385s3.84-8.385 8.385-8.385 8.385 3.84 8.385 8.385-3.84 8.385-8.385 8.385zm0-14.77c-3.461 0-6.385 2.924-6.385 6.385s2.924 6.385 6.385 6.385 6.385-2.924 6.385-6.385-2.924-6.385-6.385-6.385z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                                        <path d="M43.815 41.12a1 1 0 0 1-1-1c0-4.335-3.526-7.861-7.861-7.861a1 1 0 1 1 0-2c5.438 0 9.861 4.424 9.861 9.861a1 1 0 0 1-1 1z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                                        <path d="M43.815 45.551a1 1 0 0 1-1-1V40.12a1 1 0 1 1 2 0v4.431a1 1 0 0 1-1 1z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                                        <path d="M32 48.511c-4.22 0-8.439-1.026-12.286-3.077a1.002 1.002 0 0 1 .942-1.766 24.065 24.065 0 0 0 22.689 0 1.002 1.002 0 0 1 .942 1.766A26.112 26.112 0 0 1 32 48.511zM16.861 30.412c-3.544 0-6.538-2.994-6.538-6.538s2.994-6.538 6.538-6.538 6.538 2.994 6.538 6.538-2.994 6.538-6.538 6.538zm0-11.076c-2.46 0-4.538 2.078-4.538 4.538s2.078 4.538 4.538 4.538 4.538-2.078 4.538-4.538-2.078-4.538-4.538-4.538z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                                        <path d="M8 37.059a1 1 0 0 1-1-1c0-4.216 3.431-7.646 7.646-7.646a1 1 0 1 1 0 2A5.651 5.651 0 0 0 9 36.059a1 1 0 0 1-1 1z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                                        <path d="M19.077 30.412h-4.431a1 1 0 1 1 0-2h4.431a1 1 0 1 1 0 2zM8 40.382a1 1 0 0 1-1-1v-3.323a1 1 0 1 1 2 0v3.323a1 1 0 0 1-1 1z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                                    </g>
                                                                </svg>
                                                            </div>
                                                            <div className="nw_user_tab_name">
                                                                Team Members
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li className={tabSelectedIndex == 1 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={1}>
                                                        <a onClick={(e) => { setTabSelectedIndex(1), setLoadingCursor(true) }} className={tabSelectedIndex == 1 ? "nw_user_selected" : "new_list_view_heading"}>
                                                            <div className="nw_user_tab_icon">
                                                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="20" x="0" y="0" viewBox="0 0 512 512">
                                                                    <g>
                                                                        <path className='black_to_white_fill' d="M446.605 124.392 326.608 4.395A15.02 15.02 0 0 0 316 0H106C81.187 0 61 20.187 61 45v422c0 24.813 20.187 45 45 45h300c24.813 0 45-20.187 45-45V135c0-4.09-1.717-7.931-4.395-10.608zM331 51.213 399.787 120H346c-8.271 0-15-6.729-15-15zM406 482H106c-8.271 0-15-6.729-15-15V45c0-8.271 6.729-15 15-15h195v75c0 24.813 20.187 45 45 45h75v317c0 8.271-6.729 15-15 15z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                                        <path className='black_to_white_fill' d="M346 212H166c-8.284 0-15 6.716-15 15s6.716 15 15 15h180c8.284 0 15-6.716 15-15s-6.716-15-15-15zM346 272H166c-8.284 0-15 6.716-15 15s6.716 15 15 15h180c8.284 0 15-6.716 15-15s-6.716-15-15-15zM346 332H166c-8.284 0-15 6.716-15 15s6.716 15 15 15h180c8.284 0 15-6.716 15-15s-6.716-15-15-15zM286 392H166c-8.284 0-15 6.716-15 15s6.716 15 15 15h120c8.284 0 15-6.716 15-15s-6.716-15-15-15z" fill="#000000" opacity="1" data-original="#000000">
                                                                        </path>
                                                                    </g>
                                                                </svg>
                                                            </div>
                                                            <div className="nw_user_tab_name">
                                                                Today&apos;s Tasks
                                                            </div>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="new_home_tabs_content_box">
                                                {
                                                    tabSelectedIndex == 0 ?
                                                        // Team members
                                                        <>
                                                            <div className="row">
                                                                <div className="col-lg-12">
                                                                    <div className="new_home_team_member_mainbox">
                                                                        {managerData ? <div className="new_home_team_member_listing" >
                                                                            <div className="new_home_team_member_img">
                                                                                <img src={managerData.profile_pic ? getImageApiURL + "/uploads/" + managerData.profile_pic : staticIconsBaseURL + "/images/user/user.png"} alt="Member image" className="img-fluid" />
                                                                            </div>
                                                                            <div className="new_home_team_member_name" style={{ color: "red" }}>
                                                                                {managerData?.name}
                                                                            </div>
                                                                            <div className="new_home_team_member_email">
                                                                                {managerData?.leap_client_designations.designation_name}
                                                                            </div>
                                                                            <div className="new_home_team_member_email">
                                                                                <a href={"mailto:" + managerData?.email_id}>{managerData?.email_id}</a>
                                                                            </div>
                                                                            <div className="new_home_team_member_number">
                                                                                <div className="new_home_team_member_number_icon">
                                                                                    <svg width="14" height="14" x="0" y="0" viewBox="0 0 25.625 25.625">
                                                                                        <g>
                                                                                            <path d="M22.079 17.835c-1.548-1.324-3.119-2.126-4.648-.804l-.913.799c-.668.58-1.91 3.29-6.712-2.234-4.801-5.517-1.944-6.376-1.275-6.951l.918-.8c1.521-1.325.947-2.993-.15-4.71l-.662-1.04C7.535.382 6.335-.743 4.81.58l-.824.72c-.674.491-2.558 2.087-3.015 5.119-.55 3.638 1.185 7.804 5.16 12.375 3.97 4.573 7.857 6.87 11.539 6.83 3.06-.033 4.908-1.675 5.486-2.272l.827-.721c1.521-1.322.576-2.668-.973-3.995l-.931-.801z" fill="#030104" data-original="#030104"></path>
                                                                                        </g>
                                                                                    </svg>
                                                                                </div>
                                                                                <div className="new_home_team_member_number_text">
                                                                                    <a href={"tel:" + managerData?.contact_number}>{managerData?.contact_number}</a>
                                                                                </div>
                                                                            </div>
                                                                        </div> : <>No members alloted yet</>}
                                                                        {teamArray && teamArray.length > 0 ?
                                                                            teamArray?.map((details, index) =>
                                                                                <div className="new_home_team_member_listing" key={index}>
                                                                                    <div className="new_home_team_member_img">
                                                                                        <img src={details.profile_pic ? getImageApiURL + "/uploads/" + details.profile_pic : staticIconsBaseURL + "/images/user/user.png"} alt="Member image" className="img-fluid" />
                                                                                    </div>
                                                                                    <div className="new_home_team_member_name" style={{ color: "red" }}>
                                                                                        {details.name}
                                                                                    </div>
                                                                                    <div className="new_home_team_member_email">
                                                                                        {details.leap_client_designations.designation_name}
                                                                                    </div>
                                                                                    <div className="new_home_team_member_email">
                                                                                        <a href={"mailto:" + details.email_id}>{details.email_id}</a>
                                                                                    </div>
                                                                                    <div className="new_home_team_member_number">
                                                                                        <div className="new_home_team_member_number_icon">
                                                                                            <svg width="14" height="14" x="0" y="0" viewBox="0 0 25.625 25.625">
                                                                                                <g>
                                                                                                    <path d="M22.079 17.835c-1.548-1.324-3.119-2.126-4.648-.804l-.913.799c-.668.58-1.91 3.29-6.712-2.234-4.801-5.517-1.944-6.376-1.275-6.951l.918-.8c1.521-1.325.947-2.993-.15-4.71l-.662-1.04C7.535.382 6.335-.743 4.81.58l-.824.72c-.674.491-2.558 2.087-3.015 5.119-.55 3.638 1.185 7.804 5.16 12.375 3.97 4.573 7.857 6.87 11.539 6.83 3.06-.033 4.908-1.675 5.486-2.272l.827-.721c1.521-1.322.576-2.668-.973-3.995l-.931-.801z" fill="#030104" data-original="#030104"></path>
                                                                                                </g>
                                                                                            </svg>
                                                                                        </div>
                                                                                        <div className="new_home_team_member_number_text">
                                                                                            <a href={"tel:" + details.contact_number}>{details.contact_number}</a>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                            : <></>
                                                                        }
                                                                        {subordinateArray && subordinateArray.length > 0 ?
                                                                            subordinateArray?.map((details, index) =>
                                                                                <div className="new_home_team_member_listing" key={index}>
                                                                                    <div className="new_home_team_member_img">
                                                                                        <img src={details.profile_pic ? getImageApiURL + "/uploads/" + details.profile_pic : staticIconsBaseURL + "/images/user/user.png"} alt="Member image" className="img-fluid" />
                                                                                    </div>
                                                                                    <div className="new_home_team_member_name" style={{ color: "red" }}>
                                                                                        {details.name}
                                                                                    </div>
                                                                                    <div className="new_home_team_member_email">
                                                                                        {details.leap_client_designations.designation_name}
                                                                                    </div>
                                                                                    <div className="new_home_team_member_email">
                                                                                        <a href={"mailto:" + details.email_id}>{details.email_id}</a>
                                                                                    </div>
                                                                                    <div className="new_home_team_member_number">
                                                                                        <div className="new_home_team_member_number_icon">
                                                                                            <svg width="14" height="14" x="0" y="0" viewBox="0 0 25.625 25.625">
                                                                                                <g>
                                                                                                    <path d="M22.079 17.835c-1.548-1.324-3.119-2.126-4.648-.804l-.913.799c-.668.58-1.91 3.29-6.712-2.234-4.801-5.517-1.944-6.376-1.275-6.951l.918-.8c1.521-1.325.947-2.993-.15-4.71l-.662-1.04C7.535.382 6.335-.743 4.81.58l-.824.72c-.674.491-2.558 2.087-3.015 5.119-.55 3.638 1.185 7.804 5.16 12.375 3.97 4.573 7.857 6.87 11.539 6.83 3.06-.033 4.908-1.675 5.486-2.272l.827-.721c1.521-1.322.576-2.668-.973-3.995l-.931-.801z" fill="#030104" data-original="#030104"></path>
                                                                                                </g>
                                                                                            </svg>
                                                                                        </div>
                                                                                        <div className="new_home_team_member_number_text">
                                                                                            <a href={"tel:" + details.contact_number}>{details.contact_number}</a>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                            : <></>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>

                                                        : tabSelectedIndex == 1 ?
                                                            // Task
                                                            <>
                                                                <div className="row">
                                                                    <div className="col-lg-12">
                                                                        <div className="new_home_task_status_list_mainbox">
                                                                            <div className="new_home_task_status_list_listing">
                                                                                <div className="new_home_task_status_list_icon">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 341.333 341.333">
                                                                                        <path fill="#FFA500" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                                                    </svg>
                                                                                </div>
                                                                                <div className="new_home_task_status_list_text">To do</div>
                                                                            </div>
                                                                            <div className="new_home_task_status_list_listing">
                                                                                <div className="new_home_task_status_list_icon">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 341.333 341.333">
                                                                                        <path fill="#007BFF" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                                                    </svg>
                                                                                </div>
                                                                                <div className="new_home_task_status_list_text">Working</div>
                                                                            </div>
                                                                            <div className="new_home_task_status_list_listing">
                                                                                <div className="new_home_task_status_list_icon">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 341.333 341.333">
                                                                                        <path fill="#28A745" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                                                    </svg>
                                                                                </div>
                                                                                <div className="new_home_task_status_list_text">Completed</div>
                                                                            </div>
                                                                            <div className="new_home_task_status_list_listing">
                                                                                <div className="new_home_task_status_list_icon">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 341.333 341.333">
                                                                                        <path fill="#6F42C1" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                                                    </svg>
                                                                                </div>
                                                                                <div className="new_home_task_status_list_text">Assigned</div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="new_home_task_mainbox">
                                                                            {taskarray && taskarray.length > 0 ? (
                                                                                taskarray?.map((data, index) =>
                                                                                    <div className='new_user_home_task_listing' key={index}>
                                                                                        {data.task_status.id == 1 || data.task_status.id == 4 ?
                                                                                            <> <div className="new_home_task_listing new_home_task_type_todo">
                                                                                                <div className="new_home_task_project_namebox">
                                                                                                    <div className="new_home_task_project">{data.sub_project_id.sub_project_name}</div>
                                                                                                    <div className="new_home_task_description">
                                                                                                        {data.task_details}
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="new_home_task_type">
                                                                                                    {data.task_type_id.task_type_name}
                                                                                                </div>
                                                                                            </div> </>
                                                                                            : data.task_status.id == 2 ?
                                                                                                <>
                                                                                                    <div className="new_home_task_listing new_home_task_type_working">
                                                                                                        <div className="new_home_task_project_namebox">
                                                                                                            <div className="new_home_task_project">{data.sub_project_id.sub_project_name}</div>
                                                                                                            <div className="new_home_task_description">
                                                                                                                {data.task_details}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="new_home_task_type">
                                                                                                            {data.task_type_id.task_type_name}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </>
                                                                                                : data.task_status.id == 3 ?
                                                                                                    <>
                                                                                                        <div className="new_home_task_listing new_home_task_type_complete">
                                                                                                            <div className="new_home_task_project_namebox">
                                                                                                                <div className="new_home_task_project">{data.sub_project_id.sub_project_name}</div>
                                                                                                                <div className="new_home_task_description">
                                                                                                                    {data.task_details}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="new_home_task_type">
                                                                                                                {data.task_type_id.task_type_name}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </>
                                                                                                    : data.task_status.id == 5 ?
                                                                                                        <>
                                                                                                            <div className="new_home_task_listing new_home_task_type_assigned">
                                                                                                                <div className="new_home_task_project_namebox">
                                                                                                                    <div className="new_home_task_project">{data.sub_project_id.sub_project_name}</div>
                                                                                                                    <div className="new_home_task_description">
                                                                                                                        {data.task_details}
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="new_home_task_type">
                                                                                                                    {data.task_type_id.task_type_name}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </>
                                                                                                        : <></>}
                                                                                    </div>
                                                                                ))
                                                                                : <> Fill your daily tasks!</>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            : <div />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="new_user_dashbord_rightbox">
                                    {/* {permissionData(permission_m_notification_9) && */}
                                    <div className="new_user_notification_mainbox">
                                        <div className="new_user_notification_headingbox">
                                            <div className="new_user_notification_icon" onClick={()=>{setShowNoti(true)}}>
                                                <img src={staticIconsBaseURL + "/images/user/notification-icon.svg"}  alt="Notification Icon" className="img-fluid" />
                                            </div>
                                            {/* <a href={pageURL_userNotification}> */}
                                                
                                            <div className="new_user_notification_heading" >Notification Corner</div>
                                            {/* </a> */}
                                        </div>
                                        <div className="new_user_notification_listing">
                                            {/*activity_type_id:- 1 - attendance, 
                                                    2 - task,
                                                    3 - leave,
                                                    5 - support */}
                                            {notificationData && notificationData.length > 0 ?
                                                notificationData.map((noti, index) => (
                                                    noti.type == "user" ?
                                                        <ul className="user_notification_list" key={index}>
                                                            <li>
                                                                {noti.activity_type_id === 1 ? (
                                                                    <a href={pageURL_userAttendance}>
                                                                        {noti.activity_details}
                                                                        <span className='notification_detail_icon'>
                                                                            <img src={staticIconsBaseURL + "/images/user/notification-detail-icon.svg"} alt="Notification detail" className="img-fluid" />
                                                                        </span>
                                                                    </a>
                                                                ) : noti.activity_type_id === 2 ? (
                                                                    <a href={pageURL_userTaskListingPage}>
                                                                        {noti.activity_details}
                                                                        <span className='notification_detail_icon'>
                                                                            <img src={staticIconsBaseURL + "/images/user/notification-detail-icon.svg"} alt="Notification detail" className="img-fluid" />
                                                                        </span>
                                                                    </a>
                                                                ): noti.activity_type_id === 3 ? (
                                                                    <a href={pageURL_userLeave}>
                                                                        {noti.activity_details}
                                                                        <span className='notification_detail_icon'>
                                                                            <img src={staticIconsBaseURL + "/images/user/notification-detail-icon.svg"} alt="Notification detail" className="img-fluid" />
                                                                        </span>
                                                                    </a>
                                                                ): noti.activity_type_id === 5 ? (
                                                                    <a href={pageURL_userSupport}>
                                                                        {noti.activity_details}
                                                                        <span className='notification_detail_icon'>
                                                                            <img src={staticIconsBaseURL + "/images/user/notification-detail-icon.svg"} alt="Notification detail" className="img-fluid" />
                                                                        </span>
                                                                    </a>
                                                                ): (
                                                                    <a href="">
                                                                        {noti.activity_details}
                                                                        <span className='notification_detail_icon'>
                                                                            <img src={staticIconsBaseURL + "/images/user/notification-detail-icon.svg"} alt="Notification detail" className="img-fluid" />
                                                                        </span>
                                                                    </a>
                                                                )}
                                                            </li>
                                                        </ul> : noti.type == "team" ?
                                                            <ul className="user_notification_list" key={index}>
                                                            {/* <li><a href="">{noti.customer_name} : {noti.activity_details}<span className='notification_detail_icon'><img src={staticIconsBaseURL + "/images/user/notification-detail-icon.svg"} alt="Notification detail" className="img-fluid" /></span></a></li> */}
                                                            <li>
                                                                {noti.activity_type_id === 1 ? (
                                                                    <a href={pageURL_userTeamAttendanceList}>
                                                                        {noti.customer_name} : {noti.activity_details}
                                                                        <span className='notification_detail_icon'>
                                                                            <img src={staticIconsBaseURL + "/images/user/notification-detail-icon.svg"} alt="Notification detail" className="img-fluid" />
                                                                        </span>
                                                                    </a>
                                                                ) : noti.activity_type_id === 2 ? (
                                                                    <a href={pageURL_userTaskListingPage}>
                                                                        {noti.customer_name} : {noti.activity_details}
                                                                        <span className='notification_detail_icon'>
                                                                            <img src={staticIconsBaseURL + "/images/user/notification-detail-icon.svg"} alt="Notification detail" className="img-fluid" />
                                                                        </span>
                                                                    </a>
                                                                ): noti.activity_type_id === 3 ? (
                                                                    <a href={pageURL_userTeamLeave}>
                                                                        {noti.customer_name} : {noti.activity_details}
                                                                        <span className='notification_detail_icon'>
                                                                            <img src={staticIconsBaseURL + "/images/user/notification-detail-icon.svg"} alt="Notification detail" className="img-fluid" />
                                                                        </span>
                                                                    </a>
                                                                ): (
                                                                    <a href="">
                                                                        {noti.customer_name} : {noti.activity_details}
                                                                        <span className='notification_detail_icon'>
                                                                            <img src={staticIconsBaseURL + "/images/user/notification-detail-icon.svg"} alt="Notification detail" className="img-fluid" />
                                                                        </span>
                                                                    </a>
                                                                )}
                                                            </li>
                                                        </ul> 
                                                        : <></>
                                                )) : (
                                                    <div className="user_notification_list">No Notifications!</div>
                                                )}
                                                
                                        </div>
                                    </div>
                                    {/* } */}
                                    {/* {permissionData(permission_m_holiday_id) && */}
                                    <div className="new_user_holiday_list_mainbox">
                                        <div className="new_user_notification_headingbox">
                                            <div className="new_user_notification_icon">
                                                <img src={staticIconsBaseURL + "/images/user/calender.svg"} alt="Calender Icon" className="img-fluid" />
                                            </div>
                                            <div className="new_user_notification_heading"> Holiday List</div>
                                        </div>
                                        {holidays && holidays.length > 0 ? (
                                            <div className="new_user_notification_listing_scroll">
                                                {holidays.map((holiday, index) => (
                                                    <div className="new_user_notification_listing" key={index}>
                                                        <div className="monthely_holiday_listing" >
                                                            <div className="nw_holiday_table_calender_box">
                                                                <div className="nw_calender_monthBox">{moment(holiday.date).format("MMMM")}</div>
                                                                <div className="nw_calender_dateBox">{moment(holiday.date).format("Do")}</div>
                                                            </div>
                                                            <div className="monthely_holiday_rightbox">
                                                                {holiday.holiday_name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}</div>) : <>
                                            <div className="new_user_notification_listing py-4">No Holidays this month!</div>
                                        </>
                                        }
                                    </div>
                                    {/* } */}
                                    <div className="new_user_meeting_mainbox">
                                        <div className="new_user_meeting_btn_mainbox">
                                            <div className="new_user_meeting_btn_leftbox">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 512.237 512.237">
                                                    <g fill="#f75a5d"><path d="M55.224 265.937h38.882c7.302 0 13.242-5.94 13.242-13.243v-38.881c0-7.302-5.94-13.243-13.242-13.243H55.224c-7.302 0-13.242 5.94-13.242 13.243v38.881c-.001 7.303 5.94 13.243 13.242 13.243zm1.757-50.367h35.366v35.367H56.981V215.57zm88.968 50.367h38.881c7.303 0 13.243-5.94 13.243-13.243v-38.881c0-7.302-5.94-13.243-13.243-13.243h-38.881c-7.303 0-13.243 5.94-13.243 13.243v38.881c0 7.303 5.94 13.243 13.243 13.243zm1.757-50.367h35.367v35.367h-35.367V215.57zm88.968 50.367h38.881c7.303 0 13.243-5.94 13.243-13.243v-38.881c0-7.302-5.94-13.243-13.243-13.243h-38.881c-7.303 0-13.243 5.94-13.243 13.243v38.881c0 7.303 5.94 13.243 13.243 13.243zm1.757-50.367h35.367v35.367h-35.367V215.57zm127.848 50.367c7.303 0 13.243-5.94 13.243-13.243v-38.881c0-7.302-5.94-13.243-13.243-13.243h-38.881c-7.303 0-13.243 5.94-13.243 13.243v38.881c0 7.302 5.94 13.243 13.243 13.243h38.881zm-37.124-50.367h35.367v35.367h-35.367V215.57zm127.85-15h-38.882c-7.302 0-13.242 5.94-13.242 13.243v38.881c0 7.302 5.94 13.243 13.242 13.243h38.882c7.302 0 13.242-5.94 13.242-13.243v-38.881c0-7.302-5.94-13.243-13.242-13.243zm-1.758 50.367h-35.366V215.57h35.366v35.367zm-413.266 85.32c0 7.302 5.94 13.243 13.242 13.243h38.882c7.302 0 13.242-5.94 13.242-13.243v-38.881c0-7.302-5.94-13.243-13.242-13.243H55.224c-7.302 0-13.242 5.94-13.242 13.243v38.881zm15-37.124h35.366V334.5H56.981v-35.367zm75.725 37.124c0 7.302 5.94 13.243 13.243 13.243h38.881c7.303 0 13.243-5.94 13.243-13.243v-38.881c0-7.302-5.94-13.243-13.243-13.243h-38.881c-7.303 0-13.243 5.94-13.243 13.243v38.881zm15-37.124h35.367V334.5h-35.367v-35.367zm75.725 37.124c0 7.302 5.94 13.243 13.243 13.243h38.881c7.303 0 13.243-5.94 13.243-13.243v-38.881c0-7.302-5.94-13.243-13.243-13.243h-38.881c-7.303 0-13.243 5.94-13.243 13.243v38.881zm15-37.124h35.367V334.5h-35.367v-35.367zM41.981 419.819c0 7.302 5.94 13.243 13.242 13.243h38.882c7.302 0 13.242-5.94 13.242-13.243v-38.881c0-7.302-5.94-13.243-13.242-13.243H55.224c-7.302 0-13.242 5.94-13.242 13.243v38.881zm15-37.124h35.366v35.367H56.981v-35.367zm75.725 37.124c0 7.302 5.94 13.243 13.243 13.243h38.881c7.303 0 13.243-5.94 13.243-13.243v-38.881c0-7.302-5.94-13.243-13.243-13.243h-38.881c-7.303 0-13.243 5.94-13.243 13.243v38.881zm15-37.124h35.367v35.367h-35.367v-35.367zm75.725 37.124c0 7.302 5.94 13.243 13.243 13.243h38.881c7.303 0 13.243-5.94 13.243-13.243v-38.881c0-7.302-5.94-13.243-13.243-13.243h-38.881c-7.303 0-13.243 5.94-13.243 13.243v38.881zm15-37.124h35.367v35.367h-35.367v-35.367zm153.771 56.549c41.352 0 75.822-30.972 80.184-72.043a7.5 7.5 0 0 0-6.666-8.25 7.497 7.497 0 0 0-8.25 6.666c-3.549 33.423-31.607 58.627-65.268 58.627-36.197 0-65.646-29.449-65.646-65.646s29.449-65.646 65.646-65.646a65.506 65.506 0 0 1 21.052 3.47 7.501 7.501 0 0 0 4.811-14.208 80.495 80.495 0 0 0-25.862-4.262c-44.469 0-80.646 36.178-80.646 80.646s36.176 80.646 80.645 80.646z" data-original="#000000" /><path d="m447.996 289.964-62.718 58.354-7.717-7.669c-2.162-2.149-5.016-3.367-8.079-3.316a11.339 11.339 0 0 0-8.058 3.368l-15.634 15.733a11.335 11.335 0 0 0-3.316 8.079 11.337 11.337 0 0 0 3.368 8.058l23.063 22.919a22.363 22.363 0 0 0 15.86 6.539c5.705 0 11.147-2.14 15.325-6.027l78.558-73.091c4.605-4.286 4.866-11.519.581-16.126l-15.108-16.238c-4.283-4.607-11.517-4.87-16.125-.583zm-58.121 95.054a7.48 7.48 0 0 1-5.108 2.009 7.455 7.455 0 0 1-5.288-2.18l-20.517-20.389 10.573-10.64 10.285 10.222a7.5 7.5 0 0 0 10.396.171l65.369-60.821 10.218 10.982-75.928 70.646z" data-original="#000000" />
                                                        <path d="M471.044 75.817h-45.98V58.19c0-10.64-8.656-19.296-19.296-19.296h-6.806c-10.641 0-19.297 8.656-19.297 19.296v17.626H132.572V58.19c0-10.64-8.656-19.296-19.296-19.296h-6.806c-10.641 0-19.297 8.656-19.297 19.296v17.626h-45.98C18.479 75.817 0 94.296 0 117.01v244.844c0 4.142 3.357 7.5 7.5 7.5s7.5-3.358 7.5-7.5V174.621h78.892c4.143 0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5H15V117.01c0-14.443 11.75-26.193 26.193-26.193h45.98v17.626c0 10.64 8.656 19.296 19.297 19.296h6.806c10.64 0 19.296-8.656 19.296-19.296V90.817h247.093v17.626c0 10.64 8.656 19.296 19.297 19.296h6.806c10.64 0 19.296-8.656 19.296-19.296V90.817h45.98c14.443 0 26.193 11.75 26.193 26.193v42.611H125.854c-4.143 0-7.5 3.358-7.5 7.5s3.357 7.5 7.5 7.5h371.383v257.53c0 14.443-11.75 26.193-26.193 26.193H41.193C26.75 458.343 15 446.593 15 432.15v-38.334c0-4.142-3.357-7.5-7.5-7.5s-7.5 3.358-7.5 7.5v38.334c0 22.714 18.479 41.193 41.193 41.193h429.851c22.714 0 41.193-18.479 41.193-41.193V117.01c0-22.714-18.479-41.193-41.193-41.193zm-353.472 32.626a4.3 4.3 0 0 1-4.296 4.296h-6.806a4.301 4.301 0 0 1-4.297-4.296V58.19a4.301 4.301 0 0 1 4.297-4.296h6.806a4.3 4.3 0 0 1 4.296 4.296v50.253zm292.491 0a4.3 4.3 0 0 1-4.296 4.296h-6.806a4.301 4.301 0 0 1-4.297-4.296V58.19a4.301 4.301 0 0 1 4.297-4.296h6.806a4.3 4.3 0 0 1 4.296 4.296v50.253z" data-original="#000000" /></g>
                                                </svg>
                                            </div>
                                            <div className="new_user_meeting_btn_rightbox" onClick={() => window.open("https://calendar.google.com/calendar/u/0/r", "_blank")}>
                                                MEETINGS
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="nw_user_offcanvas">
                        <div className={showNoti ? "rightpoup rightpoupopen" : "rightpoup"}>
                            {showNoti && <UserNotificationCorner onClose={() => { setShowNoti(false) }} />}
                        </div>
                        <div className="overlay_offcanvas"></div>
                    </div>
                    
                </div>
            }
            />
            <Footer />
        </div>
    )
}
export default Dashboard