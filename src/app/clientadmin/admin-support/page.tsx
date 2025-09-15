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
import DialogUpdateSupportRequest from '@/app/components/dialog_UpdateSupport'
import { ALERTMSG_exceptionString } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'

interface filterType {
    active_status: any,
    start_date: any,
    end_date: any
    priority_level: any
}

const Support = () => {
    const { contextClientID, contextCustomerID, contextRoleID } = useGlobalContext();

    const [supportArray, setSupport] = useState<SupportList[]>([]);
    const [showRequestEditDialog, setShowRequestEditDialog] = useState(false);
    const [editRequestID, setEditRequestID] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [detailID, setDetailID] = useState(-1);
    const [statusArray, setStatus] = useState<SupportStatus[]>([]);
    const [priorityArray, setPriority] = useState<SupportPriority[]>([]);

    const [filters, setFilters] = useState<filterType>({
        active_status: "", start_date: '', end_date: '',
        priority_level: ""
    });
    const [scrollPosition, setScrollPosition] = useState(0);

    const [showAlert,setShowAlert]=useState(false);
            const [alertForSuccess,setAlertForSuccess]=useState(0);
            const [alertTitle,setAlertTitle]=useState('');
            const [alertStartContent,setAlertStartContent]=useState('');
            const [alertMidContent,setAlertMidContent]=useState('');
            const [alertEndContent,setAlertEndContent]=useState('');
            const [alertValue1,setAlertValue1]=useState('');
            const [alertvalue2,setAlertValue2]=useState('');

    useEffect(() => {
        fetchData("", "", "", "");
        fetchFilter();
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
    }, [])
    const fetchFilter = async () => {

        const approval = await getStatus();
        setStatus(approval);

        const priority = await getPriority();
        setPriority(priority);
    }
    const formData = new FormData();

    const fetchData = async (filterID: any, value: any, startDate: any, endDate: any) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);


            if (filterID == 1) formData.append("active_status", filters.active_status.length > 0 && filters.active_status == value ? filters.active_status : value);
            if (filterID == 2) formData.append("priority_level", filters.priority_level.length > 0 && filters.priority_level == value ? filters.priority_level : value);
            if(filters.active_status.length > 0){
                formData.append("active_status",filters.active_status)
            }
            if(filters.priority_level.length > 0){
                formData.append("priority_level",filters.priority_level)
            }
            if (startDate || filters.start_date) 
                {formData.append("start_date", formatDateYYYYMMDD(startDate || filters.start_date));}
            else{
                formData.append("start_date", formatDateYYYYMMDD(new Date()));
            };
            if (endDate || filters.end_date) {
                formData.append("end_date", formatDateYYYYMMDD(endDate || filters.end_date));
            }

            const res = await fetch("/api/clientAdmin/supportList", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            console.log(response);

            if (response.status == 1) {
                const supportData = response.data;
                setSupport(supportData)
                setLoading(false);
            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error");
                setAlertStartContent("Failed To get support data or the or no data is available.");
                setAlertForSuccess(2);
            }
        } catch (error) {
            setLoading(false);
            setShowAlert(true);
                setAlertTitle("Exception");
                setAlertStartContent(ALERTMSG_exceptionString);
                setAlertForSuccess(2);
            console.error("Error fetching user data:", error);
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
        fetchData("", "", "", "");
    };
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        // const updatedFilters = { ...filters, [name]: value };
        if (name == "active_status") {
            setFilters((prev) => ({ ...prev, ['active_status']: value }));
            fetchData(1, value, '', '');
        }
        if (name == "priority_level") {
            setFilters((prev) => ({ ...prev, ['priority_level']: value }));
            fetchData(2, value, '', '');
        }

        // fetchUsers(0,0);
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
        fetchData('', '', ranges.selection.startDate, ranges.selection.endDate);
    };
    const formattedRange = state[0].startDate! == state[0].endDate! ? format(state[0].startDate!, 'yyyy-MM-dd') : `${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;
    const formatDateYYYYMMDD = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);

        if (isTime) return parsedDate.format('HH:mm A');

        return parsedDate.format('YYYY-MM-DD');
    };
    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={27} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                //  supportArray! && supportArray.length > 0  ?              
                <div>
                    <LoadingDialog isLoading={isLoading} />
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length>0?alertMidContent: ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                                                               fetchData("","","","");
                                                                setShowAlert(false)
                                                            } } onCloseClicked={function (): void {
                                                                setShowAlert(false)
                                                            } } showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    <div className='container'>
                        <div style={{ top: "0", zIndex: "50", backgroundColor: "#ebeff2", padding: "0 0 10px 0" }}>
                            <div className="row heading25 mb-3 pt-2" style={{ alignItems: "center" }}>
                                <div className="col-lg-6">
                                    Help<span> Requests</span>
                                </div>
                                <div className="col-lg-6" style={{ textAlign: "right" }}>
                                    {contextRoleID != "2" && <a href={pageURL_userSupportForm} className="red_button red_button2">+</a>}&nbsp;
                                    <div className="filtermenu red_button" onClick={filter_whitebox}>Filter</div>&nbsp;
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="filter_whitebox" id="filter_whitebox">
                                            <div className="row">
                                                <div className="col-lg-2">
                                                    <div className="form_box">
                                                        <select id="active_status" name="active_status" onChange={handleFilterChange}>
                                                            <option value="">Status:</option>
                                                            {statusArray.map((dep, index) => (
                                                                <option value={dep.id} key={dep.id}>{dep.status}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-2">
                                                    <div className="form_box">
                                                        <select id="priority_level" name="priority_level" onChange={handleFilterChange}>
                                                            <option value="">Priority Level:</option>
                                                            {priorityArray.map((dep, index) => (
                                                                <option value={dep.id} key={dep.id}>{dep.priority_name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-3">
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
                                                                onChange={handleChange}
                                                                moveRangeOnFirstSelection={false}
                                                                ranges={state}
                                                                maxDate={new Date()}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-lg-2">
                                                    <div className="form_box">
                                                        <a className="red_button filter_submit_btn " onClick={() => resetFilter()}>Reset</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row mb-5">
                                    <div className="col-lg-12">
                                        <div className="grey_box" style={{ backgroundColor: "#fff" }} >
                                            <div className="row list_label mb-4">
                                                <div className="col-lg-2 text-center"><div className="label">Name</div></div>
                                                <div className="col-lg-2 text-center"><div className="label">Category</div></div>
                                                <div className="col-lg-2 text-center"><div className="label">Request Type</div></div>
                                                <div className="col-lg-2 text-center"><div className="label">Date</div></div>
                                                <div className="col-lg-2 text-center"><div className="label">Priority level</div></div>
                                                <div className="col-lg-1 text-center"><div className="label">Status</div></div>
                                                <div className="col-lg-1 text-center"><div className="label">Action</div></div>
                                                {/* <div className="col-lg-2 text-center"><div className="label">Description</div></div> */}

                                            </div>
                                            {supportArray.length > 0 ? (
                                                supportArray.map((data) => (
                                                    <div className="row list_listbox" key={data.id}>
                                                        <div className="col-lg-2 text-center">{data.leap_customer.name}</div>
                                                        <div className="col-lg-2 text-center">{data.leap_request_master.category}</div>
                                                        <div className="col-lg-2 text-center">{data.leap_request_master.type_name}</div>
                                                        <div className="col-lg-2 text-center">{data.raised_on}</div>
                                                        <div className="col-lg-2 text-center">{data.leap_request_priority.priority_name}</div>
                                                        {data.active_status === 1 ? (
                                                            <><div className="col-lg-1 text-center"><div className='pending_status'>{data.leap_request_status.status}</div></div></>
                                                        ) : data.active_status === 2 ? (
                                                                <><div className="col-lg-1 text-center"><div className='inprogress_status'>{data.leap_request_status.status}</div></div></>
                                                        ) : data.active_status === 3 ? (
                                                            <><div className="col-lg-1 text-center"><div className='resolved_status'>{data.leap_request_status.status}</div></div></>
                                                        ) : 
                                                            <><div className="col-lg-1 text-center"><div className='reopen_status'>{data.leap_request_status.status}</div></div></>
                                                        }
                                                        {/* <div className="col-lg-2 text-center">{data.description}</div> */}

                                                        <div className="col-lg-1 text-center">
                                                            <img src="/images/edit.png" className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", paddingBottom: "5px", alignItems: "center", cursor:"pointer" }}
                                                                onClick={() => {
                                                                    setEditRequestID(data.id);
                                                                    setShowRequestEditDialog(true)
                                                                }} />
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center">No Request Raised</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={showRequestEditDialog ? "rightpoup rightpoupopen rightpoup2" : "rightpoup"}>
                                                    {showRequestEditDialog &&  <DialogUpdateSupportRequest onClose={function (): void {
                            setShowRequestEditDialog(false);
                            fetchData("",filters.active_status,filters.start_date,filters.end_date);
                        } } supportRequestID={editRequestID} />}
                                                </div>
                </div>
                
                //   : <LoadingDialog isLoading={true} />
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
        ;
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
        ;
    const { data, error } = await query;
    if (error) {
        console.log(error);
        return [];
    } else {
        return data;
    }
}