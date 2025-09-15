// Manager side page where they can see and approve their team leaves

'use client'
import React, { useRef } from 'react'
import LeapHeader from '@/app/components/header'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { AppliedLeave } from '@/app/models/leaveModel'
import { CustomerProfile } from '@/app/models/employeeDetailsModel'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import LeaveStatusUpdate from '@/app/components/dialog_approvalStatus'
import LeftPannel from '@/app/components/leftPannel'
import BackButton from '@/app/components/BackButton'
import { DateRange, RangeKeyDict } from 'react-date-range';
import { Range } from 'react-date-range';
import { format } from 'date-fns'
import moment from 'moment'
import { ALERTMSG_exceptionString, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import PageErrorCenterContent from '@/app/components/pageError'
import ShowAlertMessage from '@/app/components/alert'
import { ALERTMSG_addAssetSuccess } from '@/app/pro_utils/stringConstants'

interface filterApply {
    approvedID: any,
    customerID: any,
    start_date: any,
    end_date: any
}

const EmployeeLeaveList = () => {
    const [leavearray, setLeave] = useState<AppliedLeave[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [filters, setFilters] = useState<filterApply>({ approvedID: "", customerID: "", start_date: '', end_date: '' })
    const [custArray, setCustomer] = useState<CustomerProfile[]>([]);
    const [statusArray, setStatus] = useState<StatusModel[]>([]);
    const [editLeaveId, setEditLeaveId] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const { contextCustomerID } = useGlobalContext();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [selectedPage, setSelectedPage] = useState(1);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [isToBeEdited, setisToBeEdited] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');
    const [selectedApprov, setselectedApprov] = useState("");
    const [selectedCust, setSelectedCust] = useState("");

    useEffect(() => {
        fetchData();
        fetchUsers("", "", "", selectedPage, "", "");
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
    }, [selectedPage])
    const fetchData = async () => {
        const customerName = await getCustomer(contextCustomerID);
        setCustomer(customerName);
        const approval = await getStatus();
        setStatus(approval);
    }
    const fetchUsers = async (filterID: any, approvedIdValue: any, customerValue: any, pageNumber: number, startDate: any, endDate: any,) => {
        setLoading(true);
        try {
            let formData = {
                "manager_id": contextCustomerID,
                "customer_id": 0,
                "leave_status": 0,
                "start_date": "",
                "end_date": ""
            }
            if (filterID == 1) {
                let approved_id = filters.approvedID.length > 0 && filters.approvedID == approvedIdValue ? filters.approvedID : approvedIdValue;
                formData = {
                    ...formData,
                    "leave_status": approved_id
                }
            }
            if (filterID == 2) {
                let customer_id = filters.customerID.length > 0 && filters.customerID == customerValue ? filters.customerID : customerValue
                formData = {
                    ...formData,
                    "customer_id": customer_id
                }
            }
            if (startDate || filters.start_date) {
                let start_Date = formatDateYYYYMMDD(startDate || filters.start_date);
                formData = {
                    ...formData,
                    "start_date": start_Date
                }
            }
            if (endDate || filters.end_date) {
                let end_Date = formatDateYYYYMMDD(endDate || filters.end_date);
                formData = {
                    ...formData,
                    "end_date": end_Date
                }
            }
            if (filterID == 1 || filters.approvedID.length > 0) {
                let approved_id = filters.approvedID == approvedIdValue ? filters.approvedID : approvedIdValue;
                formData = {
                    ...formData,
                    "leave_status": approved_id
                }
            }
            if (filterID == 2 || filters.customerID.length > 0) {
                let customer_id = filters.customerID == customerValue ? filters.customerID : customerValue;
                formData = {
                    ...formData,
                    "customer_id": customer_id
                }
            }
            const res = await fetch(`/api/users/getTeamLeaves?page=${pageNumber}&limit=${10}`, {
                method: "POST",
                body: JSON.stringify(
                    formData
                ),
            });
            const response = await res.json();
            const leaveListData = response.leavedata;

            if (response.status == 1 && leaveListData.length > 0) {
                setLoading(false);
                setLeave(leaveListData);
                if (leaveListData.length < 10) {
                    setHasMoreData(false);
                } else {
                    setHasMoreData(true);
                }
            } else if (response.status == 1 && leaveListData.length == 0) {
                setLoading(false);
                setLeave([]);
                setHasMoreData(false);
            } else if (response.status == 0) {
                setLoading(false);
                setSelectedPage(response.page);
                setHasMoreData(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load next page data");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoading(false);
            // setLoadingCursor(false);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
        }
    }
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name == "approvedID") {
            setFilters((prev) => ({ ...prev, ['approvedID']: value }));
            setselectedApprov(value);
            fetchUsers(1, value, selectedCust, selectedPage, '', '');
        }
        if (name == "customerID") {
            setFilters((prev) => ({ ...prev, ['customerID']: value }));
            setSelectedCust(value);
            fetchUsers(2, selectedApprov, value, selectedPage, '', '');
        }
    };
    function filter_whitebox() {
        const x = document.getElementById("filter_whitebox");
        if (x!.className === "filter_whitebox") {
            x!.className += " filter_whitebox_open";
        } else {
            x!.className = "filter_whitebox";
        }
    }
    function changePage(page: any) {
        if (hasMoreData) {
            setSelectedPage(selectedPage + page);
            fetchUsers(3, selectedApprov, selectedCust, selectedPage + page, '', '');
        }
        else if (!hasMoreData && selectedPage > 1) {
            setSelectedPage(selectedPage + page);
            fetchUsers(3, selectedApprov, selectedCust, selectedPage + page, '', '');
        }
    }
    const resetFilter = async () => {
        window.location.reload();
        setFilters({
            approvedID: "",
            customerID: "",
            start_date: '',
            end_date: ''
        });
        fetchData();
        fetchUsers("", "", "", selectedPage, "", "");
    };
    const [showCalendar, setShowCalendar] = useState(false);
    const ref = useRef(null);
    const [state, setState] = useState<Range[]>([
        {
            startDate: new Date() || null,
            endDate: new Date() || null,
            key: 'selection'
        }
    ]);
    const handleChange = (ranges: RangeKeyDict) => {
        setState([ranges.selection]);
        setShowCalendar(false)
        if (ranges.selection.startDate == ranges.selection.endDate) {
            setFilters((prev) => ({ ...prev, ['start_date']: ranges.selection.startDate }));
        } else {
            setFilters((prev) => ({ ...prev, ['start_date']: ranges.selection.startDate }));
            setFilters((prev) => ({ ...prev, ['end_date']: ranges.selection.endDate }));
        }
        fetchUsers('', selectedApprov, selectedCust, selectedPage, ranges.selection.startDate, ranges.selection.endDate);
    };
    const formattedRange = state[0].startDate! == state[0].endDate! ? format(state[0].startDate!, 'yyyy-MM-dd') : `${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;
    const formatDateYYYYMMDD = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);
        if (isTime) return parsedDate.format('HH:mm A');
        return parsedDate.format('YYYY-MM-DD');
    };
    return (
        <div className='mainbox user_mainbox_new_design my_user_leave_page_mainbox user_black_overlay_main new_user_team_leave_mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={23} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                <div>
                    <LoadingDialog isLoading={isLoading} />
                    {/* -------------------- */}
                    <div className='container'>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="nw_user_inner_mainbox">
                                    <div className="nw_user_inner_heading_tabbox">
                                        <div className="heading25">
                                            My Team Leaves
                                        </div>
                                        <div className="nw_user_inner_tabs nw_user_inner_right_tabs">
                                            <ul>
                                                <li className='filter_relative_li'>
                                                    <div className="nw_user_filter_mainbox width_400">
                                                        <div className="filter_whitebox" id="filter_whitebox">
                                                            <div className="nw_filter_form_group_mainbox">
                                                                <div className="nw_filter_form_group">
                                                                    <select id="customerID" name="customerID" onChange={handleFilterChange}>
                                                                        <option value="">Employee name:</option>
                                                                        {custArray.map((emp, index) => (
                                                                            <option value={emp.customer_id} key={index}>{emp.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="nw_filter_form_group">
                                                                    <select id="approvedID" name="approvedID" onChange={handleFilterChange}>
                                                                        <option value="">Status:</option>
                                                                        {statusArray.map((dep, index) => (
                                                                            <option value={dep.id} key={index}>{dep.approval_type}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="nw_filter_form_group">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={
                                                                            filters.start_date && filters.end_date
                                                                                ? `${format(new Date(filters.start_date), 'MMM d, yyyy')} - ${format(new Date(filters.end_date), 'MMM d, yyyy')}`
                                                                                : filters.start_date
                                                                                    ? `${format(new Date(filters.start_date), 'MMM d, yyyy')}`
                                                                                    : 'Select Date'
                                                                        }
                                                                        placeholder='Select Date'
                                                                        readOnly
                                                                        onClick={() => setShowCalendar(!showCalendar)}
                                                                    />
                                                                    {showCalendar && (
                                                                        <div style={{ position: 'absolute', zIndex: 1000 }}>
                                                                            <DateRange
                                                                                editableDateInputs={true}
                                                                                onChange={handleChange}
                                                                                moveRangeOnFirstSelection={false}
                                                                                ranges={state}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="nw_filter_form_group">
                                                                    <div className="nw_filter_submit_btn">
                                                                        <a onClick={() => resetFilter()}>
                                                                            <img src={staticIconsBaseURL + "/images/user/undo.svg"} alt="Filter icon" className="img-fluid" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="nw_filter_icon" onClick={filter_whitebox}>
                                                            <img src={staticIconsBaseURL + "/images/user/filter-icon.svg"} alt="Filter icon" className="img-fluid" />
                                                        </div>
                                                    </div>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>
                                    <div className="nw_user_inner_content_box" style={{ minHeight: '60vh' }}>
                                        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                                            setShowAlert(false)
                                        }} onCloseClicked={function (): void {
                                            setShowAlert(false)
                                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                                        <div className="my_task_tabbing_content">
                                            {leavearray! && leavearray.length > 0 ?
                                                <div className="row mt-4 mb-5">
                                                    <div className="col-lg-12">
                                                        <div className="row mb-3">
                                                            <div className="col-lg-12">
                                                                <div className="row list_label mb-4">
                                                                    <div className="col-lg-2 text-center new_user_table_head"><div className="label">Employee</div></div>
                                                                    <div className="col-lg-2 text-center new_user_table_head"><div className="label">Leave Type</div></div>
                                                                    <div className="col-lg-1 text-center new_user_table_head"><div className="label">Total Days</div></div>
                                                                    <div className="col-lg-3 text-center new_user_table_head"><div className="label">Date</div></div>
                                                                    {/* <div className="col-lg-1 text-center"><div className="label">To</div></div> */}
                                                                    <div className="col-lg-1 text-center new_user_table_head"><div className="label">Duration</div></div>
                                                                    <div className="col-lg-2 text-center new_user_table_head"><div className="label">Status</div></div>
                                                                    {/* <div className="col-lg-1 text-center new_user_table_head"><div className="label">Action</div></div> */}
                                                                </div>
                                                                {leavearray?.map((applied, index) => (
                                                                    <div className="row list_listbox" key={index}>
                                                                        <div className="col-lg-2 text-center ">{applied.leap_customer.name}</div>
                                                                        <div className="col-lg-2 text-center">{applied.leap_client_leave.leave_name}</div>
                                                                        <div className="col-lg-1 text-center">{applied.total_days}</div>
                                                                        {applied.from_date === applied.to_date ?
                                                                            <div className="col-lg-3 text-center">
                                                                                {moment(applied.from_date).format('DD-MM-YYYY')} </div> :
                                                                            <div className="col-lg-3 text-center">
                                                                                {moment(applied.from_date).format('DD-MM-YYYY')} <span className='from_color_code'>to</span> {moment(applied.to_date).format('DD-MM-YYYY')}</div>
                                                                        }
                                                                        <div className="col-lg-1 text-center">{/^[0-9]+$/.test(applied.duration) ? "--" : applied.duration}</div>
                                                                        {applied.leave_status === 1 ? (
                                                                            <>
                                                                                <div className="user_orange_chip">
                                                                                    <div className="nw_chip_iconbox">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24">
                                                                                            <g fill="#ff6600">
                                                                                                <path fill-rule="evenodd" d="M12 1.846a10.154 10.154 0 1 0 0 20.308 10.154 10.154 0 0 0 0-20.308zM0 12C0 5.372 5.372 0 12 0s12 5.372 12 12-5.372 12-12 12S0 18.628 0 12z" clip-rule="evenodd" data-original="#000000" />
                                                                                                <path fill-rule="evenodd" d="M12 6.77a.924.924 0 0 1 .924.923v4.923a.924.924 0 1 1-1.848 0V7.692A.924.924 0 0 1 12 6.769z" clip-rule="evenodd" data-original="#000000" />
                                                                                                <path d="M13.231 16.308a1.231 1.231 0 1 1-2.462 0 1.231 1.231 0 0 1 2.462 0z" data-original="#000000" />
                                                                                            </g>
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div className="new_chip_contentbox">
                                                                                        {applied.leap_approval_status.approval_type}
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        ) : applied.leave_status === 2 ? (
                                                                            <>
                                                                                <div className="user_green_chip">
                                                                                    <div className="nw_chip_iconbox">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="13" height="13" x="0" y="0" viewBox="0 0 682.667 682.667">
                                                                                            <g>
                                                                                                <defs>
                                                                                                    <clipPath id="b" clipPathUnits="userSpaceOnUse">
                                                                                                        <path d="M0 512h512V0H0Z" fill="#008000" opacity="1" data-original="#000000"></path>
                                                                                                    </clipPath>
                                                                                                </defs>
                                                                                                <mask id="a">
                                                                                                    <rect width="100%" height="100%" fill="#ffffff" opacity="1" data-original="#ffffff"></rect>
                                                                                                </mask>
                                                                                                <g mask="url(#a)">
                                                                                                    <path d="m0 0-134.174-134.174-63.873 63.872" transform="matrix(1.33333 0 0 -1.33333 473.365 251.884)" fill="none" stroke="#008000" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-dasharray="none" stroke-opacity="" data-original="#000000" opacity="1"></path>
                                                                                                    <g clip-path="url(#b)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
                                                                                                        <path d="M0 0c0-130.339-105.661-236-236-236S-472-130.339-472 0s105.661 236 236 236S0 130.339 0 0Z" transform="translate(492 256)" fill="none" stroke="#008000" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-dasharray="none" stroke-opacity="" data-original="#000000" opacity="1"></path>
                                                                                                    </g>
                                                                                                </g>
                                                                                            </g>
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div className="new_chip_contentbox">{applied.leap_approval_status.approval_type}</div>
                                                                                </div>
                                                                            </>
                                                                        ) : applied.leave_status === 3 ? (
                                                                            <>
                                                                                <div className="user_red_chip">
                                                                                    <div className="nw_chip_iconbox">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="13" height="13" x="0" y="0" viewBox="0 0 32 32">
                                                                                            <g transform="matrix(1.1399999999999995,0,0,1.1399999999999995,-2.240141324996948,-2.240000267028801)">
                                                                                                <path d="M21 12.46 17.41 16 21 19.54A1 1 0 0 1 21 21a1 1 0 0 1-.71.29 1 1 0 0 1-.7-.29L16 17.41 12.46 21a1 1 0 0 1-.7.29 1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.41L14.59 16l-3.54-3.54a1 1 0 0 1 1.41-1.41L16 14.59l3.54-3.54A1 1 0 0 1 21 12.46zm4.9 13.44a14 14 0 1 1 0-19.8 14 14 0 0 1 0 19.8zM24.49 7.51a12 12 0 1 0 0 17 12 12 0 0 0 0-17z" data-name="Layer 22" fill="#ff0000" opacity="1" data-original="#000000"></path>
                                                                                            </g>
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div className="new_chip_contentbox">{applied.leap_approval_status.approval_type}</div>
                                                                                </div>
                                                                            </>
                                                                        ) : < div />}
                                                                        <div className="col-lg-1 text-center">{applied.leap_approval_status.approval_type == "Pending" ? <img src={staticIconsBaseURL + "/images/edit.png"} className="img-fluid edit-icon" title='View/Edit' alt="Search Icon" style={{ width: "20px", cursor: "pointer", paddingBottom: "0px", alignItems: "center" }} onClick={() => { setEditLeaveId(applied.id); setShowDialog(true); setisToBeEdited(true) }} /> :
                                                                            <img src={staticIconsBaseURL + "/images/menu.png"} style={{ width: "20px", cursor: "pointer" }} alt="Search Icon" onClick={() => { setEditLeaveId(applied.id); setShowDialog(true); setisToBeEdited(false) }} />
                                                                        }</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {/* here are the page number crowsels */}
                                                        <div className="row mt-4">
                                                            <div className="col-lg-12">
                                                                <div className="my_new_paggination_box">
                                                                    <div className="my_new_paggination_left_box">
                                                                        <BackButton isCancelText={false} />
                                                                    </div>
                                                                    <div className="my_new_paggination_right_box">
                                                                        <div className="page_changer new_page_changer_pagination">
                                                                            {selectedPage > 1 ? <div className="new_pagination_svg" onClick={() => { changePage(-1) }}>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="18" height="18" x="0" y="0" viewBox="0 0 128 128">
                                                                                    <g transform="matrix(-1.4400000000000002,1.763491390772189e-16,-1.763491390772189e-16,-1.4400000000000002,156.16000000000003,156.16015357971196)">
                                                                                        <path d="M44 108a3.988 3.988 0 0 1-2.828-1.172 3.997 3.997 0 0 1 0-5.656L78.344 64 41.172 26.828c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0l40 40a3.997 3.997 0 0 1 0 5.656l-40 40A3.988 3.988 0 0 1 44 108z" fill="#ED2024" opacity="1" data-original="#000000"></path>
                                                                                    </g>
                                                                                </svg>
                                                                            </div> : <></>}
                                                                            <div className="font15Medium">{selectedPage}</div>
                                                                            {hasMoreData && <div className="new_pagination_svg" onClick={() => { changePage(1) }}>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="18" height="18" x="0" y="0" viewBox="0 0 128 128">
                                                                                    <g transform="matrix(1.4400000000000002,0,0,1.4400000000000002,-28.16000000000001,-28.16002769470215)">
                                                                                        <path d="M44 108a3.988 3.988 0 0 1-2.828-1.172 3.997 3.997 0 0 1 0-5.656L78.344 64 41.172 26.828c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0l40 40a3.997 3.997 0 0 1 0 5.656l-40 40A3.988 3.988 0 0 1 44 108z" fill="#ED2024" opacity="1" data-original="#000000"></path>
                                                                                    </g>
                                                                                </svg>
                                                                            </div>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                                    <PageErrorCenterContent content={"No leaves present"} />
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* -------------------- */}
                    <div className="nw_user_offcanvas">
                        <div className={showDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                            {showDialog && <LeaveStatusUpdate id={editLeaveId} selectedShortCutID={false} onClose={(updateData) => { setShowDialog(false), updateData && fetchUsers(3, "", "", selectedPage, '', '') }} isToBeEddited={isToBeEdited} />}
                        </div>
                        <div className="overlay_offcanvas"></div>

                    </div>
                </div>
            } />
            {/* </div> */}
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default EmployeeLeaveList;

async function getCustomer(managerID: string) {

    let query = supabase
        .from('leap_customer')
        .select()
        // .eq("branch_id", branchTypeID)
        .eq("manager_id", managerID)

    const { data, error } = await query;
    if (error) {
        return [];
    } else {
        return data;
    }
}
async function getStatus() {

    let query = supabase
        .from('leap_approval_status')
        .select()
        .neq('is_deleted', true);
    const { data, error } = await query;
    if (error) {
        return [];
    } else {
        return data;
    }
}