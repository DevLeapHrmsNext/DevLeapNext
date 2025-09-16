import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';
import supabase from '../api/supabaseConfig/supabase';
import { SingleSupportRequest } from '../models/supportModel';
import moment from 'moment';
import AssignEmployeeAttendance from './dialog_assignEmpAttendance';
import ShowAlertMessage from './alert';
import { useRouter } from 'next/navigation';
import { pageURL_CustomerProfile, pageURL_editUserPorifle } from '../pro_utils/stringRoutes';
import LoadingDialog from './PageLoader';

interface NewUpdates {
    statusUpdate: any,
    comment: any,
}

const DialogUpdateSupportRequest = ({ onClose, supportRequestID }: { onClose: () => void, supportRequestID: any }) => {

 const {contextClientID,contaxtBranchID,contextCompanyName,contextCustomerID,contextEmployeeID,
        contextLogoURL,contextRoleID,isAdmin,contextProfileImage,contextUserName,
         setGlobalState}=useGlobalContext();
             const [statusArray, setStatus] = useState<SupportRequestStatus[]>([]);
    const [ssupportRequestData, setSupportRequestData] = useState<SingleSupportRequest>();
    const [formValues, setformValues] = useState<NewUpdates>({
        statusUpdate: 0,
        comment: ''
    });
    const [isLoading, setLoading] = useState(true);
    const [showAssignDialog, setShowAttendanceAssignDialog] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    const router =useRouter();

    useEffect(() => {

        fetchData();

    }, []);

    const fetchData = async () => {
        setLoading(true);
        const status = await getStatus();
        setStatus(status);
        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("request_id", supportRequestID);
            const payload: { [key: string]: any } = {
                client_id: contextClientID,
                request_id: supportRequestID
            }

            const res = await fetch("/api/clientAdmin/get_supportrequest", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            console.log(res);

            const response = await res.json();
            if (response.status == 1) {
                setLoading(false);
                setSupportRequestData(response.data[0]);
            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent(response.message);
                setAlertForSuccess(2)
                
            }

        } catch (error) {
            setLoading(false);
            alert("Something went wrong exception occured")
            console.error("Error fetching user data:", error);
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        console.log("handle submit is called");
        e.preventDefault();
        try {
            // const formData = new FormData();

            // formData.append("request_id", supportRequestID);
            // formData.append("customer_id", contextCustomerID);
            // formData.append("notify_customer_id", ssupportRequestData?.customer_id+'');
            // formData.append("status", formValues.statusUpdate);
            // formData.append("comments", formValues.comment);

            const res = await fetch("/api/clientAdmin/update_supportrequest", {
                method: "POST",
                body: JSON.stringify({
                    request_id: supportRequestID,
                    customer_id: contextCustomerID,
                    status: formValues.statusUpdate,
                    comments: formValues.comment,
                    notify_customer_id: ssupportRequestData?.customer_id+''
                }),
            });
            console.log(res);

            const response = await res.json();
            if (response.status == 1) {
                setLoading(false);
                onClose();
            } else {
                setLoading(false);

                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent(response.message);
                setAlertForSuccess(2)
            }

        } catch (error) {
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Failed")
            setAlertStartContent("Exception occured: Something went wrong.");
            setAlertForSuccess(3)
            console.error("Error fetching user data:", error);
        }
    }
    const formatDateYYYYMMDD = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);

        if (isTime) return parsedDate.format('HH:mm A');

        return parsedDate.format('YYYY-MM-DD');
    };

    const navigateToProfile = () => {
            
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
                contextSelectedCustId: ssupportRequestData?.customer_id+'',
                contextAddFormEmpID: '',
                contextAnnouncementID:'',
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
        <div className="container">
            <LoadingDialog isLoading={isLoading} />
            {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent.length > 0 ? alertEndContent : ""} value1={""} value2={""} onOkClicked={function (): void {
                setShowAlert(false)
                if (alertForSuccess == 1) {
                    onClose();
                }

            }} onCloseClicked={function (): void {
                setShowAlert(false)
            }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
            <div className='rightpoup_close' onClick={onClose}>
                <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
            </div>
            <div className="row">
                <div className="col-lg-12 mb-3 inner_heading25">
                    Update Help Request
                </div>
            </div>
            {isLoading ?
                <div className="loader-spinner"></div> :
                <div className="row">
                    <div className="col-lg-3"><div className="label">Name:</div></div>
                    <div className="col-lg-9 mb-3">{ssupportRequestData?.leap_customer.name}</div>
                    <div className="col-lg-3"><div className="label">Category:</div></div>
                    <div className="col-lg-9 mb-3">{ssupportRequestData?.leap_request_master.category}</div>
                    <div className="col-lg-3"><div className="label">Request Type:</div></div>
                    <div className="col-lg-9 mb-3">{ssupportRequestData?.leap_request_master.type_name}</div>
                    <div className="col-lg-3"><div className="label">Priority level:</div></div>
                    <div className="col-lg-9 mb-3">{ssupportRequestData?.leap_request_priority.priority_name}</div>
                    <div className="col-lg-3"><div className="label">Description:</div></div>
                    <div className="col-lg-9 mb-3">{ssupportRequestData?.description}</div>
                    <div className="col-lg-3 mb-2"><div className="label">Previous updates:</div></div>
                    <div className="col-lg-12 mb-4">
                        <div style={{ borderRadius: "10px", padding: "8px", boxShadow: "0 0px 10px #cccccc63" }}>
                            {ssupportRequestData?.leap_client_employee_requests_updates && ssupportRequestData?.leap_client_employee_requests_updates.length > 0 ?

                                <div className="col-lg-12">
                                    <div className="row list_label mb-4">
                                        <div className="col-lg-3 text-center"><div className="label">Updated By</div></div>
                                        <div className="col-lg-2 text-center"><div className="label">Status</div></div>
                                        <div className="col-lg-5 text-center"><div className="label">Comment</div></div>
                                        <div className="col-lg-2 text-center"><div className="label">Updated On</div></div>

                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className='horizontal_scrolling' style={{ display: "inherit", width: "100%", maxWidth: "100%", maxHeight: "120px", overflowX: "hidden" }}>
                                                {ssupportRequestData?.leap_client_employee_requests_updates && ssupportRequestData?.leap_client_employee_requests_updates.length > 0 && (
                                                    ssupportRequestData?.leap_client_employee_requests_updates.map((updatedData) => (
                                                        <div className="row list_listbox" key={updatedData.request_updates_id}>
                                                            <div className="col-lg-3 text-center">{updatedData.leap_customer.name}</div>
                                                            {updatedData.status === 1 ? (
                                                                <><div className="col-lg-2 text-center" style={{ color: "orange" }}>{updatedData.leap_request_status.status}</div></>
                                                            ) : updatedData.status === 2 ? (
                                                                <><div className="col-lg-2 text-center" style={{ color: "green" }}>{updatedData.leap_request_status.status}</div></>
                                                            ) : updatedData.status === 3 ? (
                                                                <><div className="col-lg-2 text-center" style={{ color: "red" }}>{updatedData.leap_request_status.status}</div></>
                                                            ) :
                                                                <><div className="col-lg-2 text-center" style={{ color: "red" }}>{updatedData.leap_request_status.status}</div></>
                                                            }
                                                            <div className="col-lg-5 text-center">{updatedData.comments}</div>
                                                            <div className="col-lg-2 text-center">{formatDateYYYYMMDD(updatedData.created_at)}</div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                : (
                                    <div className="text-center">No previous updates</div>
                                )}
                        </div>

                    </div>

                    <div className="col-lg-3"><div className="label">Status<span className='req_text'>*</span>:</div></div>
                    <div className="col-lg-9 mb-3">
                        <div className="form_box">
                            <select id="statusUpdate" style={{ width: "250px" }} name="statusUpdate" value={formValues.statusUpdate} onChange={(e) => { setformValues((prev) => ({ ...prev, ['statusUpdate']: e.target.value })) }}>
                                <option value={0} >Select</option>
                                {statusArray.map((status, index) => (
                                    <option value={status.id} key={status.id}>{status.status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-lg-3 mb-3">Comments{ssupportRequestData?.type_id}<span className='req_text'>*</span>:</div>
                    <div className="col-lg-9 mb-3">
                        <div className="form_box">
                            <textarea id="comment" name="comment" className='form-control' onChange={(e) => { setformValues((prev) => ({ ...prev, ['comment']: e.target.value })) }} />
                        </div>
                    </div>


                    <div className="row mb-5">
                        <div className="col-lg-12">
                            {ssupportRequestData?.type_id && ssupportRequestData.type_id == 8 && <input type='submit' value="Assign Attendance" className="red_button" onClick={() => setShowAttendanceAssignDialog(true)} style={{ marginRight: "10px" }} />}
                            {ssupportRequestData?.type_id && ssupportRequestData.type_id == 9 && <input type='submit' value="Reset Device" className="red_button" onClick={() => navigateToProfile() } style={{ marginRight: "10px" }} />}

                            <input type='submit' value="Update" className="red_button" onClick={handleSubmit} />
                        </div>
                    </div>
                    <div className={showAssignDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                        {showAssignDialog && <AssignEmployeeAttendance customer_id={ssupportRequestData?.customer_id} date={ssupportRequestData?.description} onClose={() => { setShowAttendanceAssignDialog(false) }} />}
                    </div>
                </div>}

        </div>
    )
}

export default DialogUpdateSupportRequest


async function getStatus() {

    let query = supabase
        .from('leap_request_status')
        .select();

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}