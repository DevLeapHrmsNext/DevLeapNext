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
import { DateRange, RangeKeyDict } from 'react-date-range';
import { Range } from 'react-date-range';
import { format } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz';

import { start } from 'repl'
import { EmployeeLeave_Approval_LeaveType } from '@/app/models/leaveModel'
import { ALERTMSG_exceptionString, getImageApiURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'
import BackButton from '@/app/components/BackButton'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
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
    isWeekend: boolean;
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
        isWeekend: false,
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
        setLoading(true);
        try {
            const startDate = filterValues.start_date || formatDateYYYYMMDD(new Date());
            const endDate = (filterValues.start_date !== filterValues.end_date)
                ? filterValues.end_date
                : formatDateYYYYMMDD(new Date());
            // const formData = new FormData();
            let formData = {
                "client_id": contextClientID,
                "branch_id": contaxtBranchID,
                "customer_id": dashboard_notify_cust_id,
                "start_date": startDate,
                "end_date": endDate
            }

            const response = await fetch("/api/clientAdmin/getAllEmployeeAttendance", {
                method: "POST",
                body: JSON.stringify(
                    formData
                ),
            });
            const apiResponse = await response.json();
            // console.log(apiResponse);

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
                    console.log();
                    if (apiResponse.data[0].leap_customer_attendance) {
                        for (let j = 0; j < apiResponse.data[0].leap_customer_attendance.length; j++) {
                            if (dateRanges[i].actual_date == apiResponse.data[0].leap_customer_attendance[j].date) {
                                isPresent = j;
                            }

                        }
                    }
                    if (apiResponse.holidaylist && apiResponse.holidaylist.length > 0) {
                        for (let k = 0; k < apiResponse.holidaylist.length; k++) {
                            if (dateRanges[i].actual_date == apiResponse.holidaylist[k].date) {
                                isHoliday = k;
                            }
                        }
                    }
                    if (apiResponse.leaveList) {
                        for (let x = 0; x < apiResponse.leaveList.length; x++) {
                            if (dateRanges[i].actual_date == apiResponse.leaveList[x].from_date || dateRanges[i].actual_date == apiResponse.leaveList[x].to_date) {
                                wasonLeave = x;
                            }
                        }
                    }
                    if (isPresent >= 0) {
                        empAttendanceData.push({
                            date: dateRanges[i].date,
                            month_year: dateRanges[i].month_year,
                            actualDate: dateRanges[i].actual_date,
                            isWeekend: dateRanges[i].isWeekend,
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
                            isWeekend: dateRanges[i].isWeekend,
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
                            isWeekend: dateRanges[i].isWeekend,
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
                            isWeekend: dateRanges[i].isWeekend,
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
        window.scrollTo({ top: 160, behavior: "smooth" });

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
        } else {
            setFilterValues((prev) => ({ ...prev, ['start_date']: formatDateYYYYMMDD(ranges.selection.startDate) }));
            setFilterValues((prev) => ({ ...prev, ['end_date']: formatDateYYYYMMDD(ranges.selection.endDate) }));
        }
    };
    const formattedRange = formatDateYYYYMMDD(state[0].startDate) == formatDateYYYYMMDD(state[0].endDate) ? format(state[0].startDate!, 'yyyy-MM-dd') : `${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;
    function filter_whitebox() {
        const x = document.getElementById("filter_whitebox");
        if (x!.className === "filter_whitebox") {
            x!.className += " filter_whitebox_open";
        } else {
            x!.className = "filter_whitebox";
        }
    }
    const calculateTimeDuration = (startDate: any, endDate: any) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = end.getTime() - start.getTime(); // in milliseconds
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        return diffMinutes;
    }
    const WORKING_MINUTES = 480;

    function getTotalWorkedMinutes(
        inTime: string,
        outTime: string | null,
        pauseDurationMinutes: number
    ): { totalMinutes: number; netMinutes: number } {
        const now = new Date();
        const start = new Date(inTime);
        const end = outTime ? new Date(outTime) : now;

        const totalMinutes = (end.getTime() - start.getTime()) / 1000 / 60;
        const netMinutes = totalMinutes - pauseDurationMinutes;
        return {
            totalMinutes: Math.max(0, Math.floor(totalMinutes)),
            netMinutes: Math.max(0, Math.floor(netMinutes)),
        };
    }
    const formatMinutesToHours = (minutes: number) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    };
    const { netMinutes } = getTotalWorkedMinutes(
        dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.in_time || '0',
        dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.out_time || '0',

        // attendanceData.in_time,
        // attendanceData.out_time,
        // parseInt(attendanceData.paused_duration || '0') || 0
        parseInt(dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.paused_duration || '0') || 0
    );
    const calculateProgressPercentage = () => {
        // const worked = calculateWorkedMinutes();
        // const percent = Math.min(55, 100); // Cap at 100%
        const percent = Math.min((netMinutes / WORKING_MINUTES) * 100, 100); // Cap at 100%
        return Math.round(percent);
    };

    const [isExpanded, setIsExpanded] = useState(false);
    const toggleText = () => {
        setIsExpanded(prev => !prev);
    };

    return (
        <div className="mainbox user_mainbox_new_design">
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel
                menuIndex={21}
                subMenuIndex={0}
                showLeftPanel={true}
                rightBoxUI={
                    <>
                        {/* ========= New structure start ============ */}
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="nw_user_inner_mainbox">
                                        <div className="nw_user_inner_heading_tabbox new_user_attendance_heading_tabbox">
                                            <div className="heading25">
                                                My Attendance
                                            </div>
                                            <div className="nw_user_inner_tabs nw_user_inner_right_tabs">
                                                <ul>
                                                    <li className="filter_relative_li">
                                                        <div className="nw_user_filter_mainbox width_300">
                                                            <div className="filter_whitebox" id="filter_whitebox">
                                                                <div className="nw_filter_form_group_mainbox nw_filter_form_group_mainbox_two">
                                                                    <div className="nw_filter_form_group">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            // value={formattedRange}
                                                                            placeholder='Date'
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
                                                                                    maxDate={new Date()}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="nw_filter_form_group">
                                                                        <a
                                                                            className={`red_button filter_submit_btn ${loadingCursor ? 'loading' : ''}`}
                                                                            onClick={() => {
                                                                                setLoadingCursor(true);
                                                                                fetchData();
                                                                            }}
                                                                        >
                                                                            Submit
                                                                        </a>
                                                                    </div>
                                                                    <div className="nw_filter_submit_btn">
                                                                        <a onClick={() => resetFilter()}>
                                                                            <img src={staticIconsBaseURL + "/images/user/undo.svg"} alt="Undo Filter" className="img-fluid" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="nw_filter_icon" onClick={filter_whitebox}>
                                                                <img
                                                                    src={staticIconsBaseURL + "/images/user/filter-icon.svg"}
                                                                    alt="Filter icon"
                                                                    className="img-fluid new_filter_color_change_blue"
                                                                />
                                                                <img
                                                                    src={staticIconsBaseURL + "/images/user/filter-icon-red.svg"}
                                                                    alt="Filter icon"
                                                                    className="img-fluid new_filter_color_change_red"
                                                                />
                                                                <div className="new_filter_tooltip_box">Filter</div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                </ul>
                                            </div>
                                        </div>
                                        {/* Main Content Box */}
                                        <div className="nw_user_inner_content_box new_user_attendance_contentbox" style={{ minHeight: '60vh' }}>
                                            <div className="row mt-4">
                                                {/* Attendance List */}
                                                <div className="col-xl-5 col-xxl-4">
                                                    <div className="new_user_attendance_scrollbox">
                                                        <div className="row">
                                                            {dateRangeAttendanceData.map((dates, index) => (
                                                                <div
                                                                    className="col-lg-12"
                                                                    key={index}
                                                                    onClick={() => {
                                                                        if (dates.employeeAttendance != null) {
                                                                            setShowMap(true);
                                                                            setSelectedAttendenceIndex(index);
                                                                            setShowAttendance(
                                                                                dates.employeeAttendance.attendance_id,
                                                                                dates.actualDate,
                                                                                empAttendanceData[0].emp_id,
                                                                                empAttendanceData[0].name,
                                                                                empAttendanceData[0].leap_client_designations?.designation_name || '--',
                                                                                empAttendanceData[0].leap_client_departments?.department_name || '--'
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    <div className="att_detail_whitelist new_user_att_detail_whitelist">
                                                                        <div className="row align-items-center">
                                                                            <div className="col-lg-3">
                                                                                <div className="att_detail_datebox new_user_small_leftbox">
                                                                                    {dates.date} <span>{dates.month_year}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-lg-9">
                                                                                <div className="new_user_attendance_small_mainbox">
                                                                                    {dates.isHoliday ? (
                                                                                        <>
                                                                                            <div className="new_small_holidy_box">
                                                                                                <div className="new_small_holidy_heading">Holiday</div>
                                                                                                <div className="new_small_holidy_name">
                                                                                                    {dates.holidayName}
                                                                                                </div>
                                                                                            </div>
                                                                                        </>
                                                                                    )
                                                                                        : dates.wasOnLeave ? (
                                                                                            <>
                                                                                                <div className="new_small_leave_box">
                                                                                                    <div className="new_small_leave_first_box">
                                                                                                        <div className="my_attendance_start_time_name">Leave:</div>
                                                                                                        <div className="my_attendance_start_time">{dates.leaveTypeName}</div>
                                                                                                    </div>
                                                                                                    <div className="new_small_leave_secound_box">
                                                                                                        <div className="my_attendance_start_time_name">Status:</div>
                                                                                                        <div className="new_small_leave_statusbox">
                                                                                                            <div className="new_small_leave_pending"></div>
                                                                                                            {/* <div className="new_small_leave_approved"></div>
                                                                                                                                                                                <div className="new_small_leave_disapproved"></div> */}
                                                                                                            <div className="new_small_leave_status">{dates.leaveApprovalStatus}</div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>
                                                                                        ) : dates.isWeekend && dates.employeeAttendance === null ? (
                                                                                            <div className="new_small_weekend_box">

                                                                                                <div className="new_small_holidy_heading">Week-off</div>
                                                                                                <div className="new_small_holidy_name">
                                                                                                    {format(new Date(dates.actualDate), 'EEEE')}
                                                                                                </div>
                                                                                            </div>
                                                                                        ) : dates.employeeAttendance?.in_time ?
                                                                                            (
                                                                                                <>
                                                                                                    <div className="new_small_timing_box new_small_timing_present">
                                                                                                        <div className="row">
                                                                                                            <div className="col-lg-6">
                                                                                                                <div className="my_attendance_start_time_box_listing">
                                                                                                                    <div className="my_attendance_start_time_name">Start Time</div>
                                                                                                                    <div className="my_attendance_start_time">
                                                                                                                        {dates.employeeAttendance?.in_time
                                                                                                                            ? formatInTimeZone(new Date(dates.employeeAttendance.in_time), 'UTC', 'hh:mm a')
                                                                                                                            //  (new Date(dates.employeeAttendance.in_time).toLocaleTimeString('en-US', {
                                                                                                                            //     hour: '2-digit',
                                                                                                                            //     minute: '2-digit',
                                                                                                                            //     hour12: true,
                                                                                                                            // }))
                                                                                                                            : '--'}
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-6">
                                                                                                                <div className="my_attendance_start_time_box_listing">
                                                                                                                    <div className="my_attendance_start_time_name">End Time</div>
                                                                                                                    <div className="my_attendance_start_time">
                                                                                                                        {dates.employeeAttendance?.out_time
                                                                                                                            ? formatInTimeZone(new Date(dates.employeeAttendance.out_time), 'UTC', 'hh:mm a')
                                                                                                                            // (new Date(dates.employeeAttendance.out_time).toLocaleTimeString('en-US', {
                                                                                                                            //     hour: '2-digit',
                                                                                                                            //     minute: '2-digit',
                                                                                                                            //     hour12: true,
                                                                                                                            // }))
                                                                                                                            : '--'}
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="row">
                                                                                                            <div className="col-lg-12">
                                                                                                                <div className="my_attendance_start_time_box_listing_last">
                                                                                                                    <div className="my_attendance_start_time_name">Work Location:</div>
                                                                                                                    <div className="my_attendance_start_time">
                                                                                                                        {dates.employeeAttendance?.leap_working_type?.type || '--'}
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </>
                                                                                            ) :
                                                                                            <div className="new_small_timing_absent">
                                                                                                <div className="new_small_holidy_heading">Absent</div>
                                                                                                <div className="new_small_holidy_name">
                                                                                                    {/* {format(new Date(dates.actualDate), 'EEEE')} */}
                                                                                                </div>
                                                                                            </div>
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Profile Box */}
                                                <div className="col-xl-7 col-xxl-8">
                                                    <div className="row">
                                                        <div className="col-lg-12 mb-4 mt-lg-4 mt-xl-0">
                                                            <div className="att_detail_profilebox user_att_detail_profilebox">
                                                                <div className="row">
                                                                    <div className="col-lg-3 text-center">
                                                                        <div className="my_attendance_right_mainbox">
                                                                            <div className="my_attendance_right_imgbox">
                                                                                <img src=
                                                                                    {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.img_attachment ?
                                                                                        getImageApiURL + "/uploads/" + dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.img_attachment :
                                                                                        staticIconsBaseURL + "/images/user/profile-image.jpg"}
                                                                                    // src="/images/user/40_profile13182025112.jpeg" className="img-fluid" alt="Profile"
                                                                                />
                                                                            </div>
                                                                            <div className="my_attendance_right_name_id_box">
                                                                                <div className="my_attendance_right_name">
                                                                                    {/* {empAttendanceData[0].name} */}
                                                                                </div>
                                                                                <div className="my_attendance_right_id">
                                                                                    {/* Emp Code: */}
                                                                                    {/* <span>{empAttendanceData[0].emp_id}</span> */}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-9 text-center">
                                                                        <div className="my_attendance_start_time_mainbox">
                                                                            <div className="row">
                                                                                <div className="col-lg-4">
                                                                                    <div className="my_attendance_start_time_box_listing">
                                                                                        <div className="my_attendance_start_time_name">Start Time</div>
                                                                                        <div className="my_attendance_start_time">
                                                                                            {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.in_time
                                                                                                ? formatInTimeZone(new Date(dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.in_time), 'UTC', 'hh:mm a')
                                                                                                // (new Date(dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.in_time).toLocaleTimeString('en-US', {
                                                                                                //     hour: '2-digit',
                                                                                                //     minute: '2-digit',
                                                                                                //     hour12: true,
                                                                                                // }))
                                                                                                : '--'}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="my_attendance_start_time_box_listing my_attendance_start_time_box_listing_middle">
                                                                                        <div className="my_attendance_start_time_name">End Time</div>
                                                                                        <div className="my_attendance_start_time">
                                                                                            {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.out_time
                                                                                                ? formatInTimeZone(new Date(dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.out_time), 'UTC', 'hh:mm a')
                                                                                                //  (new Date(dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance.out_time).toLocaleTimeString('en-US', {
                                                                                                //     hour: '2-digit',
                                                                                                //     minute: '2-digit',
                                                                                                //     hour12: true,
                                                                                                // }))
                                                                                                : '--'}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="my_attendance_start_time_box_listing">
                                                                                        <div className="my_attendance_start_time_name">Working Type</div>
                                                                                        <div className="my_attendance_start_time">
                                                                                            {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.leap_working_type?.type ||
                                                                                                '--'}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/* Breaks */}
                                                                        {/* {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.pause_start_time && ( */}
                                                                        <>
                                                                            <div className="row">
                                                                                <div className="col-lg-9">
                                                                                    <div className="my_user_attendance_break_mainbox">
                                                                                        <div className="my_user_attendance_break_heading">Breaks</div>
                                                                                        {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.pause_start_time &&
                                                                                            dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.pause_start_time.length > 0 ?
                                                                                            dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.pause_start_time.map((data, index) =>
                                                                                                <div className="my_user_attendance_breakbox" key={index}>
                                                                                                    <div className="my_user_attendance_breakbox_left">
                                                                                                        <div className="my_user_attendance_breakbox_left_heading">Duration</div>
                                                                                                        <div className="my_user_attendance_breakbox_left_content">
                                                                                                            {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.pause_end_time[index] ?
                                                                                                                calculateTimeDuration(data, dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.pause_end_time[index]) : "--"} mins
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="my_user_attendance_breakbox_right">
                                                                                                        <div className="my_user_attendance_breakbox_break">
                                                                                                            {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.paused_reasons[index] ?
                                                                                                                (dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.paused_reasons[index]) : "--"}
                                                                                                        </div>
                                                                                                        <div className="my_user_attendance_breakbox_timing">
                                                                                                            {formatInTimeZone(new Date(data), 'UTC', 'hh:mm a')} To
                                                                                                            {dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.pause_end_time[index] ?
                                                                                                                formatInTimeZone(new Date(dateRangeAttendanceData[selectedAttendenceIndex].employeeAttendance?.pause_end_time[index]), 'UTC', 'hh:mm a') : "--"}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ) : <> No breaks taken</>
                                                                                        }

                                                                                        {/* {isExpanded && (
                                                                                            <span className="moretext">
                                                                                                {' '}
                                                                                                <div className="my_user_attendance_breakbox">
                                                                                                    <div className="my_user_attendance_breakbox_left">
                                                                                                        <div className="my_user_attendance_breakbox_left_heading">Duration</div>
                                                                                                        <div className="my_user_attendance_breakbox_left_content">10 min</div>
                                                                                                    </div>
                                                                                                    <div className="my_user_attendance_breakbox_right">
                                                                                                        <div className="my_user_attendance_breakbox_break">Taking Tea Break</div>
                                                                                                        <div className="my_user_attendance_breakbox_timing">4:00pm To 4:15pm</div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </span>
                                                                                        )} */}
                                                                                    </div>
                                                                                    {/* <div onClick={toggleText} className="user_attendance_readmore_iconbox">
                                                                                        {isExpanded ?
                                                                                            <div className="read_leass_svg">
                                                                                                <svg width="25" height="25" x="0" y="0" viewBox="0 0 24 24">
                                                                                                    <circle r="12" cx="12" cy="12" fill="#ffffff" transform="matrix(0.68,0,0,0.68,3.84,3.84)" />
                                                                                                    <g transform="matrix(-1.0799999999999994,1.3226185430791412e-16,-1.3226185430791412e-16,-1.0799999999999994,24.959999999999983,24.959999999999983)"><path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1zm5.707 9.707-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L12 13.586l4.293-4.293a1 1 0 0 1 1.414 1.414z" data-name="Layer 2" fill="#cbd6de" opacity="1" data-original="#000000"></path>
                                                                                                    </g>
                                                                                                </svg>
                                                                                            </div>
                                                                                            :
                                                                                            <div className="read_more_svg">
                                                                                                <svg width="25" height="25" x="0" y="0" viewBox="0 0 24 24">
                                                                                                    <circle r="12" cx="12" cy="12" fill="#ffffff" transform="matrix(0.68,0,0,0.68,3.84,3.84)" />
                                                                                                    <g transform="matrix(1.0799999999999994,-4.930380657631324e-32,4.930380657631324e-32,1.0799999999999994,-0.960000000000008,-0.9600000000000044)"><path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1zm5.707 9.707-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L12 13.586l4.293-4.293a1 1 0 0 1 1.414 1.414z" data-name="Layer 2" fill="#cbd6de" opacity="1" data-original="#000000"></path>
                                                                                                    </g>
                                                                                                </svg>
                                                                                            </div>
                                                                                        }
                                                                                    </div> */}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                        {/* )} */}
                                                                    </div>
                                                                </div>
                                                                <div className="user_attendance_timer_box">
                                                                    <div className="new_attendancebox_lastbox">
                                                                        <div className="dial_container">
                                                                            <div className="dial_overlay_office">
                                                                                Total Hours
                                                                            </div>
                                                                            <CircularProgressbar
                                                                                value={calculateProgressPercentage()}
                                                                                text={formatMinutesToHours(netMinutes)}
                                                                                background
                                                                                // backgroundPadding={6}
                                                                                strokeWidth={10}
                                                                                styles={buildStyles({
                                                                                    backgroundColor: "transparent",
                                                                                    textColor: "#000",
                                                                                    pathColor: "#5DC600",
                                                                                    trailColor: "#CECECE",
                                                                                    textSize: "10px",
                                                                                })}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
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
                    </>
                }
            />
            <Footer />
        </div>
    );
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
        const isoDate = currentDate.toISOString().split("T")[0];
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday

        tempDates.push({
            date: `${day}${suffix}`,
            month_year: monthYear,
            actual_date: isoDate,
            isWeekend: dayOfWeek === 0 || dayOfWeek === 6, // Sunday or Saturday
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



