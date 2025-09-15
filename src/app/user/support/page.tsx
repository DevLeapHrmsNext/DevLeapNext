
'use client'
import React, { useRef } from 'react'
import LeapHeader from '@/app/components/header'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import AssetUpdate from '@/app/components/dialog_updateAsset'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import BackButton from '@/app/components/BackButton'
import { pageURL_addAsset, pageURL_assetTypeList, pageURL_assignAsset, pageURL_userSupportForm } from '@/app/pro_utils/stringRoutes'
import DialogAssignAsset from '@/app/components/dialog_assign_asset'
import { SupportList } from '@/app/models/supportModel'
import LeftPannel from '@/app/components/leftPannel'
import { DateRange, RangeKeyDict } from 'react-date-range';
import { Range } from 'react-date-range';
import { format } from 'date-fns'
import moment from 'moment'
import UserSupport from '@/app/components/dialog_userSupport'
import PageErrorCenterContent from '@/app/components/pageError'
import ShowAlertMessage from '@/app/components/alert'
import { ALERTMSG_addAssetSuccess, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'

interface filterType {
    active_status: any,
    start_date: any,
    end_date: any
    priority_level: any
}

const Support = () => {
    const { contextClientID, contextCustomerID } = useGlobalContext();
    const [supportArray, setSupport] = useState<SupportList[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [statusArray, setStatus] = useState<SupportStatus[]>([]);
    const [priorityArray, setPriority] = useState<SupportPriority[]>([]);
    const [editSupportId, setEditSupportId] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [selectedPage, setSelectedPage] = useState(1);
    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedPriority, setSelectedPriority] = useState("");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [filters, setFilters] = useState<filterType>({
        active_status: "", start_date: '', end_date: '',
        priority_level: ""
    });
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        fetchFilter();
        fetchData("", "", "", selectedPage, "", "");
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
    const fetchFilter = async () => {
        const approval = await getStatus();
        setStatus(approval);
        const priority = await getPriority();
        setPriority(priority);
    }

    const fetchData = async (filterID: any, statusValue: any, priorityValue: any, pageNumber: number, startDate: any, endDate: any) => {
        setLoading(true);
        try {
            let formData = {
                "client_id": contextClientID,
                "customer_id": contextCustomerID,
                "active_status": statusValue,
                "priority_level": priorityValue,
                start_date: dateRange.start,
                end_date: dateRange.end,
            }
            if (filterID == 1) {
                let activeStatus = filters.active_status.length > 0 && filters.active_status == statusValue ? filters.active_status : statusValue;
                formData = {
                    ...formData,
                    "active_status": activeStatus
                }
            }
            if (filterID == 2) {
                let priorityLevel = filters.priority_level.length > 0 && filters.priority_level == priorityValue ? filters.priority_level : priorityValue;
                formData = {
                    ...formData,
                    "priority_level": priorityLevel
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
            if (filterID == 1 || filters.active_status.length > 0) {
                let activeStatus = filters.active_status == statusValue ? filters.active_status : statusValue;
                formData = {
                    ...formData,
                    "active_status": activeStatus
                }
            }
            if (filterID == 2 || filters.priority_level.length > 0) {
                let priorityLevel = filters.priority_level == priorityValue ? filters.priority_level : priorityValue;
                formData = {
                    ...formData,
                    "priority_level": priorityLevel
                }
            }
            const res = await fetch(`/api/users/support/supportList?page=${pageNumber}&limit=${10}`, {
                method: "POST",
                body: JSON.stringify(
                    formData
                ),
            });
            const response = await res.json();
            const supportData = response.data;

            if (response.status == 1 && supportData.length > 0) {
                setLoading(false);
                setSupport(supportData);
                if (supportData.length < 10) {
                    setHasMoreData(false);
                } else {
                    setHasMoreData(true);
                }
            } else if (response.status == 1 && supportData.length == 0) {
                setLoading(false);
                setSupport([]);
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
            // console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent("ALERTMSG_exceptionString");
            setAlertForSuccess(2)
        }
    }
    function filter_whitebox() {
        const x = document.getElementById("filter_whitebox");
        if (x!.className === "filter_whitebox") {
            x!.className += " filter_whitebox_open";
        } else {
            x!.className = "filter_whitebox";
        }
    }
    const resetFilter = async () => {
        window.location.reload();
        setFilters({
            active_status: "", start_date: '', end_date: '', priority_level: ""
        });
        fetchData("", "", "", selectedPage, "", "");
    };
    function changePage(page: any) {
        if (hasMoreData) {
            setSelectedPage(selectedPage + page);
            fetchData(3, selectedStatus, selectedPriority, selectedPage + page, '', '');
        }
        else if (!hasMoreData && selectedPage > 1) {
            setSelectedPage(selectedPage + page);
            fetchData(3, selectedStatus, selectedPriority, selectedPage + page, '', '');
        }
    }
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        // console.log("this is the name ", name);
        // console.log("this is the value", value);

        if (name == "active_status") {
            setFilters((prev) => ({ ...prev, ['active_status']: value }));
            fetchData(1, value, selectedPriority, selectedPage, '', '');
            setSelectedStatus(value)
        }
        if (name == "priority_level") {
            setFilters((prev) => ({ ...prev, ['priority_level']: value }));
            fetchData(2, selectedStatus, value, selectedPage, '', '');
            setSelectedPriority(value)
        }
    };
    const [showCalendar, setShowCalendar] = useState(false);

    const [state, setState] = useState<Range[]>([
        {
            startDate: new Date() || null,
            endDate: new Date() || null,
            key: 'selection'
        }
    ]);
    const handleChange = (ranges: RangeKeyDict) => {
         const start = ranges.selection.startDate;
        const end = ranges.selection.endDate;

        setState([ranges.selection]);
        setShowCalendar(false);

        if (start && end) {
            setFilters((prev) => ({
                ...prev,
                start_date: start,
                end_date: end,
            }));
        fetchData('', selectedStatus, selectedPriority, selectedPage, start, end);
        }
        fetchData('', selectedStatus, selectedPriority, selectedPage, ranges.selection.startDate, ranges.selection.endDate);
    };
    const formattedRange = state[0].startDate! == state[0].endDate! ? format(state[0].startDate!, 'yyyy-MM-dd') : `${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;
    const formatDateYYYYMMDD = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);
        if (isTime) return parsedDate.format('HH:mm A');
        return parsedDate.format('YYYY-MM-DD');
    };
    return (
        <div className='mainbox user_mainbox_new_design new_user_support_mainbox user_black_overlay_main'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={27} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                //  supportArray! && supportArray.length > 0  ?              
                <div>
                    <LoadingDialog isLoading={isLoading} />

                    {/* ---------------------------------------- */}
                    <div className='container'>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="nw_user_inner_mainbox">
                                    <div className="nw_user_inner_heading_tabbox">
                                        <div className="heading25">
                                            Help
                                        </div>
                                        <div className="nw_user_inner_tabs nw_user_inner_right_tabs">
                                            <ul>
                                                <li>
                                                    <div className="nw_user_filter_mainbox width_450">
                                                        <div className="filter_whitebox" id="filter_whitebox">
                                                            <div className="nw_filter_form_group_mainbox">
                                                                <div className="nw_filter_form_group">
                                                                    <select id="active_status" name="active_status" className="form-select" onChange={handleFilterChange}>
                                                                        <option value="">Status</option>
                                                                        {statusArray.map((dep, index) => (
                                                                            <option value={dep.id} key={index}>{dep.status}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="nw_filter_form_group">
                                                                    <select id="priority_level" name="priority_level" className="form-select" onChange={handleFilterChange}>
                                                                        <option value="">Priority Level:</option>
                                                                        {priorityArray.map((dep, index) => (
                                                                            <option value={dep.id} key={index}>{dep.priority_name}</option>
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
                                                <li>
                                                    <a href={pageURL_userSupportForm}>
                                                        <div className="nw_user_tab_icon">
                                                            <svg width="20" height="20" x="0" y="0" viewBox="0 0 32 32">
                                                                <g>
                                                                    <path d="M31 13.5v5c0 1.379-1.121 2.5-2.5 2.5h-.68c-.957 5.666-5.885 10-11.82 10a1 1 0 1 1 0-2c5.514 0 10-4.486 10-10v-6c0-5.514-4.486-10-10-10S6 7.486 6 13v7a1 1 0 0 1-1 1H3.5A2.502 2.502 0 0 1 1 18.5v-5C1 12.121 2.121 11 3.5 11h.68C5.138 5.334 10.066 1 16 1s10.863 4.334 11.82 10h.68c1.379 0 2.5 1.121 2.5 2.5zM16 5c-4.411 0-8 3.589-8 8v5c0 4.411 3.589 8 8 8s8-3.589 8-8v-5c0-4.411-3.589-8-8-8z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div className="nw_user_tab_name">
                                                            Add
                                                        </div>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="nw_user_inner_content_box" style={{ minHeight: '60vh' }}>
                                        {/*  />} */}
                                        <div className={`${loadingCursor ? "cursorLoading" : ""}`}>
                                            {supportArray! && supportArray.length > 0 ?
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="row mb-5">
                                                            <div className="col-lg-12">
                                                                <div className="row list_label mb-4">
                                                                    <div className="col-lg-2 text-center new_user_table_head"><div className="label">Ticket ID</div></div>
                                                                    <div className="col-lg-2 text-center new_user_table_head"><div className="label">Request Type</div></div>
                                                                    <div className="col-lg-1 text-center new_user_table_head"><div className="label">Raised on</div></div>
                                                                    <div className="col-lg-2 text-center new_user_table_head"><div className="label">Priority level</div></div>
                                                                    <div className="col-lg-2 text-center new_user_table_head"><div className="label">Description</div></div>
                                                                    <div className="col-lg-2 text-center new_user_table_head"><div className="label">Status</div></div>
                                                                    <div className="col-lg-1 text-center new_user_table_head"><div className="label">Action</div></div>
                                                                </div>
                                                                {supportArray.map((id, index) => (
                                                                    <div className="row list_listbox" key={index}>
                                                                        <div className="col-lg-2 text-center">{id.ticket_id || "--"}</div>
                                                                        <div className="col-lg-2 text-center">{id.leap_request_master.type_name}</div>
                                                                        <div className="col-lg-1 text-center">{moment(id.raised_on).format('DD-MM-YYYY')}</div>
                                                                        {id.priority_level === 1 ? (
                                                                            <><div className="col-lg-2 text-center" >
                                                                                <div className="user_red_chip user_chip_priority">
                                                                                    <div className="new_chip_contentbox">{id.leap_request_priority.priority_name}</div>
                                                                                </div>
                                                                            </div></>
                                                                        ) : id.priority_level === 2 ? (
                                                                            <><div className="col-lg-2 text-center" >
                                                                                <div className="user_orange_chip user_chip_priority">
                                                                                    <div className="new_chip_contentbox">{id.leap_request_priority.priority_name}</div>
                                                                                </div>
                                                                            </div>
                                                                            </>
                                                                        ) : id.priority_level === 3 ? (
                                                                            <><div className="col-lg-2 text-center" >
                                                                                <div className="user_green_chip user_chip_priority">
                                                                                    <div className="new_chip_contentbox">{id.leap_request_priority.priority_name}</div>
                                                                                </div>
                                                                            </div>
                                                                            </>
                                                                        ) : < div />
                                                                        }
                                                                        <div className="col-lg-2 text-center">
                                                                            <div className="restrict_two_lines">
                                                                                {id.description}
                                                                            </div>
                                                                        </div>
                                                                        {id.active_status === 1 ? (
                                                                            <><div className="col-lg-2 text-center ">
                                                                                <div className="user_orange_chip">
                                                                                    <div className="nw_chip_iconbox">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24">
                                                                                            <g fill="#FF6600">
                                                                                                <path fill-rule="evenodd" d="M12 1.846a10.154 10.154 0 1 0 0 20.308 10.154 10.154 0 0 0 0-20.308zM0 12C0 5.372 5.372 0 12 0s12 5.372 12 12-5.372 12-12 12S0 18.628 0 12z" clip-rule="evenodd" data-original="#000000" />
                                                                                                <path fill-rule="evenodd" d="M12 6.77a.924.924 0 0 1 .924.923v4.923a.924.924 0 1 1-1.848 0V7.692A.924.924 0 0 1 12 6.769z" clip-rule="evenodd" data-original="#000000" />
                                                                                                <path d="M13.231 16.308a1.231 1.231 0 1 1-2.462 0 1.231 1.231 0 0 1 2.462 0z" data-original="#000000" />
                                                                                            </g>
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div className="new_chip_contentbox">
                                                                                        {id.leap_request_status.status}
                                                                                    </div>
                                                                                </div>
                                                                            </div></>
                                                                        ) : id.active_status === 3 ? (
                                                                            <><div className="col-lg-2 text-center " >
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
                                                                                    <div className="new_chip_contentbox">{id.leap_request_status.status}</div>
                                                                                </div>
                                                                            </div></>
                                                                        ) : id.active_status === 2 ? (
                                                                            <><div className="col-lg-2 text-center ">
                                                                                <div className="user_blue_chip">
                                                                                    <div className="nw_chip_iconbox">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="13" height="13" x="0" y="0" viewBox="0 0 32 32">
                                                                                            <g transform="matrix(1.1399999999999995,0,0,1.1399999999999995,-2.240141324996948,-2.240000267028801)">
                                                                                                <path d="M21 12.46 17.41 16 21 19.54A1 1 0 0 1 21 21a1 1 0 0 1-.71.29 1 1 0 0 1-.7-.29L16 17.41 12.46 21a1 1 0 0 1-.7.29 1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.41L14.59 16l-3.54-3.54a1 1 0 0 1 1.41-1.41L16 14.59l3.54-3.54A1 1 0 0 1 21 12.46zm4.9 13.44a14 14 0 1 1 0-19.8 14 14 0 0 1 0 19.8zM24.49 7.51a12 12 0 1 0 0 17 12 12 0 0 0 0-17z" data-name="Layer 22" fill="#1976d2" opacity="1" data-original="#000000"></path>
                                                                                            </g>
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div className="new_chip_contentbox">{id.leap_request_status.status}</div>
                                                                                </div>
                                                                            </div></>
                                                                        ) : id.active_status === 4 ? (
                                                                            <><div className="col-lg-2 text-center ">
                                                                                <div className="user_red_chip">
                                                                                    <div className="nw_chip_iconbox">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="13" height="13" x="0" y="0" viewBox="0 0 24 24">
                                                                                            <g>
                                                                                                <path d="M20.496 11.158a8.004 8.004 0 1 1-2.692-5.18l-1.415.007a1 1 0 0 0 .005 2h.006l3.606-.02A1 1 0 0 0 21 6.962l-.02-3.605a.966.966 0 0 0-1.006-.995 1 1 0 0 0-.994 1.005l.005.997a9.99 9.99 0 1 0 3.499 6.586 1 1 0 1 0-1.988.209z" data-name="Layer 79" fill="#ff0000" opacity="1" data-original="#000000"></path>
                                                                                            </g></svg>
                                                                                    </div>
                                                                                    <div className="new_chip_contentbox">{id.leap_request_status.status}</div>

                                                                                </div>
                                                                            </div></>
                                                                        ) : < div />}

                                                                        <div className="col-lg-1 text-center">
                                                                            <img src={staticIconsBaseURL + "/images/menu.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", cursor: 'pointer' }}
                                                                                onClick={() => {
                                                                                    setEditSupportId(id.id);
                                                                                    setShowDialog(true)
                                                                                }} />
                                                                        </div>
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
                                                                    <div className='my_new_paggination_right_box'>
                                                                        <div className="page_changer new_page_changer_pagination">
                                                                            {selectedPage > 1 ? <div className="new_pagination_svg" onClick={() => { changePage(-1) }}>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="18" height="18" x="0" y="0" viewBox="0 0 128 128">
                                                                                    <g transform="matrix(-1.4400000000000002,1.763491390772189e-16,-1.763491390772189e-16,-1.4400000000000002,156.16000000000003,156.16015357971196)">
                                                                                        <path d="M44 108a3.988 3.988 0 0 1-2.828-1.172 3.997 3.997 0 0 1 0-5.656L78.344 64 41.172 26.828c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0l40 40a3.997 3.997 0 0 1 0 5.656l-40 40A3.988 3.988 0 0 1 44 108z" fill="#ed2024" opacity="1" data-original="#000000"></path>
                                                                                    </g>
                                                                                </svg>
                                                                            </div> : <></>}
                                                                            <div className="font15Medium">{selectedPage}</div>
                                                                            {hasMoreData && <div className="new_pagination_svg" onClick={() => { changePage(1) }}>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="18" height="18" x="0" y="0" viewBox="0 0 128 128">
                                                                                    <g transform="matrix(1.4400000000000002,0,0,1.4400000000000002,-28.16000000000001,-28.16002769470215)">
                                                                                        <path d="M44 108a3.988 3.988 0 0 1-2.828-1.172 3.997 3.997 0 0 1 0-5.656L78.344 64 41.172 26.828c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0l40 40a3.997 3.997 0 0 1 0 5.656l-40 40A3.988 3.988 0 0 1 44 108z" fill="#ed2024" opacity="1" data-original="#000000"></path>
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
                                                    <PageErrorCenterContent content={"No support list"} />
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="nw_user_offcanvas">
                        <div className={showDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                            {showDialog && <UserSupport id={editSupportId} selectedShortCutID={false} onClose={(updateData) => { setShowDialog(false), updateData && fetchData(3, "", "", selectedPage, '', '') }} />}
                        </div>
                        <div className="overlay_offcanvas"></div>
                    </div>
                    {/* ---------------------------------------- */}
                </div>
            } />
            {/* </div> */}
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default Support;

async function getStatus() {

    let query = supabase
        .from('leap_request_status')
        .select()
        .neq('is_deleted', true);
    const { data, error } = await query;
    if (error) {
        console.log(error);
        return [];
    } else {
        return data;
    }
}

async function getPriority() {

    let query = supabase
        .from('leap_request_priority')
        .select()
        .neq('is_deleted', true);
    const { data, error } = await query;
    if (error) {
        console.log(error);
        return [];
    } else {
        return data;
    }
}