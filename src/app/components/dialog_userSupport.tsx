
'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { AppliedLeave, EmpLeaveBalances } from '../models/leaveModel';
import LoadingDialog from './PageLoader';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';
import { ClientEmployeeRequestsUpdates, SingleSupportRequest } from '../models/supportModel';
import moment from 'moment';
interface LeaveType {
    leave_id: string,
    status: string,
    status_remark: string,

}

const UserSupport = ({ onClose, id, selectedShortCutID }: { onClose: (fetchData: boolean) => void, id: any, selectedShortCutID: any }) => {

    const [supportRequestData, setSupportRequestData] = useState<ClientEmployeeRequestsUpdates[]>([]);
    const [showResponseMessage, setResponseMessage] = useState(false);
    const { contextClientID, contaxtBranchID, contextCustomerID, contextSelectedCustId, contextRoleID } = useGlobalContext();
    const [supportArray, setSupport] = useState<SingleSupportRequest>();
    const [isLoading, setLoading] = useState(true);
    const [reopenBtn, setReopenBtn] = useState(false);
    const [formValues, setFormValues] = useState<LeaveType>({
        leave_id: "",
        status: "",
        status_remark: "",
    });
    useEffect(() => {

        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {

            const res = await fetch("/api/clientAdmin/get_supportrequest", {
                method: "POST",
                body: JSON.stringify({
                    "request_id": id,
                    "client_id": contextClientID
                }),
            });
            const response = await res.json();

            if (response.status == 1) {
                const supportData = response.data[0];
                setSupport(supportData)
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
        }
    }
    const updateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const res = await fetch("/api/clientAdmin/update_supportrequest", {
                method: "POST",
                body: JSON.stringify({
                    "status": "4", // reopen
                    "request_id": id,
                    "comments": formValues.status_remark,
                    "customer_id": contextCustomerID,
                    "client_id": contextClientID
                }),
            });
            const response = await res.json();

            if (response.status == 1) {
                // if(selectedShortCutID){
                //     updateActivityStatus(selectedShortCutID,formValues.status)
                //   }
                setLoading(false);
                onClose(true);
                fetchData();
            } else {
                setLoading(false);
                alert("Failed to update leave status.Something went wrong!");
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
            alert("An error occurred while submitting the form.");
        }
    }

    const [errors, setErrors] = useState<Partial<LeaveType>>({});

    const validate = () => {
        const newErrors: Partial<LeaveType> = {};
        if (!formValues.status_remark) newErrors.status_remark = "required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    }
    const formatDateYYYYMMDD = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);

        if (isTime) return parsedDate.format('HH:mm A');

        return parsedDate.format('YYYY-MM-DD');
    };
    return (
        <div className="">
            <div className="">
                <LoadingDialog isLoading={isLoading} />
                <div className='rightpoup_close' onClick={(e) => onClose(false)}>
                    <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
                </div>
                <div className="nw_user_offcanvas_mainbox">
                    <div className="nw_user_offcanvas_heading">
                        Ticket <span style={{ fontSize: "large" }}>{supportArray?.ticket_id || "--"}</span>
                    </div>
                    <div className="nw_user_offcanvas_listing_mainbox">
                        <div className="nw_user_offcanvas_listing">
                            <div className="nw_user_offcanvas_listing_lable">Request Category</div>
                            <div className="nw_user_offcanvas_listing_content">{supportArray?.leap_request_master?.category}</div>
                        </div>
                        <div className="nw_user_offcanvas_listing">
                            <div className="nw_user_offcanvas_listing_lable">Request Type</div>
                            <div className="nw_user_offcanvas_listing_content">{supportArray?.leap_request_master?.type_name}</div>
                        </div>
                        <div className="nw_user_offcanvas_listing">
                            <div className="nw_user_offcanvas_listing_lable">Raised on</div>
                            <div className="nw_user_offcanvas_listing_content">{moment(supportArray?.raised_on).format('DD-MM-YYYY')}</div>
                        </div>
                        <div className="nw_user_offcanvas_listing">
                            <div className="nw_user_offcanvas_listing_lable">Priority</div>
                            <div className="nw_user_offcanvas_listing_content">
                                
                                {supportArray?.priority_level === 1 ? (
                                    <><div className="nw_priority_mainbox">
                                        <div className="nw_priority_iconbox">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                <path fill="#FF0000" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                            </svg>
                                        </div>
                                        <div className="nw_priority_namebox">{supportArray?.leap_request_priority?.priority_name}</div>
                                    </div>
                                    </>
                                ) : supportArray?.priority_level === 2 ? (
                                    <><div className="nw_priority_mainbox">
                                        <div className="nw_priority_iconbox">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                <path fill="#FF6600" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                            </svg>
                                        </div>
                                        <div className="nw_priority_namebox">{supportArray?.leap_request_priority?.priority_name}</div>
                                    </div>
                                    </>
                                ) : supportArray?.priority_level === 3 ? (
                                    <><div className="nw_priority_mainbox">
                                        <div className="nw_priority_iconbox">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                <path fill="#008000" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                            </svg>
                                        </div>
                                        <div className="nw_priority_namebox">{supportArray?.leap_request_priority?.priority_name}</div>
                                    </div>
                                    </>
                                ) : < div />
                                }
                            </div>
                        </div>
                        <div className="nw_user_offcanvas_listing nw_user_offcanvas_listing_status">
                            <div className="nw_user_offcanvas_listing_lable">Status</div>
                            <div className="nw_user_offcanvas_listing_content">
                                {supportArray?.active_status === 1 ? (
                                    <><div className="nw_priority_mainbox">
                                        <div className="nw_priority_iconbox">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                <path fill="#FF6600" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                            </svg>
                                        </div>
                                        <div className="nw_priority_namebox">{supportArray?.leap_request_status?.status}</div>
                                    </div>
                                    </>
                                ) : supportArray?.active_status === 2 ? (
                                    <><div className="nw_priority_mainbox">
                                        <div className="nw_priority_iconbox">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                <path fill="#1976d2" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                            </svg>
                                        </div>
                                        <div className="nw_priority_namebox">{supportArray?.leap_request_status?.status}</div>
                                    </div>
                                    </>
                                ) : supportArray?.active_status === 3 ? (
                                    <><div className="nw_priority_mainbox">
                                        <div className="nw_priority_iconbox">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                <path fill="#388e3c" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                            </svg>
                                        </div>
                                        <div className="nw_priority_namebox">{supportArray?.leap_request_status?.status}</div>
                                    </div>
                                    </>
                                ) : supportArray?.active_status === 4 ? (
                                    <><div className="nw_priority_mainbox">
                                        <div className="nw_priority_iconbox">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                <path fill="#f57c00" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                            </svg>
                                        </div>
                                        <div className="nw_priority_namebox">{supportArray?.leap_request_status?.status}</div>
                                    </div>
                                    </>
                                ) : < div />
                                }
                            </div>
                        </div>
                        <div className="nw_user_offcanvas_listing_discription_box">
                            <div className="nw_user_offcanvas_listing_lable">Description</div>
                            <div className="nw_user_offcanvas_listing_content_textarea">
                                {supportArray?.description}
                            </div>
                        </div>
                        <div className="nw_user_offcanvas_listing_previous_box">
                            <div className="nw_user_offcanvas_listing_lable">Previous updates</div>
                            <div className="nw_user_offcanvas_listing_content_textarea">
                                {supportArray?.leap_client_employee_requests_updates && supportArray?.leap_client_employee_requests_updates.length > 0 ?

                                    <div className="col-lg-12">
                                        <div className="row list_label mb-4">
                                            <div className="col-lg-3 text-center"><div className="label">Updated By</div></div>
                                            <div className="col-lg-2 text-center"><div className="label">Status</div></div>
                                            <div className="col-lg-4 text-center"><div className="label">Comment</div></div>
                                            <div className="col-lg-3 text-center"><div className="label">Updated On</div></div>

                                        </div>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className='horizontal_scrolling' style={{ display: "inherit", width: "100%", maxWidth: "100%", maxHeight: "120px", overflowX: "hidden" }}>
                                                    {supportArray?.leap_client_employee_requests_updates && supportArray?.leap_client_employee_requests_updates.length > 0 && (
                                                        supportArray?.leap_client_employee_requests_updates.map((updatedData) => (
                                                            <div className="row list_listbox" key={updatedData.request_updates_id}>
                                                                <div className="col-lg-3 text-center">{updatedData.leap_customer.name}</div>
                                                                {updatedData.status === 1 ? (
                                                                    <><div className="col-lg-2 text-center" style={{ color: "orange" }}>{updatedData.leap_request_status.status}</div></>
                                                                ) : updatedData.status === 2 ? (
                                                                    <><div className="col-lg-2 text-center" style={{ color: "#1976d2" }}>{updatedData.leap_request_status.status}</div></>
                                                                ) : updatedData.status === 3 ? (
                                                                    <><div className="col-lg-2 text-center" style={{ color: "green" }}>{updatedData.leap_request_status.status}</div></>
                                                                ) :
                                                                    <><div className="col-lg-2 text-center" style={{ color: "red" }}>{updatedData.leap_request_status.status}</div></>
                                                                }
                                                                <div className="col-lg-4 text-center">{updatedData.comments}</div>
                                                                <div className="col-lg-3 text-center">{formatDateYYYYMMDD(updatedData.created_at)}</div>
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
                        <div className="nw_user_reopen_box">
                            {supportArray?.active_status === 3 ?
                                <div className="col-lg-12" >
                                    <div className="nw_user_reopen_btn" onClick={(e) => setReopenBtn(true)}>Reopen</div>
                                </div> : <div />
                            }
                            {reopenBtn == true ? <div className="row">
                                <form onSubmit={updateStatus}>
                                    <div className="col-lg-12">
                                        <div className="nw_reopen_text_area">
                                            <textarea className="form-control" rows={2} id="status_remark" name="status_remark" value={formValues.status_remark} onChange={handleInputChange} placeholder='Reason for reopening' />
                                            {errors.status_remark && <span className="error" style={{ color: "red" }}>{errors.status_remark}</span>}
                                        </div>
                                        <div className="nw_user_reopen_btn_red">
                                            <input type='submit' value="Submit" onClick={updateStatus} />
                                        </div>
                                    </div>
                                </form>
                            </div> : <div />}
                        </div>
                    </div>
                </div>
                {/* <div className="row mb-4 inner_heading25">
                        Comments:
                    </div>
                   
                    {supportRequestData.length > 0 ? 
                            (supportRequestData.map((id) => (
                                <div className="col-lg-12"> 
                                    <div className="row">
                                   
                                        {id.customer_id===2? <div className="col-lg-12">{id.comments}</div>
                                        : <div className="col-lg-12" style={{textAlign: "right"}}>{id.comments}</div>}
                                    </div>
                                </div>
                            )))
                            :
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                            {<h4 className="text-muted">No response yet</h4>}
                        </div>
                    } */}
                {/* reopen btn */}
            </div>
        </div>
    )
}

export default UserSupport

async function updateActivityStatus(shortcutID: any, status: any) {

    let selectQuery = supabase
        .from('leap_client_useractivites').select("*").eq("id", shortcutID)
    const { data: Activity, error: selectError } = await selectQuery;
    if (selectError) {
        // console.log(error);
        return [];
    }
    let query = supabase
        .from('leap_client_useractivites')
        .update({ activity_status: status })
        .eq("activity_related_id", Activity[0].activity_related_id);
    // .eq("asset_status", 1);
    const { data, error } = await query;
    if (error) {
        // console.log(error);
        return [];
    } else {
        // console.log(data);
        return data;
    }
}