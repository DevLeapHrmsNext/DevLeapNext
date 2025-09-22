'use client'
import React, { useEffect, useRef, useState } from 'react'
import LeapHeader from '../components/header'
import LeftPannel from '../components/leftPannel';
import { Employee, EmployeeAttendance, MidShortcutsList, ShortCutOne } from '../models/DashboardModel';
import ViewAllText from '../components/viewAllText';
import PieAnimation from '../components/pieChart';
import AdminDashboardNotify from '../components/adminDashboardNotify';
import supabase from '../api/supabaseConfig/supabase';
import ClientAdminMidShortcuts from '../components/clientAdminMidShortcuts';
import LoadingDialog from '../components/PageLoader';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import Footer from '../components/footer';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { getEndOfDay, getStartOfDay } from '../pro_utils/helpers';
import { clientAdminDashboard ,staticIconsBaseURL,getImageApiURL} from '../pro_utils/stringConstants';
import { baseUrl, pageURL_editUserPorifle, pageURL_holidayListPage, leftMenuDashboardPageNumbers, pageURL_attendanceList, pageURL_userList } from '../pro_utils/stringRoutes';
import ShortCutOneDialog from '../components/dialog_addRemoveShortCut';
import MidShortcutsDialog from '../components/dialog_SetMidShortcuts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';



const productData = [1, 2, 3, 4, 5, 6];
type PieValueType = {
    id: any;
    value: any;
    label: any;

};

type DashboardData = {
    employeeSummary: {
        branch: Branches[];
        totalCount: number;
        totalActive: number;
        totalInactive: number;
    };
    employees: {
        employees: Employee[];
    };
};
const Dashboard = () => {
    // document.cookie = "isAdmin=; path=/dashboard"
    const router = useRouter();
    const [branchData, setBranchData] = useState<Branches[]>([]);
    const [data, setResponseData] = useState<DashboardData>();
    const [employeeData, setEmployeeData] = useState<Employee[]>([]);
    const [midShortcuts, setmidShortcuts] = useState<MidShortcutsList[]>([]);
    const [userActivities, setActivities] = useState<LeapUserActivitiesModel[]>([]);
    const [shortCutOne, setShortCutOne] = useState<ShortCutOne[]>([]);
    const [showMidShortcut, setShowMidShortcutDialog] = useState(false);
    const [showShortCutOneDialog, setShowShortCutOneDialog] = useState(false);
    const [empAttendanceArray, setEmpAttendanceArray] = useState<EmployeeAttendance>();
    const [branchPieData, setBranchPieData] = useState<PieValueType[]>([]); // Explicitly typed
    const [branchSelectedIndex, setBranchSelectedIndex] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const swiperRef = useRef<any>(null);

    const { contextClientID, contaxtBranchID, contextCompanyName, contextCustomerID, contextEmployeeID,
        contextLogoURL, contextRoleID,isAdmin, contextProfileImage, contextUserName,
        setGlobalState } = useGlobalContext();

    useEffect(() => {

        fetchData();
        const intervalId = setInterval(() => {
            // fetchActivities();
            fetchData();
        }, 5000); // Call fetchActivities every 5 seconds

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
            clearInterval(intervalId);
            window.removeEventListener('scroll', handleScroll);
        };

        //   setActivities(activies);
    }, [branchSelectedIndex, branchPieData]);

    const fetchData = async () => {

        try {
            // const formData = new FormData();
            // formData.append("client_id", contextClientID);
            // formData.append("customer_id", contextCustomerID);
            // formData.append("role_id", contextRoleID);
            // // formData.append("client_id", "3");
            // // formData.append("customer_id", "3");
            // // formData.append("role_id", "2");

             const res = await fetch(`/api/clientAdmin/dashboard`, {
                cache: "no-store",
                method: "POST",
                body: JSON.stringify({
                    "client_id": contextClientID,
                    "customer_id": contextCustomerID,
                    "role_id": contextRoleID
            }),
            });
            if (res.ok) {
                const response = await res.json();


                setResponseData(response);
                const branchDataFetched = response.employeeSummary.branch;
                const employeeDataFetched = response.employees.employees;
                const midShoortcuts = response.midShortcutsList;
                const empAttendance = response.employeeAttendance;
                const empActivities = response.instantNotify;

                setBranchData(branchDataFetched);
                setEmployeeData(employeeDataFetched);
                setmidShortcuts(midShoortcuts);
                setEmpAttendanceArray(empAttendance);
                setActivities(empActivities)
                setShortCutOne(response.shortCutOne)

                if (branchDataFetched.length > 0) {
                    let totalAbsent=0;
                    if(branchDataFetched[branchSelectedIndex].branchTotalOnLeaveEmp){
                        if(branchDataFetched[branchSelectedIndex].branchTotalActiveEmp>branchDataFetched[branchSelectedIndex].branchTotalOnLeaveEmp){
                            totalAbsent=branchDataFetched[branchSelectedIndex].branchTotalEmp-(branchDataFetched[branchSelectedIndex].branchTotalActiveEmp-branchDataFetched[branchSelectedIndex].branchTotalOnLeaveEmp)
                        }else{
                            totalAbsent=branchDataFetched[branchSelectedIndex].branchTotalEmp-(branchDataFetched[branchSelectedIndex].branchTotalOnLeaveEmp-branchDataFetched[branchSelectedIndex].branchTotalActiveEmp)

                        }
                        
                    }else{
                        totalAbsent=branchDataFetched[branchSelectedIndex].branchTotalEmp-branchDataFetched[branchSelectedIndex].branchTotalActiveEmp

                    }
                    const newBranchPieData = [
                        {
                            id: "1",
                            value: branchDataFetched[branchSelectedIndex].branchTotalActiveEmp || 0,
                            label: "Present",
                        },
                        {
                            id: "2",
                            value: totalAbsent,
                            label: "Absent",
                        },
                        {
                            id: "3",
                            value: branchDataFetched[branchSelectedIndex].branchTotalOnLeaveEmp || 0,
                            label: "On Leave",
                        },
                    ];
                    // alert(newBranchPieData.length)
                    const updatedPieChart = []
                    for (let i = 0; i < newBranchPieData.length; i++) {
                        
                        if (newBranchPieData[i].value != 0) {

                            updatedPieChart.push(newBranchPieData[i])
            
                        }
                    }

                    setBranchPieData(updatedPieChart);
                    setLoadingCursor(false)
                }
            } else {
                await supabase.auth.signOut();
                router.replace(`/${contextCompanyName}/login`)
            }
        } catch (error) {
            console.log("Error fetching data:", error);
        }

    };

    function changePieData(index: any): void {
        console.log("Change pie data is called");

        setBranchSelectedIndex(index);
        if (!branchData || branchData.length === 0) return;
        let totalAbsent=0;
        if(branchData[branchSelectedIndex].branchTotalOnLeaveEmp){
            if(branchData[branchSelectedIndex].branchTotalActiveEmp>branchData[branchSelectedIndex].branchTotalOnLeaveEmp){
                totalAbsent=branchData[branchSelectedIndex].branchTotalEmp-(branchData[branchSelectedIndex].branchTotalActiveEmp-branchData[branchSelectedIndex].branchTotalOnLeaveEmp)
            }else{
                totalAbsent=branchData[branchSelectedIndex].branchTotalEmp-(branchData[branchSelectedIndex].branchTotalOnLeaveEmp-branchData[branchSelectedIndex].branchTotalActiveEmp)

            }
            
        }else{
            totalAbsent=branchData[branchSelectedIndex].branchTotalEmp-branchData[branchSelectedIndex].branchTotalActiveEmp

        }
        const newBranchPieData = [
            {
                id: "1",
                value: branchData[branchSelectedIndex].branchTotalActiveEmp || 0,
                label: "Present",
            },
            {
                id: "2",
                value: totalAbsent,
                label: "Absent",
            },
            {
                id: "3",
                value: branchData[branchSelectedIndex].branchTotalOnLeaveEmp || 0,
                label: "On Leave",
            },
        ];
        const updatedPieChart = []
        for (let i = 0; i < newBranchPieData.length; i++) {

            if (newBranchPieData[i].value != 0) {

                updatedPieChart.push(newBranchPieData[i])

            }
        }
        setBranchPieData(newBranchPieData);
        setLoadingCursor(false)
    }

    function dasheddate(in_time: string, isTime: boolean) {

        if (!in_time) return '';
        const parsedDate = moment(in_time);

        if (isTime) return parsedDate.format('HH:mm A');

        return parsedDate.format('YYYY-MM-DD');

    }

    function handleViewNavigation(customerID: any, attendanceID: any) {

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
            dashboard_notify_cust_id: customerID,
            dashboard_notify_activity_related_id: attendanceID,
            selectedClientCustomerID: '',
            isAdmin: isAdmin,
            contextPARAM8: '',

        });
        router.push(pageURL_attendanceList);

    }

    const navigateToProfile = (selectedCustID: any) => {
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
            contextSelectedCustId: selectedCustID + '',
            contextAddFormEmpID: '',
            contextAnnouncementID: '',
            contextAddFormCustID: '',
            dashboard_notify_cust_id: '',
            dashboard_notify_activity_related_id: '',
            selectedClientCustomerID: '',
            isAdmin: isAdmin,
            contextPARAM8: '',

        });
        router.push(pageURL_editUserPorifle);
    }



    return (

        <div className='mainbox'>
            <header>
                <LeapHeader title={clientAdminDashboard} />
            </header>
            <LeftPannel menuIndex={leftMenuDashboardPageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                data! && userActivities! ?
                    <div >
                        <div className="container">
                            <div className={`${loadingCursor ? "cursorLoading" : ""}`}>
                                <div className="row">
                                    <div className="col-lg-12 mb-4">

                                        <div className="grey_box">
                                            <div className="row">
                                                <div className="col-lg-8">
                                                    <div className="row">
                                                        <div className="col-lg-5">
                                                            <div className="row">
                                                                <div className="col-lg-12 mb-4">
                                                                    <div className="heading25">Employee <span>Summary</span></div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-lg-4">
                                                                    <div className="row">
                                                                        <div className="col-lg-12 mb-3">
                                                                            <div className="summery_box">
                                                                                Total Employees<br /><span>{data?.employeeSummary!.totalCount}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-12 mb-3">
                                                                            <div className="summery_box" style={{ backgroundColor: "#f4ec93" }}>
                                                                                Present<br /><span>{data?.employeeSummary!.totalActive}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-12 mb-3">
                                                                            <div className="summery_box" style={{ backgroundColor: "#e4e4e4" }}>
                                                                                Absent<br /><span>{data?.employeeSummary!.totalInactive}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-8">

                                                                    <div className="row">
                                                                        <div className="col-lg-12">
                                                                            <div style={{ width: "100%", padding: "0 10px", height: "400px", overflowY: "scroll", scrollbarColor: "rgb(212, 170, 112) rgb(228, 228, 228)", scrollbarWidth: "thin", overflowX: "clip" }}>
                                                                                <div className="row">
                                                                                    {branchData.map((branch, index) => (
                                                                                        <div className={`col-lg-12 mb-3 ${loadingCursor ? "cursorLoading" : ""}`} key={branch.branchId} onClick={(e) => { setLoadingCursor(true), e.preventDefault(); changePieData(index) }}>
                                                                                            <a href="#" className={branchSelectedIndex == index ? "summery_whitelist_selected" : "summery_whitelist"}>
                                                                                                Branch: <br></br><span>{branch.branchNumber}</span>
                                                                                            </a>
                                                                                        </div>
                                                                                    ))}

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-7" >
                                                            <PieAnimation branchData={branchPieData} />
                                                            <div className="row">
                                                                <div className="col-lg-12 mb-2">
                                                                    <div className="piachart_listing">
                                                                        <div className="pia_chart_colorbox"></div>
                                                                        <div className="pia_chart_namebox">
                                                                            Total Strength - {branchData[branchSelectedIndex].branchTotalEmp}
                                                                        </div>
                                                                    </div>
                                                                    <div className="piachart_listing">
                                                                        <div className="pia_chart_colorbox pia_chart_colorbox_present"></div>
                                                                        <div className="pia_chart_namebox">
                                                                            Total Present - {branchData[branchSelectedIndex].branchTotalActiveEmp}
                                                                        </div>
                                                                    </div>
                                                                    <div className="piachart_listing">
                                                                        <div className="pia_chart_colorbox pia_chart_colorbox_absent"></div>
                                                                        <div className="pia_chart_namebox">
                                                                            Total Absent - {branchData[branchSelectedIndex].branchTotalEmp - branchData[branchSelectedIndex].branchTotalActiveEmp-branchData[branchSelectedIndex].branchTotalOnLeaveEmp}
                                                                        </div>
                                                                    </div>
                                                                    <div className="piachart_listing">
                                                                        <div className="pia_chart_colorbox pia_chart_colorbox_leave"></div>
                                                                        <div className="pia_chart_namebox">
                                                                            Total on Leave - {branchData[branchSelectedIndex].branchTotalOnLeaveEmp}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div style={{ backgroundColor: "#fff", width: "100%", padding: "10px", borderRadius: "10px" }}>
                                                        <div style={{ width: "100%", padding: "0 10px", height: "440px", overflowY: "scroll", scrollbarColor:"rgb(212, 170, 112) rgb(228, 228, 228)", scrollbarWidth:"thin", overflowX:"clip" }}>
                                                            <div className="row">

                                                                {userActivities.length > 0 ? userActivities.map((activity, index) => (

                                                                    <AdminDashboardNotify activity={activity} key={index} />

                                                                )) : <label> No Data Available</label>}

                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4" style={{ backgroundColor: "#fff", width: "100%", padding: "10px", borderRadius: "10px" }}>                                    
                                    <div className="row" >
                                        <div className="col-lg-11">
                                            <div className="list_view_sliderbox">
                                                <div className="swiper-wrapper-with-nav" style={{ position: 'relative' }}>
                                                    <div className="swiper-button-prev-custom swiper-button prev_btn" style={{visibility: isBeginning ? 'hidden' : 'visible',}}>
                                                        <img src={staticIconsBaseURL+"/images/black_arrow.png"} className="img-fluid" />
                                                    </div>
                                                    <div className="col-lg-12">
                                                            
                                                        <Swiper
                                                            spaceBetween={20}
                                                            slidesPerView={6}
                                                            navigation={{
                                                                nextEl: '.swiper-button-next-custom',
                                                                prevEl: '.swiper-button-prev-custom',
                                                            }}
                                                            modules={[Navigation]}
                                                            onSwiper={(swiper) => {
                                                                console.log(swiper);
                                                                
                                                                swiperRef.current = swiper;
                                                                setIsBeginning(swiper.isBeginning);
                                                                setIsEnd(swiper.isEnd);
                                                            }}
                                                            onSlideChange={(swiper) => {
                                                                console.log(swiper);
                                                                setIsBeginning(swiper.isBeginning);
                                                                setIsEnd(swiper.isEnd);
                                                            }}
                                                        >
                                                            {shortCutOne.length > 0 ? shortCutOne.map((shortcut, index) => (
                                                                <SwiperSlide key={shortcut.shortcut_id}>
                                                                    <div className="list_view_box" >

                                                                        <a href={shortcut.leap_dashboard_shortcuts.page_url.length > 0 ? baseUrl + shortcut.leap_dashboard_shortcuts.page_url : "#"}>
                                                                            <div className="list_view_icon"><img src={shortcut.leap_dashboard_shortcuts.icon.length > 0 ? staticIconsBaseURL+shortcut.leap_dashboard_shortcuts.icon : staticIconsBaseURL+"images/holiday_icon.png"} className="img-fluid white-icon" /></div>
                                                                            <div className="list_view_heading">
                                                                                {shortcut.leap_dashboard_shortcuts.title}
                                                                                <span>{shortcut.leap_dashboard_shortcuts.sub_title}</span>
                                                                            </div>
                                                                        </a>
                                                                    </div>
                                                                </SwiperSlide>
                                                            )) : <></>}
                                                        </Swiper>

                                                    </div>
                                                    <div className="swiper-button-next-custom swiper-button next_btn" style={{visibility: isEnd ? 'hidden' : 'visible',}}>
                                                        <img src={staticIconsBaseURL+"/images/black_arrow.png"} className="img-fluid" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-1 mb-1 ">
                                            <div className='list_view_menuiconbox' onClick={(e) => { e.preventDefault; setShowShortCutOneDialog(true) }}>
                                                <img src={staticIconsBaseURL+"/images/other_menu_icon.png"} className="img-fluid" />
                                            </div>
                                            <div className={showShortCutOneDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                                                {showShortCutOneDialog && <ShortCutOneDialog onClose={() => { setLoadingCursor(true), setShowShortCutOneDialog(false) }} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-5">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="row">

                                                {midShortcuts.map((midShortcut) => (
                                                    <div className='shortcut_list_repet' key={midShortcut.shortcut.id} >
                                                        <ClientAdminMidShortcuts shortCut={midShortcut.shortcut} related_data={midShortcut.related_data} removeClick={() => { setLoadingCursor(true) }} onRemoved={() => { fetchData() }} />
                                                    </div>
                                                ))}
                                                {midShortcuts.length < 3 ?
                                                    <a className="shortcut_addbox" onClick={() => { setShowMidShortcutDialog(true) }}>
                                                        <div className="row text-center">
                                                            <div className="col-lg-12 mb-2"><img src={staticIconsBaseURL+"/images/shortcut_icons/add_icon.png"} style={{ maxHeight: "30px" }}
                                                                className="img-fluid" /></div>
                                                            <div className="col-lg-12">Add <span>Shortcut</span></div>
                                                        </div>
                                                    </a>
                                                    : <></>
                                                }
                                                

                                                {showMidShortcut && <MidShortcutsDialog onClose={() => { setLoadingCursor(true), fetchData; setShowMidShortcutDialog(false) }} />}
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {/* <div className="row mb-1">
                                    <div className="col-lg-12 text-center">
                                        <img src="/images/grey_sept.png" className="img-fluid" />
                                    </div>
                                </div> */}
                                <div className="row">
                                    <div className="col-lg-8">
                                        <div className="row" id="top">
                                            <div className="col-lg-12 mb-3">
                                                <div className="heading25">Employee <span>List</span><ViewAllText goToURL={pageURL_userList} /></div>
                                            </div>
                                        </div>
                                        <div className="row mb-5">
                                            <div className="col-lg-12">
                                                <div className="grey_box" style={{ backgroundColor: "#fff" }} >
                                                    <div className="row list_label mb-4">
                                                        <div className="col-lg-2 text-center"><div className="label">Emp_ID</div></div>
                                                        <div className="col-lg-2 text-center"><div className="label">Picture</div></div>
                                                        <div className="col-lg-3 text-center"><div className="label">Name</div></div>
                                                        <div className="col-lg-3 text-center"><div className="label">Department</div></div>
                                                        <div className="col-lg-2 text-center"><div className="label">Status</div></div>

                                                    </div>
                                                    {employeeData.map((employee) => (
                                                        <div className="row list_listbox" style={{ alignItems: "center", backgroundColor: employee.employment_status ? "#FFFFFF" : "#ed2024", cursor: "pointer" }} key={employee.emp_id} onClick={() => { navigateToProfile(employee.customer_id) }}>
                                                            <div className="col-lg-2 text-center"><b>{employee.emp_id}</b></div>
                                                            <div className="col-lg-2 text-center"><img src={employee.profile_pic != null && employee.profile_pic.length > 0 ? getImageApiURL+"/uploads/" + employee.profile_pic : staticIconsBaseURL+"/images/user/user.png"} className="img-fluid" style={{ maxHeight: "55px", borderRadius: "40px" }} /></div>
                                                            <div className="col-lg-3 text-center"><b>{employee.name}</b></div>
                                                            <div className="col-lg-3 text-center">{employee.leap_client_designations?.leap_client_departments?.department_name?.toString() || "--"}</div>
                                                            <div className="col-lg-2 text-center" style={{ color: employee.employment_status ? "#b9ff3e" : "#ed2024" }}><b>{employee.employment_status ? "Active" : "InActive"}</b></div>
                                                        </div>
                                                    ))}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4" id="top">
                                        <div className="row">
                                            <div className="col-lg-12 mb-3">
                                                <div className="heading25">Attendance <span>Status</span><ViewAllText goToURL={pageURL_attendanceList} /></div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="attendance_mainbox">
                                                    <div className="row list_label mb-4">
                                                        <div className="col-lg-5 text-center">
                                                            <div className="label">Name</div>
                                                        </div>
                                                        {/* <div className="col-lg-5"></div>
                                                    <div className="col-lg-2">
                                                        <div className="label">status</div>
                                                    </div> */}
                                                    </div>


                                                    <div className="attendance_innerbox">
                                                        {empAttendanceArray != null && empAttendanceArray! && empAttendanceArray!.employees && empAttendanceArray!.employees.length > 0 ?
                                                            <div className="row">
                                                                {empAttendanceArray!.employees.map((empAttendance, index) => (
                                                                    <div className="col-lg-12 mb-2" key={index} onClick={() => {
                                                                        handleViewNavigation(empAttendance.leap_customer.name, empAttendance.attendance_id)
                                                                    }} style={{ cursor: "pointer" }}>
                                                                        <div className="attendance_list">

                                                                            <div className="row" style={{ alignItems: "center" }}>
                                                                                <div className="col-lg-2 text-center"><img src={empAttendance.img_attachment?getImageApiURL+"/uploads/"+ empAttendance.img_attachment:staticIconsBaseURL+"/images/attendance_profile_img.png"} className="img-fluid" 
                                                                                style={{ maxHeight: "40px", borderRadius: "40px" ,
                                                                                        
                                                                                        maxWidth: "40px",
                                                                                        minWidth: "40px"}} /></div>
                                                                                <div className="col-lg-7 row">
                                                                                    <div className="col-lg-12">{empAttendance.leap_customer.name}</div>
                                                                                    <div className="col-lg-12 font12">Time: {dasheddate(empAttendance.updated_at, true)}</div>
                                                                                </div>
                                                                                {empAttendance.attendanceStatus == 1 ?
                                                                                    <div className="col-lg-3 attendance_status"><span style={{ backgroundColor: "#b8dca0" }}>Started</span></div>
                                                                                    : empAttendance.attendanceStatus == 3 ?
                                                                                        <div className="col-lg-3 attendance_status"><span style={{ backgroundColor: "#e3e3e3", color: "#FFF" }}>Paused</span></div>
                                                                                        : empAttendance.attendanceStatus == 4 ?
                                                                                            <div className="col-lg-3 attendance_status"><span style={{ backgroundColor: "#ff813e", color: "#FFF" }}>Resumed</span></div>
                                                                                            : <div className="col-lg-3 attendance_status"><span style={{ backgroundColor: "#ffbebf", color: "#FFF" }}>Stopped</span></div>


                                                                                }
                                                                            </div>

                                                                        </div>
                                                                    </div>))}


                                                            </div> : <div> No Data Available</div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    : <LoadingDialog isLoading={true} />

            }


            />
            <Footer />

        </div>


    )
}



export default Dashboard


async function getAllActivitiesOfUsers(clientId: any, branchId: any) {
    const today = new Date();
    const startOfDay = getStartOfDay();
    const endOfDay = getEndOfDay();

    try {

        let qwery = supabase.from("leap_client_useractivites")
            .select(`*,leap_user_activity_type(*)`).eq('client_id', clientId)
            .gte('created_at', startOfDay)
            .lt('created_at', endOfDay);

        if (branchId!) {
            qwery = qwery.eq('branch_id', branchId)
        }
        qwery = qwery.order('id', { ascending: false })

        const { data: userActivities, error } = await qwery;
        if (error) {
            return [];
        }
        const activities: LeapUserActivitiesModel[] = userActivities

        return activities;

    } catch (error) {
        console.log(error);
        return [];

    }
}