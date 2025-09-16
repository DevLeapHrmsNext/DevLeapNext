'use client'
import React, { useRef } from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { AppliedLeave } from '@/app/models/leaveModel'
import { CustomerProfile } from '@/app/models/employeeDetailsModel'
import { pageURL_assignLeaveForm, leftMenuLeavePageNumbers } from '@/app/pro_utils/stringRoutes'

import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import LeaveStatusUpdate from '@/app/components/dialog_approvalStatus'
import Select from "react-select";
import { DateRange, RangeKeyDict } from 'react-date-range';
import { Range } from 'react-date-range';
import { format } from 'date-fns'
import moment from 'moment'
import { ALERTMSG_exceptionString, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'




interface filterApply {
    approvedID: any,
    customerID: any,
    start_date:any,
    end_date:any
}

const EmployeeLeaveList = () => {
    const [leavearray, setLeave] = useState<AppliedLeave[]>([]);
    const [filters, setFilters] = useState<filterApply>({ approvedID: "", customerID: "",start_date:'',end_date:'' })
    const [custArray, setCustomer] = useState<CustomerProfile[]>([]);
    const [statusArray, setStatus] = useState<StatusModel[]>([]);
    const [editLeaveId, setEditLeaveId] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isToBeEdited, setisToBeEdited] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const { contextClientID, contaxtBranchID, contextUserName, contextCustomerID, contextRoleID,
        contextProfileImage, contextEmployeeID, contextCompanyName, contextLogoURL,
        dashboard_notify_activity_related_id,isAdmin, dashboard_notify_cust_id, setGlobalState } = useGlobalContext();
    const [employeeName, setEmployeeName] = useState([{ value: '', label: '' }]);

    const [scrollPosition, setScrollPosition] = useState(0);
    const [selectedPage, setSelectedPage] = useState(1);
    const [detailAppliedID, setDetailAppliedID] = useState(-1);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');
    useEffect(() => {


        fetchData();
        if (dashboard_notify_cust_id) {
            setFilters((prev) => ({ ...prev, ['customerID']: dashboard_notify_cust_id }));
            setDetailAppliedID(parseInt(dashboard_notify_activity_related_id))
            fetchUsers(2, dashboard_notify_cust_id, selectedPage,'','');
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
                dashboard_notify_cust_id: '',
                dashboard_notify_activity_related_id: '',
                selectedClientCustomerID: '',
                isAdmin: isAdmin,
                contextPARAM8: '',

            });
        } else {
            fetchUsers("", "", selectedPage,'','');
        }
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
    const fetchData = async () => {
        const customerName = await getCustomer(contextClientID);
        setCustomer(customerName);

        let emp: any[] = []
        emp.push({
            value: 0,
            label: "Select",
        })
        for (let i = 0; i < customerName.length; i++) {
            emp.push({
                value: customerName[i].customer_id,
                label: customerName[i].emp_id + "  " + customerName[i].name,
            })
        }
        setEmployeeName(emp);

        const approval = await getStatus();
        setStatus(approval);



    }
    const fetchUsers = async (filterID: any, value: any, pageNumber: number,startDate:any,endDate:any) => {
        setLoading(true);
        try {
            // const formData = new FormData();
            // formData.append("client_id", contextClientID);
            // formData.append("branch_id", contaxtBranchID);
            // if (filterID == 1 || filters.approvedID.length > 0) formData.append("leave_status", filters.approvedID.length > 0 && filters.approvedID == value  ? filters.approvedID : value);
            // if (filterID == 2 || filters.customerID.length >0) formData.append("customer_id", filters.customerID.length > 0 && filters.customerID == value ? filters.customerID : value);
            // if(startDate || filters.start_date) formData.append("start_date", formatDateYYYYMMDD(startDate|| filters.start_date));
            // if(endDate || filters.end_date) formData.append("end_date", formatDateYYYYMMDD(endDate || filters.end_date));
            // if (filterID == 3) {
            //     if (filters.approvedID) {
            //         formData.append("leave_status", filters.approvedID);
            //     }
            //     if (filters.customerID) {
            //         formData.append("customer_id", filters.customerID);
            //     }
            // }

            const payload: { [key: string]: any } = {
  client_id: contextClientID,
  branch_id: contaxtBranchID,
};

// Dynamic conditions
if (filterID == 1 || filters.approvedID.length > 0) {
  payload.leave_status = (filters.approvedID.length > 0 && filters.approvedID == value) ? filters.approvedID : value;
}

if (filterID == 2 || filters.customerID.length > 0) {
  payload.customer_id = (filters.customerID.length > 0 && filters.customerID == value) ? filters.customerID : value;
}

if (startDate || filters.start_date) {
  payload.start_date = formatDateYYYYMMDD(startDate || filters.start_date);
}

if (endDate || filters.end_date) {
  payload.end_date = formatDateYYYYMMDD(endDate || filters.end_date);
}

if (filterID == 3) {
  if (filters.approvedID) {
    payload.leave_status = filters.approvedID;
  }
  if (filters.customerID) {
    payload.customer_id = filters.customerID;
  }
}


            

            const res = await fetch(`/api/users/getAppliedLeaves?page=${pageNumber}&limit=${10}`, {
                method: "POST",
                body: JSON.stringify(payload),
            });
            const response = await res.json();
            console.log(response);

            const leaveListData = response.leavedata;
            if (response.status == 1 && leaveListData.length > 0) {
                setLoading(false);
                setLeave(leaveListData);
                if(leaveListData.length<10){
                    setHasMoreData(false);
                   
                }else{
                    setHasMoreData(true);
                }
                
            }else if(response.status == 1 && leaveListData.length ==0){
                setLoading(false);
                setLeave([]);
                setHasMoreData(false);
            } else if (response.status == 0 ) {
                setLoading(false);
                setSelectedPage(response.page);
                setHasMoreData(false)
                
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("No Data Available");
                setAlertForSuccess(2)
                
            }

        } catch (error) {
            setLoading(false);
            
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
            console.error("Error fetching user data:", error);
        }
    }

    const handleEmpSelectChange = async (values: any) => {
        setFilters((prev) => ({ ...prev, ['customerID']: values.value }))
        fetchUsers(2, values.value, selectedPage,'','');
    };
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log("this is the name ", name);
        console.log("this is the value", value);

        // const updatedFilters = { ...filters, [name]: value };
        if (name == "approvedID") {
            setFilters((prev) => ({ ...prev, ['approvedID']: value }));
            fetchUsers(1, value, selectedPage,'','');
        }

        // fetchUsers(0,0);
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
            fetchUsers(3, "", selectedPage + page,'','');
        }
        else if(!hasMoreData && selectedPage>1){
            setSelectedPage(selectedPage + page);
            fetchUsers(3, "", selectedPage + page,'','');
        }
    }

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
        console.log(ranges);
        
        setState([ranges.selection]);
        setShowCalendar(false)
        if(ranges.selection.startDate==ranges.selection.endDate){
            setFilters((prev) => ({ ...prev, ['start_date']: ranges.selection.startDate }));
        }else{
            setFilters((prev) => ({ ...prev, ['start_date']: ranges.selection.startDate }));
            setFilters((prev) => ({ ...prev, ['end_date']: ranges.selection.endDate }));

        }
        fetchUsers(3, '', selectedPage,ranges.selection.startDate,ranges.selection.endDate);
    };
    const formattedRange = state[0].startDate! == state[0].endDate!?format(state[0].startDate!, 'yyyy-MM-dd'):`${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;
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
            <LeftPannel menuIndex={leftMenuLeavePageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                

                    <div>
                        <div className='container'>
                        <LoadingDialog isLoading={isLoading} />

                        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)
                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                            <div className='inner_heading_sticky'>
                                <div className="row heading25 pt-2" style={{ alignItems: "center" }}>
                                    <div className="col-lg-6">
                                        Employee <span>Leave</span>
                                    </div>
                                    <div className="col-lg-6 mt-1" style={{ textAlign: "right" }}>
                                        <div className="filtermenu red_button" onClick={filter_whitebox}>Filter</div>&nbsp;
                                        <a href={pageURL_assignLeaveForm} className="red_button">Assign Leave</a>&nbsp;
                                        {/* <a href={pageURL_leaveTypeListing} className="red_button">Company Leaves</a> */}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="filter_whitebox" id="filter_whitebox">
                                            <div className="row">
                                                <div className="col-lg-3">
                                                    <div className="form_box mb-1 mt-1">
                                                        {/* <select id="customerID" name="customerID" onChange={handleFilterChange}>
                                                            <option value="">Employee name:</option>
                                                            {custArray.map((emp, index) => (
                                                                <option value={emp.customer_id} key={emp.customer_id}>{emp.name}</option>
                                                            ))}
                                                        </select> */}

                                                        <Select
                                                            className="custom-select"
                                                            classNamePrefix="custom"
                                                            options={employeeName}
                                                            onChange={(selectedOption) =>
                                                                handleEmpSelectChange(selectedOption)
                                                            }
                                                            placeholder="Search Employee"
                                                            isSearchable={true}


                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3">
                                                    <div className="form_box mb-1 mt-1">
                                                        <select id="approvedID" name="approvedID" onChange={handleFilterChange}>
                                                            <option value="">Status:</option>
                                                            {statusArray.map((dep, index) => (
                                                                <option value={dep.id} key={dep.id}>{dep.approval_type}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-3">
                                                    <input
                                                        type="text"
                                                        className="form-control calender_icon"
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
                                                            />
                                                        </div>
                                                    )}

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {leavearray! && leavearray.length > 0 ? 
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row mb-5">
                                        <div className="col-lg-12">
                                            <div className="grey_box" style={{ backgroundColor: "#fff" }} >
                                                <div className="row align-items-center list_label mb-4">
                                                    <div className="col-lg-3 text-center"><div className="label">Employee</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">Leave Type</div></div>
                                                    <div className="col-lg-1 text-center"><div className="label">Total days</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">Duration</div></div>
                                                    <div className="col-lg-1 text-center"><div className="label">Status</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">Leave Period</div></div>
                                                    <div className="col-lg-1 text-center"><div className="label">Edit</div></div>
                                                </div>
                                                {leavearray?.map((applied) => (
                                                    <div className="list_listbox" key={applied.id}>
                                                        <div className="row align-items-center">
                                                            <div className="col-lg-3 text-center">{applied.leap_customer.name}</div>
                                                            <div className="col-lg-2 text-center">{applied.leap_client_leave.leave_name!}</div>
                                                            <div className="col-lg-1 text-center">{applied.total_days}</div>
                                                            <div className="col-lg-2 text-center">{applied.from_date} / {applied.to_date}</div>
                                                            <div className="col-lg-1 text-center">{applied.leap_approval_status.approval_type}</div>
                                                            <div className="col-lg-2 text-center">{/^[0-9]+$/.test(applied.duration) ? "--" : applied.duration}</div>

                                                            <div className="col-lg-1 text-center">
                                                                {applied.leap_approval_status.approval_type == "Pending" ? <img src={staticIconsBaseURL+"/images/edit.png"} className="img-fluid edit-icon" title='View/Edit' alt="Search Icon" style={{ width: "20px", cursor: "pointer", paddingBottom: "0px", alignItems: "center" }} onClick={() => { setEditLeaveId(applied.id); setShowDialog(true); setisToBeEdited(true) }} /> :
                                                                    <img src={staticIconsBaseURL + "/images/view_icon.png"} style={{ width: "20px", cursor: "pointer"}} alt="Search Icon" onClick={() => { setEditLeaveId(applied.id); setShowDialog(true); setisToBeEdited(false) }} />
                                                                }
                                                            </div>
                                                        </div>


                                                        <div className='option'>

                                                        </div>

                                                    </div>
                                                ))}

                                                <div className={showDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                                                    {showDialog && <LeaveStatusUpdate id={editLeaveId} selectedShortCutID={false} onClose={(updateData) => { setShowDialog(false), updateData && fetchUsers(3, "", selectedPage,'','') }} isToBeEddited={isToBeEdited} />}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    {/* here are the page number crowsels */}
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="page_changer">
                                                {selectedPage > 1 ? <div className="white_button_border_red" onClick={() => { changePage(-1) }}>Prev</div> : <></>}
                                                <div className="font15Medium">{selectedPage}</div>
                                                {hasMoreData && <div className="red_button" onClick={() => { changePage(1) }}>Next</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>: <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                        {<h4 className="text-muted">No leaves for selected filter</h4>}
                    </div>
            }
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

async function getCustomer(value: string) {

    let query = supabase
        .from('leap_customer')
        .select()
        .eq("client_id", value);
    const { data, error } = await query;
    if (error) {
        console.log(error);
        return [];
    } else {
        return data;
    }
}

async function getStatus() {

    let query = supabase
        .from('leap_approval_status')
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