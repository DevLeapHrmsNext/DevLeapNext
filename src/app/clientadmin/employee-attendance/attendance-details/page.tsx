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
import { leftMenuAttendancePageNumbers } from '@/app/pro_utils/stringRoutes'
import { getImageApiURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants';
import { DateRange, RangeKeyDict } from 'react-date-range';
import { Range } from 'react-date-range';
import { format } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz';

import { start } from 'repl'
import { EmployeeLeave_Approval_LeaveType } from '@/app/models/leaveModel'
import { ALERTMSG_exceptionString } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'
import AssignEmployeeAttendance from '@/app/components/dialog_assignEmpAttendance'
// import AttendanceMap from '@/app/components/trackerMap'
const AttendanceMap = dynamic(() => import('@/app/components/trackerMap'), { ssr: false });


interface FilterValues {
    start_date: any,
    end_date: any,

}
interface DateRangeModel {
    date: any,
    month_year: any,
    actualDate: any,
    isHoliday: boolean,
    holidayName: any,
    wasOnLeave: boolean,
    leaveTypeName: any,
    leaveApprovalStatus: any

    employeeAttendance: LeapCustomerAttendanceAPI | null
}
interface selectedAttendance {
    selected_attendanceID: any,
    selected_date: any,
    selected_empID: any
    selected_empName: any
    selected_empDesignation: any
    selected_empDepartment: any
}

const EmpAttendancePage = () => {


    const [scrollPosition, setScrollPosition] = useState(0);
    const { contaxtBranchID, contextClientID, dashboard_notify_cust_id, setGlobalState } = useGlobalContext();
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [showAssignDialog, setShowAttendanceAssignDialog] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [showMap, setShowMap] = useState(false);
    const [empAttendanceData, setEmpAttendanceData] = useState<Employee[]>([]);
    const [holidayList, setHolidayList] = useState<HolidayListYear[]>([]);
    const [empleaveList, setEmpLeaveList] = useState<EmployeeLeave_Approval_LeaveType[]>([]);
    const [selectedAttendenceIndex, setSelectedAttendenceIndex] = useState(0);
    const [dateRangeAttendanceData, setDateRangeAttendanceData] = useState<DateRangeModel[]>([{
        date: '',
        month_year: '',
        actualDate: '',
        employeeAttendance: {
            date: '',
            remark: '',
            in_time: '',
            out_time: '',
            client_id: 0,
            if_paused: false,
            created_at: '',
            updated_at: '',
            approved_by: '',
            customer_id: 0,
            total_hours: 0,
            attendance_id: 0,
            img_attachment: '',
            pause_end_time: [],
            approval_status: '',
            paused_duration: '',
            working_type_id: '',
            attendanceStatus: 0,
            pause_start_time: [],
            paused_reasons: [],
            leap_working_type: {
                id: 0,
                type: '',
                created_at: ''
            },
            leap_customer_attendance_geolocation: []
        },
        isHoliday: false,
        holidayName: undefined,
        wasOnLeave: false,
        leaveTypeName: undefined,
        leaveApprovalStatus: undefined
    }]);

    const [selectedData, setSelectedData] = useState<selectedAttendance>({
        selected_attendanceID: '',
        selected_date: '',
        selected_empName: '',
        selected_empID: '',
        selected_empDepartment: '',
        selected_empDesignation: '',
    });
    // const [dateRange, setDateRange] = useState<string[]>([]);

    const [filterValues, setFilterValues] = useState<FilterValues>({

        start_date: '',
        end_date: ''
    })
    const [showCalendar, setShowCalendar] = useState(false);
    const [state, setState] = useState<Range[]>([
        {
            startDate: new Date() || null,
            endDate: new Date() || null,
            key: 'selection'
        }
    ]);


    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');
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
            start_date: formatDateYYYYMMDD(new Date()),
            end_date: formatDateYYYYMMDD(new Date()),

        })


        fetchData();
        return () => {

            window.removeEventListener('scroll', handleScroll);
        };



    }, []);

    const formatDateYYYYMMDD = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);


        return parsedDate.format('YYYY-MM-DD');
    };

    const claculateTimeDuration = (startDate: any, endDate: any) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const diffMs = end.getTime() - start.getTime(); // in milliseconds

        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        return diffMinutes;
    }

    const fetchData = async () => {
        console.log("start date selecte in fetch data", filterValues.start_date);
        console.log("end date selecte in fetch data", filterValues.end_date);
        setLoading(true);
        try {
            // const formData = new FormData();
            // formData.append("client_id", contextClientID);
            // formData.append("branch_id", contaxtBranchID);
            // formData.append('start_date', filterValues.start_date || formatDateYYYYMMDD(new Date()));
            const endDate = filterValues.start_date != filterValues.end_date ? filterValues.end_date : formatDateYYYYMMDD(new Date())
            // formData.append('end_date', endDate);
            // formData.append('customer_id', dashboard_notify_cust_id);

            const response = await fetch("/api/clientAdmin/getAllEmployeeAttendance", {
                method: "POST",
                body: JSON.stringify({
                    "client_id": contextClientID,
                    "branch_id": contaxtBranchID,
                    "start_date": filterValues.start_date || formatDateYYYYMMDD(new Date()),
                    "end_date": endDate,
                    "customer_id": dashboard_notify_cust_id,
                }),
            });
            const apiResponse = await response.json();
            console.log(apiResponse);

            setLoading(false);
            if (apiResponse.status == 1) {

                setEmpAttendanceData(apiResponse.data);
                setHolidayList(apiResponse.holidaylist);
                setEmpLeaveList(apiResponse.leaveList);


                const dateRanges = generateDateRange(filterValues.start_date || formatDateYYYYMMDD(new Date()), filterValues.end_date || formatDateYYYYMMDD(new Date()))

                const empAttendanceData: DateRangeModel[] = []
                for (let i = 0; i < dateRanges.length; i++) {
                    let isPresent = -1;
                    let isHoliday = -1;
                    let wasonLeave = -1;
                    console.log("niks-------=-==--=-==-=-==-=-=-=-=-=-=-=--=----=-=-=-1111");
                    if (apiResponse.data[0].leap_customer_attendance) {
                        for (let j = 0; j < apiResponse.data[0].leap_customer_attendance.length; j++) {
                            if (dateRanges[i].actual_date == apiResponse.data[0].leap_customer_attendance[j].date) {
                                isPresent = j;
                            }

                        }
                    }
                    console.log("niks-------=-==--=-==-=-==-=-=-=-=-=-=-=--=----=-=-=-2222");

                    if (apiResponse.holidaylist && apiResponse.holidaylist.length > 0) {
                        for (let k = 0; k < apiResponse.holidaylist.length; k++) {
                            if (dateRanges[i].actual_date == apiResponse.holidaylist[k].date) {
                                isHoliday = k;
                            }
                        }
                    }
                    console.log("niks-------=-==--=-==-=-==-=-=-=-=-=-=-=--=----=-=-=-3333");

                    if (apiResponse.leaveList) {
                        for (let x = 0; x < apiResponse.leaveList.length; x++) {
                            if (dateRanges[i].actual_date == apiResponse.leaveList[x].from_date || dateRanges[i].actual_date == apiResponse.leaveList[x].to_date) {
                                wasonLeave = x;
                            }
                        }
                    }
                    console.log("niks-------=-==--=-==-=-==-=-=-=-=-=-=-=--=----=-=-=-4444",isPresent);
                    if (isPresent >= 0) {
                        empAttendanceData.push({
                            date: dateRanges[i].date,
                            month_year: dateRanges[i].month_year,
                            actualDate: dateRanges[i].actual_date,
                            employeeAttendance: apiResponse.data[0].leap_customer_attendance[isPresent],
                            isHoliday: false,
                            holidayName: undefined,
                            wasOnLeave: false,
                            leaveTypeName: undefined,
                            leaveApprovalStatus: undefined
                        });
                    } else if (isHoliday >= 0) {
                        empAttendanceData.push({
                            date: dateRanges[i].date,
                            month_year: dateRanges[i].month_year,
                            actualDate: dateRanges[i].actual_date,
                            employeeAttendance: apiResponse.data[0].leap_customer_attendance[isPresent],
                            isHoliday: true,
                            holidayName: apiResponse.holidaylist[isHoliday].holiday_name,
                            wasOnLeave: false,
                            leaveTypeName: undefined,
                            leaveApprovalStatus: undefined
                        });
                    } else if (wasonLeave >= 0) {
                        empAttendanceData.push({
                            date: dateRanges[i].date,
                            month_year: dateRanges[i].month_year,
                            actualDate: dateRanges[i].actual_date,
                            employeeAttendance: apiResponse.data[0].leap_customer_attendance[isPresent],
                            isHoliday: false,
                            holidayName: '',
                            wasOnLeave: true,
                            leaveTypeName: apiResponse.leaveList[wasonLeave].leap_client_leave.leave_name,
                            leaveApprovalStatus: apiResponse.leaveList[wasonLeave].leap_approval_status.approval_type
                        });
                    } else {
                        empAttendanceData.push({
                            date: dateRanges[i].date,
                            month_year: dateRanges[i].month_year,
                            actualDate: dateRanges[i].actual_date,
                            employeeAttendance: null,
                            isHoliday: false,
                            holidayName: undefined,
                            wasOnLeave: false,
                            leaveTypeName: undefined,
                            leaveApprovalStatus: undefined
                        });
                    }
                }

                setDateRangeAttendanceData(empAttendanceData);

                if (dashboard_notify_cust_id.length > 0) {
                    // const values: any = { value: apiResponse.data[0].customer_id, label: apiResponse.data[0].emp_id + "  " + apiResponse.data[0].name }
                    setShowMap(true);
                    setShowAttendance(
                        apiResponse.data[0].leap_customer_attendance[0].attendance_id,
                        formatDateYYYYMMDD(new Date()),
                        apiResponse.data[0].emp_id,
                        apiResponse.data[0].name,
                        apiResponse.data[0].leap_client_designations.designation_name,
                        apiResponse.data[0].leap_client_departments.department_name
                    )
                } else {
                    setSelectedData({
                        selected_attendanceID: '',
                        selected_date: '',
                        selected_empID: '',
                        selected_empName: '',
                        selected_empDesignation: '',
                        selected_empDepartment: '',
                    })
                }
                setLoadingCursor(false);
                setLoading(false);

            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to get employee attendance");
                setAlertForSuccess(2)

            }

        } catch (e) {
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Exception");
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2);
            console.log(e);

        }
    }
    const resetFilter = async () => {

        setFilterValues({
            start_date: formatDateYYYYMMDD(new Date()),
            end_date: formatDateYYYYMMDD(new Date()),
        });
        fetchData();
    }


    const setShowAttendance = (attendanceID: any, date: any, empID: any, empName: any,
        empDesignation: any, empDepartment: any) => {

        setSelectedData({
            selected_attendanceID: attendanceID,
            selected_date: date,
            selected_empID: empID,
            selected_empName: empName,
            selected_empDesignation: empDesignation,
            selected_empDepartment: empDepartment,
        })
    };

    const handleDateChange = (ranges: RangeKeyDict) => {

        setState([ranges.selection]);
        setShowCalendar(false)
        if (ranges.selection.startDate == ranges.selection.endDate) {
            setFilterValues((prev) => ({ ...prev, ['start_date']: formatDateYYYYMMDD(ranges.selection.startDate) }));
            setFilterValues((prev) => ({ ...prev, ['end_date']: formatDateYYYYMMDD(ranges.selection.endDate) }));

        } else {
            setFilterValues((prev) => ({ ...prev, ['start_date']: formatDateYYYYMMDD(ranges.selection.startDate) }));
            setFilterValues((prev) => ({ ...prev, ['end_date']: formatDateYYYYMMDD(ranges.selection.endDate) }));

        }
    };
    const formattedRange = formatDateYYYYMMDD(state[0].startDate) == formatDateYYYYMMDD(state[0].endDate) ? format(state[0].startDate!, 'yyyy-MM-dd') : `${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;


    return (
        <div className='mainbox attendance_details_mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={leftMenuAttendancePageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={

                <div className="container">
                    <LoadingDialog isLoading={isLoading} />
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)
                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    <div className="row pt-2 mb-5">
                        <div className="col-lg-9 heading25">
                            Attendance <span>Details</span>
                            
                        </div>
                        <div className="col-lg-3" style={{ textAlign: "right" }}>
                                <a className="red_button red_button2" onClick={() => setShowAttendanceAssignDialog(true)}>Assign Attendence</a>&nbsp;
                            </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="filter_whitebox filter_whitebox_open" id="filter_whitebox_open">
                                    <div className="row" style={{ alignItems: "center" }}>

                                        <div className="col-lg-3">

                                            <div className="form_box">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formattedRange}
                                                    readOnly
                                                    onClick={() => setShowCalendar(!showCalendar)}
                                                />
                                                {showCalendar && (
                                                    <div style={{ position: 'absolute', zIndex: 1000 }}>
                                                        <DateRange
                                                            editableDateInputs={true}
                                                            onChange={handleDateChange}
                                                            moveRangeOnFirstSelection={false}
                                                            ranges={state}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-lg-3">
                                            <div className="form_box mb-2">
                                                <a className={`red_button filter_submit_btn ${loadingCursor ? "loading" : ""}`} onClick={() => { setLoadingCursor(true), fetchData() }}>Submit</a>&nbsp;
                                                <a className="red_button filter_submit_btn" onClick={() => resetFilter()}>Reset</a>&nbsp;
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="nw_user_offcanvas">
                        <div className={showAssignDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                            {showAssignDialog && <AssignEmployeeAttendance  customer_id={dashboard_notify_cust_id} date={""}  onClose={() => { setShowAttendanceAssignDialog(false) } }   />}
                        </div>
                        <div className="overlay_offcanvas"></div>

                    </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="row">
                                {dateRangeAttendanceData.map((dates, index) =>
                                    <div className="col-lg-12" key={index} onClick={() => {

                                        if (dates.employeeAttendance != null) {
                                            setShowMap(true);
                                            setSelectedAttendenceIndex(index)
                                            setShowAttendance(
                                                dates!.employeeAttendance.attendance_id,
                                                dates.actualDate,
                                                empAttendanceData[0].emp_id,
                                                empAttendanceData[0].name,
                                                empAttendanceData[0].leap_client_designations != null ? empAttendanceData[0].leap_client_designations!.designation_name : "--",
                                                empAttendanceData[0].leap_client_departments != null ? empAttendanceData[0].leap_client_departments!.department_name : "--")
                                        }

                                    }


                                    }>
                                        <div className={selectedAttendenceIndex == index ? "att_detail_whitelist att_selected" : "att_detail_whitelist"} style={{ backgroundColor: dates.isHoliday ? "#c4e7c4" : dates.wasOnLeave ? "#ffd9d9" : "#FFFFFF" }}>
                                            <div className="row">
                                                <div className="col-lg-3">
                                                    <div className="att_detail_datebox">
                                                        {dates.date} <span>{dates.month_year}</span>
                                                    </div>
                                                </div>
                                                {dates.isHoliday ?
                                                    // here is the hoilday display 
                                                    <div className="col-lg-9">
                                                        <div className="row mb-2 pb-2" style={{ borderBottom: "1px solid #ebeff2" }}>
                                                            <div className="col-lg-6">
                                                                Holiday

                                                            </div>

                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-12">
                                                                {dates.holidayName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    // here is the on leve display section
                                                    : dates.wasOnLeave ? <div className="col-lg-9">
                                                        <div className="row mb-2 pb-2" style={{ borderBottom: "1px solid #ebeff2" }}>
                                                            <div className="col-lg-12">
                                                                Leave Type:{dates.leaveTypeName}

                                                            </div>


                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-12">
                                                                Approval Status:{dates.leaveApprovalStatus}
                                                            </div>
                                                        </div>

                                                    </div> :



                                                        <div className="col-lg-9">
                                                            <div className="row mb-2 pb-2" style={{ borderBottom: "1px solid #ebeff2" }}>
                                                                <div className="col-lg-6">
                                                                    Start Time:<br></br>

                                                                    {dates.employeeAttendance != null && dates.employeeAttendance.in_time ? formatInTimeZone(new Date(dates.employeeAttendance.in_time), 'UTC', 'hh:mm a') : "--"}
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    End Time:<br></br>
                                                                    {dates.employeeAttendance != null && dates.employeeAttendance.out_time ? formatInTimeZone(new Date(dates.employeeAttendance.out_time), 'UTC', 'hh:mm a') : "--"}
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-lg-12">Work Location: {dates.employeeAttendance != null && dates.employeeAttendance.leap_working_type && dates.employeeAttendance.leap_working_type.type ? dates.employeeAttendance.leap_working_type.type : "--"}</div>
                                                            </div>
                                                        </div>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div style={{ position: "sticky", top: "90px" }}>
                                <div className="row">
                                    <div className="col-lg-12 mb-4">
                                        <div className="att_detail_profilebox">
                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <div className="row text-center" style={{ fontSize: "19px" }}>
                                                        <div className="col-lg-12 mb-3"><img src={
                                                            dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance != null &&
                                                                dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.img_attachment && dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.img_attachment.length > 0 ?
                                                                `${getImageApiURL}/uploads/${dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.img_attachment}` :
                                                                `${process.env.NEXT_PUBLIC_BASE_URL}/images/attendance_profile_img.png`} className="img-fluid" alt="User Pic" style={{ width: "200px", margin: "-40px 0 0 0", borderRadius: "15px" }} /></div>

                                                    </div>
                                                </div>
                                                <div className="col-lg-8">
                                                    <div className="row pb-3 mb-4 text-center" style={{ borderBottom: "1px solid #ececec" }}>
                                                        <div className="col-lg-4" style={{ borderRight: "1px solid #ccc" }}>
                                                            Start Time: <br></br>
                                                            <div style={{ fontFamily: "Outfit-SemiBold" }}>
                                                                {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance != null &&
                                                                    dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.in_time ?
                                                                    formatInTimeZone(new Date(dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.in_time), 'UTC', 'hh:mm a') : "--"}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4" style={{ borderRight: "1px solid #ccc" }}>
                                                            End Time: <br></br>
                                                            <div style={{ fontFamily: "Outfit-SemiBold" }}>
                                                                {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance != null &&
                                                                    dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.out_time ?
                                                                    formatInTimeZone(new Date(dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.out_time), 'UTC', 'hh:mm a') : "--"}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4">
                                                            Working Type: <br></br>
                                                            <div style={{ fontFamily: "Outfit-SemiBold" }}>
                                                                {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance != null &&
                                                                    dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.leap_working_type ?
                                                                    dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.leap_working_type.type : "--"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance != null && dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.pause_start_time &&
                                                        <div className="row">
                                                            <div className="col-lg-12 mb-2" style={{ fontFamily: "Outfit-Medium", fontSize: "18px" }}>Breaks:</div>
                                                        </div>}

                                                    <div className="row">

                                                        <div className="col-lg-9">
                                                            {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance != null && dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.pause_start_time &&
                                                                dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.pause_start_time.map((breakTime, index) =>
                                                                    <div className='breaks_list' key={index}>
                                                                        <div className="breaks_timebox">
                                                                            Duration <span> {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.pause_end_time[index] ? claculateTimeDuration(breakTime, dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.pause_end_time[index]) : "--"}
                                                                                min</span>
                                                                        </div>
                                                                        <div className="breaks_rightbox">
                                                                            <div className="row">
                                                                                <div className="col-lg-12 pb-1 mb-1" style={{ borderBottom: "1px solid #dae2e9" }}>{dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.paused_reasons[index] ? dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.paused_reasons[index] : ""}</div>
                                                                                <div className="col-lg-12">{formatInTimeZone(new Date(breakTime), 'UTC', 'hh:mm a')} To {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.pause_end_time[index] ? formatInTimeZone(new Date(dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.pause_end_time[index]), 'UTC', 'hh:mm a') : "--"}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>)}

                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-12"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        {showMap ?
                                            <AttendanceMap attendanceID={selectedData.selected_attendanceID}
                                                date={selectedData.selected_date}
                                                empName={selectedData.selected_empName}
                                                empID={selectedData.selected_empID}
                                                empDesignation={selectedData.selected_empDesignation}
                                                empDepartment={selectedData.selected_empDepartment}
                                            /> : <></>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12"></div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12"></div>
                    </div>
                </div>

            }
            />





            <Footer />
        </div>

    )
}

export default EmpAttendancePage;

const generateDateRange = (start: string, end: string) => {
    if (!start || !end) return [];

    const startDate = new Date(start);
    const endDate = new Date(end);
    const tempDates = [];

    const currentDate = new Date(startDate); // clone startDate to avoid mutation

    while (currentDate <= endDate) {
        const day = currentDate.getDate();
        const suffix = getOrdinalSuffix(day);
        const monthYear = format(currentDate, 'MMMM yyyy');

        tempDates.push({
            date: `${day}${suffix}`,
            month_year: monthYear,
            actual_date: currentDate.toISOString().split("T")[0],
        });

        currentDate.setDate(currentDate.getDate() + 1); // safely increment
    }


    return tempDates;

};
function getOrdinalSuffix(day: number) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

