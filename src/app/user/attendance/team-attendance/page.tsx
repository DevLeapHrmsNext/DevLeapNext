////// design changes shared by swapnil on 11th april 2025

'use client'
import React from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import moment from 'moment'
import { Employee, LeapCustomerAttendanceAPI } from '@/app/models/AttendanceDataModel'
import dynamic from 'next/dynamic'
import { leftMenuAttendancePageNumbers, pageURL_userTeamAttendanceDetails } from '@/app/pro_utils/stringRoutes'
import Select from "react-select";
import { useRouter } from 'next/navigation'
import { getImageApiURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'
import { el } from 'date-fns/locale'
import BackButton from '@/app/components/BackButton'

// import AttendanceMap from '@/app/components/trackerMap'
const AttendanceMap = dynamic(() => import('@/app/components/trackerMap'), { ssr: false });

interface FilterValues {
    name: any
}
interface selectedAttendance {
    name: string,
    customer_id: number,
    emp_id: string,
    contact_number: string,
    email_id: string,
    profile_pic: string,
    designation_id: number,
    branch_id: number,
    leap_client_designations: {
        designation_name: string
    },
    attendanceStatus: string
}

const EmpAttendancePage = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const { contaxtBranchID, contextClientID, contextRoleID,
        contextUserName, contextCustomerID, contextEmployeeID, contextLogoURL, contextProfileImage,
        contextCompanyName, dashboard_notify_activity_related_id, dashboard_notify_cust_id, setGlobalState } = useGlobalContext();
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [empAttendanceData, setEmpAttendanceData] = useState<selectedAttendance[]>([]);
    const [employeeName, setEmployeeNames] = useState([{ value: '', label: '' }]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const router = useRouter();

    const [isLoading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    const [filterValues, setFilterValues] = useState<FilterValues>({
        name: '',
    })
    useEffect(() => {
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

        setFilterValues({

            name: dashboard_notify_cust_id,
        })


        fetchData();
        return () => {

            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const fetchData = async (filter = filterValues) => {
        setLoading(true)
        try {

            const response = await fetch("/api/users/getTeamMembers", {
                method: "POST",
                body: JSON.stringify({
                    "customer_id": contextCustomerID
                }),
            });
            const apiResponse = await response.json();
            let subordinates = apiResponse.data.subordinates || [];
            if (filter.name) {
                subordinates = subordinates.filter((emp: any) => emp.customer_id === filter.name);
            }

            setEmpAttendanceData(subordinates);
            const empNames = apiResponse.data.subordinates.map((emp: any) => ({
                value: emp.customer_id,
                label: `${emp.emp_id}  ${emp.name}`,
            }));
            setEmployeeNames(empNames);

            setLoading(false);
            setLoadingCursor(false);

        } catch (e) {
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Error")
            setAlertStartContent("Failed to get customer profile");
            setAlertForSuccess(2)
            console.log(e);
        }
    }

    const resetFilter = async () => {
        const resetValues = { name: "" };
        setSelectedEmployee(null);
        setFilterValues(resetValues);
        fetchData(resetValues);
    };

    const handleEmpSelectChange = async (values: any) => {
        console.log(values);

        setFilterValues((prev) => ({ ...prev, ["name"]: values.value }));
        setSelectedEmployee(values)
    };

    const go_to_details_Page = (customer_id: any) => {

        setGlobalState({
            contextUserName: contextUserName,
            contextClientID: contextClientID,
            contaxtBranchID: contaxtBranchID,
            contextCustomerID: contextCustomerID,
            contextRoleID: contextRoleID,
            contextProfileImage: contextProfileImage,
            contextEmployeeID: contextEmployeeID,
            contextCompanyName: contextCompanyName,
            contextLogoURL: contextLogoURL,
            contextSelectedCustId: '',
            contextAddFormEmpID: '',
            contextAnnouncementID: '',
            contextAddFormCustID: '',
            dashboard_notify_cust_id: customer_id,
            dashboard_notify_activity_related_id: '',
            selectedClientCustomerID: '',
            isAdmin: '',
            contextPARAM8: '',
        });
        router.push(pageURL_userTeamAttendanceDetails)


    };

    function filter_whitebox() {
        const x = document.getElementById("filter_whitebox");
        if (x!.className === "filter_whitebox") {
            x!.className += " filter_whitebox_open";
        } else {
            x!.className = "filter_whitebox";
        }
    }

    return (
        <div className='mainbox user_mainbox_new_design'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={21} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                <div>
                    <LoadingDialog isLoading={isLoading} />
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)
                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    {/* ========= New structure start ============ */}
                    <div className='container'>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="nw_user_inner_mainbox nw_user_inner_mainbox_team_attendance">
                                    <div className="nw_user_inner_heading_tabbox">
                                        <div className="heading25">
                                            Attendance List
                                        </div>
                                        <div className="nw_user_inner_tabs nw_user_inner_right_tabs">
                                            <ul>
                                                <li className='filter_relative_li'>
                                                    <div className="nw_user_filter_mainbox width_300">
                                                        <div className="filter_whitebox" id="filter_whitebox">
                                                            <div className="nw_filter_form_group_mainbox nw_filter_form_group_mainbox_two">
                                                                <div className="nw_filter_form_group">
                                                                    <Select
                                                                        className="custom-select"
                                                                        classNamePrefix="custom"
                                                                        // value={selectedEmployee}
                                                                        options={employeeName}
                                                                        onChange={(selectedOption) =>
                                                                            handleEmpSelectChange(selectedOption)
                                                                        }
                                                                        placeholder="Select..."
                                                                        isSearchable
                                                                    />

                                                                </div>
                                                                <div className="nw_filter_form_group">
                                                                    <a className={`red_button filter_submit_btn ${loadingCursor ? "loading" : ""}`} onClick={() => { setLoadingCursor(true), fetchData() }}>Submit</a>
                                                                </div>
                                                                <div className="nw_filter_submit_btn">
                                                                    <a onClick={() => resetFilter()}>
                                                                        <img src={staticIconsBaseURL + "/images/user/undo.svg"} alt="Filter icon" className="img-fluid" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="nw_filter_icon" onClick={filter_whitebox}>
                                                            <img src={staticIconsBaseURL + "/images/user/filter-icon.svg"} alt="Filter icon" className="img-fluid new_filter_color_change_blue" />
                                                            <img src={staticIconsBaseURL + "/images/user/filter-icon-red.svg"} alt="Filter icon" className="img-fluid new_filter_color_change_red" />
                                                            <div className="new_filter_tooltip_box">
                                                                Filter
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="nw_user_inner_content_box" style={{ minHeight: '60vh' }}>
                                        <div className="row mt-4">
                                            <div className="col-lg-12">
                                                <div className="row mb-4 attendance_list_table">
                                                    <div className="col-lg-3 text-center new_user_table_head"><span>Name</span></div>
                                                    <div className="col-lg-3 text-center new_user_table_head"><span>Designation</span></div>
                                                    <div className="col-lg-1 text-center new_user_table_head"><span>Emp ID</span></div>
                                                    <div className="col-lg-2 text-center new_user_table_head"><span>Contact No.</span></div>
                                                    <div className="col-lg-2 text-center new_user_table_head"><span>Status</span></div>
                                                    <div className="col-lg-1 text-center new_user_table_head"><span>Action</span></div>
                                                </div>
                                                {empAttendanceData.map((emp, index) => (
                                                    <div className='attendance_listbox' key={index}>
                                                        <div className="row" style={{ cursor: "pointer" }} onClick={() => { go_to_details_Page(emp.customer_id) }}>
                                                            <div className="col-lg-3 attendance_memberimg" style={{ paddingLeft: "60px" }}><img src={emp.profile_pic != null && emp.profile_pic.length > 0 ? getImageApiURL + "/uploads/" + emp.profile_pic : "/images/user/user.png"} className="img-fluid" />{emp.name}</div>
                                                            <div className="col-lg-3 text-center">{emp.leap_client_designations?.designation_name || "--"}</div>
                                                            <div className="col-lg-1 text-center">{emp.emp_id}</div>
                                                            <div className="col-lg-2 text-center">{emp.contact_number}</div>
                                                            <div className="col-lg-2 text-center">
                                                                {emp.attendanceStatus == "Present" ? <div className="new_team_attendance_status_mainbox">
                                                                    <div className="new_team_attendance_status_present_icon"></div>
                                                                    <div className="new_team_attendance_status">Present</div>
                                                                </div> :
                                                                    <div className="new_team_attendance_status_mainbox">
                                                                        <div className="new_team_attendance_status_absent_icon"></div>
                                                                        <div className="new_team_attendance_status">Absent</div>
                                                                    </div>
                                                                }
                                                            </div>
                                                            <div className="col-lg-1 text-center">
                                                                <img src={staticIconsBaseURL + "/images/menu.png"} className="img-fluid" alt="Search Icon" style={{ width: "20px" }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}


                                            </div>


                                        </div>
                                        <div className="row mt-4">
                                                <div className="col-lg-12">
                                                        <BackButton isCancelText={false} />
                                                </div>
                                            </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ========= New structure ends ============= */}
                </div>
            } />
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default EmpAttendancePage;

const generateDateRange = (start: string, end: string) => {
    if (!start || !end) return []; // Avoid generating if dates are not selected

    const startDate = new Date(start);
    const endDate = new Date(end);
    const tempDates: string[] = [];

    while (startDate <= endDate) {

        tempDates.push(startDate.toISOString().split("T")[0]); // Converts to YYYY-MM-DD format
        startDate.setDate(startDate.getDate() + 1);
    }
    console.log("this is the temp dates", tempDates);

    return tempDates;

};



