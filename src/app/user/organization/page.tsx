// Here are all the organizational level details:
// Currently company basic details, holiday list and leave policy

'use client'
import React, { useEffect, useState } from 'react'
import LeapHeader from '@/app/components/header'
import Footer from '@/app/components/footer'
import moment from "moment";
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { LeaveType } from '@/app/models/leaveModel'
import { Client } from '@/app/models/companyModel'
import LeftPannel from '@/app/components/leftPannel';
import LoadingDialog from '@/app/components/PageLoader';
import PageErrorCenterContent from '@/app/components/pageError';
import ShowAlertMessage from '@/app/components/alert'
import { ALERTMSG_addAssetSuccess, ALERTMSG_exceptionString, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import { stat } from 'fs';

const HolidayList = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [viewIndex, setViewIndex] = useState(0);
    const [holidays, setHolidays] = useState<any[]>([]);
    const { contextClientID, contaxtBranchID } = useGlobalContext();
    const [leavearray, setLeave] = useState<LeaveType[]>([]);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    const [compData, setCompData] = useState<Client>({
        client_id: parseFloat(contextClientID),
        created_at: '',
        company_name: '',
        number_of_branches: '',
        sector_type: '',
        company_location: '',
        company_number: '',
        company_email: '',
        fullday_working_hours: '',
        halfday_working_hours: '',
        total_weekend_days: '',
        is_deleted: false,
        company_website_url: '',
        timezone_id: '',
        is_a_parent: true,
        user_id: '',
        parent_id: '',
        updated_at: '',
        leap_client_branch_details: {
            id: 0,
            uuid: '',
            client_id: parseFloat(contextClientID),
            dept_name: '',
            is_active: true,
            created_at: '',
            updated_at: '',
            branch_city: '',
            branch_email: '',
            time_zone_id: '',
            branch_number: '',
            branch_address: '',
            is_main_branch: false,
            contact_details: '',
            total_employees: ''
        },
        leap_sector_type: {
            id: 0,
            sector_type: '',
        },
        leap_client_basic_info: [{
            client_id: parseFloat(contextClientID),
            created_at: "",
            updated_at: "",
            company_logo: "",
            company_name: "",
            primary_color: "",
            compnay_websit: "",
            secondary_color: "",
            company_short_name: "",
            client_basic_detail_id: 0
        }]
    });

    useEffect(() => {
        fetchHoliday();
        fetchLeavePolicy();
        fetchCompany();
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

            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const fetchHoliday = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/commonapi/getHolidayList", {
                method: "POST",
                body: JSON.stringify({
                    "client_id": contextClientID,
                    "branch_id": contaxtBranchID,
                    "show_employee": true
                }),
            });
            const response = await res.json();

            if (response.status === 1) {
                setHolidays(response.data.holidays);
                setLoading(false);
            } else {
                setHolidays([]);
                setLoading(false);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load holidays");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
        }
    };
    const fetchLeavePolicy = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/users/showLeaveType", {
                method: "POST",
                body: JSON.stringify({
                    "client_id": contextClientID,
                    "branch_id": contaxtBranchID,
                }),
            });
            const response = await res.json();
            const leaveListData = response.data;
            if (response.status == 1) {
                setLoading(false);
                setLeave(leaveListData);
            } else {
                setLeave([]);
                setLoading(false);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load leave policy");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
        }
    }
    const fetchCompany = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/clientAdmin/getClientProfile", {
                method: "POST",
                body: JSON.stringify({
                    "client_id": contextClientID
                }),
            });
            const response = await res.json();
            const user = response.clients[0];
            if (response.status == 1) {
                setCompData(user);
                setLoading(false);
            } else {
                setLoading(false);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load assets");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
        }
    }

    return (
        <div className='mainbox user_mainbox_new_design'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel
                menuIndex={26}
                subMenuIndex={0}
                showLeftPanel={true}
                rightBoxUI={
                    <div>
                        {/* {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                            setShowAlert(false)
                        }} onCloseClicked={function (): void {
                            setShowAlert(false)
                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />} */}
                        <LoadingDialog isLoading={isLoading} />
                        <div className='container'>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="nw_user_inner_mainbox">
                                        <div className="nw_user_inner_heading_tabbox">
                                            <div className="heading25">
                                                About Organization
                                            </div>
                                            <div className="nw_user_inner_tabs nw_user_inner_right_tabs">
                                                <ul>
                                                    <li className='filter_relative_li'>
                                                        <a href="#id_compony_org">
                                                            <div className="nw_user_tab_icon">
                                                                <svg width="20" height="20" x="0" y="0" viewBox="0 0 24 24">
                                                                    <g>
                                                                        <path fill="#ffffff" d="M20 6h-3V4c0-1.103-.897-2-2-2H9c-1.103 0-2 .897-2 2v2H4c-1.103 0-2 .897-2 2v3h20V8c0-1.103-.897-2-2-2zM9 4h6v2H9zm5 10h-4v-2H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-8z" opacity="1" data-original="#000000"></path>
                                                                    </g>
                                                                </svg>
                                                            </div>
                                                            <div className="nw_user_tab_name">
                                                                Company
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#id_leave_org">
                                                            <div className="nw_user_tab_icon">
                                                                <svg width="20" height="20" x="0" y="0" viewBox="0 0 34 34">
                                                                    <g transform="matrix(0.8500000000000004,0,0,0.8500000000000004,2.557500171661367,2.54999999999999)">
                                                                        <path d="M29.6 2h-3v3c0 .6-.5 1-1 1s-1-.4-1-1V2h-16v3c0 .6-.5 1-1 1s-1-.4-1-1V2h-3C2.1 2 1 3.3 1 5v3.6h32V5c0-1.7-1.8-3-3.4-3zM1 10.7V29c0 1.8 1.1 3 2.7 3h26c1.6 0 3.4-1.3 3.4-3V10.7zm8.9 16.8H7.5c-.4 0-.8-.3-.8-.8v-2.5c0-.4.3-.8.8-.8H10c.4 0 .8.3.8.8v2.5c-.1.5-.4.8-.9.8zm0-9H7.5c-.4 0-.8-.3-.8-.8v-2.5c0-.4.3-.8.8-.8H10c.4 0 .8.3.8.8v2.5c-.1.5-.4.8-.9.8zm8 9h-2.5c-.4 0-.8-.3-.8-.8v-2.5c0-.4.3-.8.8-.8h2.5c.4 0 .8.3.8.8v2.5c0 .5-.3.8-.8.8zm0-9h-2.5c-.4 0-.8-.3-.8-.8v-2.5c0-.4.3-.8.8-.8h2.5c.4 0 .8.3.8.8v2.5c0 .5-.3.8-.8.8zm8 9h-2.5c-.4 0-.8-.3-.8-.8v-2.5c0-.4.3-.8.8-.8h2.5c.4 0 .8.3.8.8v2.5c0 .5-.3.8-.8.8zm0-9h-2.5c-.4 0-.8-.3-.8-.8v-2.5c0-.4.3-.8.8-.8h2.5c.4 0 .8.3.8.8v2.5c0 .5-.3.8-.8.8z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                    </g>
                                                                </svg>
                                                            </div>
                                                            <div className="nw_user_tab_name">
                                                                Leave
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#id_holiday_org">
                                                            <div className="nw_user_tab_icon">
                                                                <svg width="20" height="20" x="0" y="0" viewBox="0 0 64 64">
                                                                    <g>
                                                                        <path d="M52.593 19.312c2.294-2.373 4.984-7.246 2.212-10.119a4.034 4.034 0 0 0-3.506-1.144 11.875 11.875 0 0 0-6.611 3.357l-5.579 5.579-3.34-.727c1.441-2.207-1.539-4.674-3.438-2.804l-1.687 1.687-3.958-.862c2.466-2.061-.472-5.52-2.878-3.428l-2.3 2.3-8.192-1.784a1.928 1.928 0 0 0-1.778.522l-1.649 1.649c-.907.857-.678 2.487.432 3.059L29.56 27.225l-9.739 10.656-9.891.526-1.532 1.531c-.697.659-.428 1.929.48 2.242l9.363 3.576 3.577 9.364c.316.905 1.58 1.18 2.243.478l1.53-1.53.526-9.892 10.656-9.739 10.621 19.232c.572 1.11 2.201 1.34 3.059.433.923-1.064 2.524-1.925 2.172-3.426l-1.781-8.184 2.303-2.302c.421-.421.653-.981.653-1.577-.009-2.182-2.775-3.007-4.083-1.3l-.861-3.958 1.688-1.688c1.868-1.907-.571-4.838-2.803-3.433l-.728-3.345z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                    </g>
                                                                </svg>
                                                            </div>
                                                            <div className="nw_user_tab_name">
                                                                Holiday
                                                            </div>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="nw_user_inner_content_box" id='id_compony_org'>
                                            <div className="org_compony_mainbox">
                                                <div className="org_compony_content_box">
                                                    {/* <LoadingDialog isLoading={isLoading} /> */}
                                                    <div className="compony_profile_mainbox">
                                                        <div className="compony_profile_contentbox">
                                                            <div className="compony_name_heading">
                                                                <label >{compData?.company_name || ""}</label>
                                                            </div>
                                                            <div className="compony_detail_mainbox">
                                                                <div className="compony_detail_listing">
                                                                    <div className="compony_detail_icons">
                                                                        <img src={staticIconsBaseURL + "/images/user/mail-icon.svg"} alt="Email icon" className="img-fluid" />
                                                                    </div>
                                                                    <div className="compony_detail_data">
                                                                        <div className="compony_details_content">{compData.company_email || "--"}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="compony_detail_listing">
                                                                    <div className="compony_detail_icons">
                                                                        <img src={staticIconsBaseURL + "/images/user/telephone.svg"} alt="Contact number icon" className="img-fluid" />
                                                                    </div>
                                                                    <div className="compony_detail_data">
                                                                        <div className="compony_details_content">{compData.company_number || "--"}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="compony_detail_listing">
                                                                    <div className="compony_detail_icons">
                                                                        <img src={staticIconsBaseURL + "/images/user/website-icon.svg"} alt="Website icon" className="img-fluid" />
                                                                    </div>
                                                                    <div className="compony_detail_data">
                                                                        <div className="compony_details_content">{compData.company_website_url || "--"}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="compony_detail_listing">
                                                                    <div className="compony_detail_icons">
                                                                        <img src={staticIconsBaseURL + "/images/user/location-icon.svg"} alt="Location icon" className="img-fluid" />
                                                                    </div>
                                                                    <div className="compony_detail_data">
                                                                        <div className="compony_details_content">{compData.company_location || "--"}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="org_compony_image_box">
                                                    <div className="org_compony_logo_background">
                                                        <img src={staticIconsBaseURL + "/images/user/organization-icon-background.png"} alt="Background image" className="img-fluid" />
                                                    </div>
                                                    <div className="org_compony_logo_box">
                                                        <img src={staticIconsBaseURL + "/images/user/evonixLogo.jpg"} alt="Organization icon" className="img-fluid" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="new_org_leave_mainbox" id='id_leave_org'>
                                            <div className="my_task_tabbing_content">
                                                <div className="row">
                                                    {/* <LoadingDialog isLoading={isLoading} /> */}
                                                    <div className="col-lg-12">
                                                        <div className="new_org_subheading_box">
                                                            <div className="heading25">
                                                                My Leave List
                                                            </div>
                                                        </div>
                                                        <div className="nw_leave_table_mainbox">
                                                            {leavearray.map((leaveType, index) => (
                                                                <div className="nw_leave_table_listing" key={index}>
                                                                    <div className="nw_leave_table_first_box">
                                                                        <div className="nw_leave_table_icon">
                                                                            <img src={leaveType.leap_leave_type_icon_and_color.icon_url != null && leaveType.leap_leave_type_icon_and_color.icon_url.length > 0 ? staticIconsBaseURL + leaveType.leap_leave_type_icon_and_color.icon_url : staticIconsBaseURL + "/images/leave_type_icons/leave.svg"} className="img-fluid" style={{ maxHeight: "25px", borderRadius: "40px" }} />
                                                                        </div>
                                                                        <div className="nw_leave_table_type">
                                                                            {leaveType.leave_name && (() => {
                                                                                const [firstWord, ...rest] = leaveType.leave_name.split(' ');
                                                                                return (
                                                                                    <>
                                                                                        <span>{firstWord}</span>
                                                                                        <br />
                                                                                        {rest.join(' ')}
                                                                                    </>
                                                                                );
                                                                            })()}
                                                                        </div>
                                                                    </div>
                                                                    <div className="nw_leave_table_box">
                                                                        <div className="nw_leave_table_lable">Count</div>
                                                                        <div className="nw_leave_table_content">{leaveType.leave_count}</div>
                                                                    </div>
                                                                    <div className="nw_leave_table_box">
                                                                        <div className="nw_leave_table_lable">Applicable for</div>
                                                                        <div className="nw_leave_table_content">{leaveType.gender}</div>
                                                                    </div>
                                                                    <div className="nw_leave_table_box">
                                                                        <div className="nw_leave_table_lable">if unused</div>
                                                                        <div className="nw_leave_table_content">{leaveType.if_unused}</div>
                                                                    </div>
                                                                    <div className="nw_leave_table_box">
                                                                        <div className="nw_leave_table_lable">Category</div>
                                                                        <div className="nw_leave_table_content">{leaveType.leave_category}</div>
                                                                    </div>
                                                                    <div className="nw_leave_table_box nw_leave_table_eye">
                                                                        <img src={staticIconsBaseURL + "/images/user/info.svg"} alt="Description icon" className="img-fluid" />
                                                                        <div className="nw_leave_table_eye_contentbox">
                                                                            {leaveType.leave_discription}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="new_org_holiday_mainbox" id='id_holiday_org'>
                                            <div className="my_task_tabbing_content">
                                                <div className="row">
                                                    {/* <LoadingDialog isLoading={isLoading} /> */}
                                                    <div className="col-lg-12">
                                                        <div className="new_org_subheading_box">
                                                            <div className="heading25">
                                                                My Holiday List
                                                            </div>
                                                        </div>
                                                        <div className="nw_holiday_table_mainbox">
                                                            {holidays.length > 0 ? (
                                                                holidays.map((holiday, index) => (
                                                                    <div className="nw_holiday_table_listing" key={index}>
                                                                        <div className="new_org_holiday_content_box">
                                                                            <div className="new_org_holiday_head">
                                                                                <div className="nw_leave_table_lable">Holiday Name:</div>
                                                                                <div className="nw_leave_table_content">{holiday.holiday_name}</div>
                                                                            </div>
                                                                            <div className="new_org_holiday_data">
                                                                                <div className="nw_holiday_table_calender_box">
                                                                                    <div className="nw_calender_monthBox">{moment(holiday.date).format("MMM")}</div>
                                                                                    <div className="nw_calender_dateBox">{moment(holiday.date).format("DD")}</div>
                                                                                </div>
                                                                                <div className="new_org_holiday_date_type_box">
                                                                                    <div className="new_org_holiday_type_box">
                                                                                        <div className="nw_leave_table_lable">Holiday Type</div>
                                                                                        <div className="nw_leave_table_content">{holiday.holiday_type_id && holiday.holiday_type_id.length >0 ? holiday.holiday_type_id.holiday_type : "--"}</div>
                                                                                    </div>
                                                                                    <div className="new_org_holiday_day_box">
                                                                                        <div className="nw_leave_table_lable">Holiday Day</div>
                                                                                        <div className="nw_leave_table_content">{moment(holiday.date).format("dddd")}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="new_org_holiday_content_date">
                                                                            <div className="nw_leave_table_lable">Date:</div>
                                                                            <div className="nw_leave_table_content">{moment(holiday.date).format("LL")}</div>
                                                                        </div>




                                                                       
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                                                    <PageErrorCenterContent content={"No holidays available"} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />
            <Footer />
        </div>
    );
};

export default HolidayList;