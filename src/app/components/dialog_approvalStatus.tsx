

'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { AppliedLeave, EmpLeaveBalances } from '../models/leaveModel';
import LoadingDialog from './PageLoader';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';
import { SwiperSlide } from 'swiper/react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import moment from 'moment';
import ShowAlertMessage from './alert';

interface LeaveType {
    leave_id: string,
    // customer_id: string,
    status: string,
    status_remark: string,
}

const LeaveStatusUpdate = ({ onClose, id, selectedShortCutID, isToBeEddited }: { onClose: (fetchData: boolean) => void, id: any, selectedShortCutID: any, isToBeEddited: boolean }) => {

    const [showResponseMessage, setResponseMessage] = useState(false);
    // const [assetArray, setAsset] = useState<AssetList[]>([]);
    const { contextClientID, contaxtBranchID, contextSelectedCustId, contextRoleID } = useGlobalContext();

    const [formValues, setFormValues] = useState<LeaveType>({
        leave_id: "",
        status: "",
        status_remark: "",
    });
    const [leaveData, setLeaveData] = useState<AppliedLeave>();
    const [empleaveBalances, setEmpLeaveBalances] = useState<EmpLeaveBalances>();
    const [isLoading, setLoading] = useState(true);

    const [showAlert, setShowAlert] = useState(false);
        const [alertForSuccess, setAlertForSuccess] = useState(0);
        const [alertTitle, setAlertTitle] = useState('');
        const [alertStartContent, setAlertStartContent] = useState('');
        const [alertMidContent, setAlertMidContent] = useState('');
        const [alertEndContent, setAlertEndContent] = useState('');
        const [alertValue1, setAlertValue1] = useState('');
        const [alertvalue2, setAlertValue2] = useState('');

    useEffect(() => {

        const fetchData = async () => {

            try {

                const res = await fetch(`/api/users/getAppliedLeaves`, {
                    method: "POST",
                    body: JSON.stringify({
                        "client_id": contextClientID,
                        "branch_id": contaxtBranchID,
                        "id": id
                    }),
                });
                const response = await res.json();
                const user = response.leavedata[0];
                setFormValues({
                    leave_id: user.id,
                    status: user.leave_status,
                    status_remark: user.approve_disapprove_remark,
                });
                setLeaveData(user)
                const leaveBal = response.emp_leave_Balances;
                setEmpLeaveBalances(leaveBal)
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
    }, []);

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;
        console.log("Form values updated:", formValues);
        setResponseMessage(true);
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };
    const [errors, setErrors] = useState<Partial<LeaveType>>({});

    const validate = () => {
        const newErrors: Partial<LeaveType> = {};
        if (!formValues.status) newErrors.status = "required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const response = await fetch("/api/users/updateAppliedLeaveStatus", {
                method: "POST",
                body: JSON.stringify({
                    "leave_id": id,
                    "status": formValues.status,
                    "status_remark": formValues.status_remark
                }),
            });
            // console.log(response);
            if (response.ok) {
                if (selectedShortCutID) {
                    updateActivityStatus(selectedShortCutID, formValues.status)
                }
                setLoading(false);
                onClose(true);
            } else {
                setLoading(false)
                setShowAlert(true);
                setAlertForSuccess(2);
                setAlertTitle("Error");
                setAlertStartContent("Failed to update leave status.");
                
                // alert("Failed to update leave status.Something went wrong!");
            }
        } catch (error) {
            setLoading(false);
            console.log("Error submitting form:", error);
            setShowAlert(true);
            setAlertForSuccess(2);
            setAlertTitle("Error");
            setAlertStartContent("An error occurred while updating the request.");

        }
    }
    function extractFirstLetters(sentence: string) {
        const words = sentence.split(" ");
        let result = "";
        for (const word of words) {
            result += word.charAt(0);
        }
        return result;
    }
    return (
        <div className="">
            <div className="">
                <LoadingDialog isLoading={isLoading} />

                        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)
                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                            
                <div className='rightpoup_close' onClick={(e) => onClose(false)}>
                    <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' onClick={(e) => onClose(false)} />
                </div>
                {/* -------------- */}
                <div className="nw_user_offcanvas_mainbox" style={{marginLeft:"-40px"}}>
                    
                    <div className="nw_user_offcanvas_heading">
                        Leave <span>Details</span>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="nw_user_offcanvas_listing_mainbox">
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Name</div>
                                <div className="nw_user_offcanvas_listing_content">{leaveData?.leap_customer.name}</div>
                            </div>
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Applied on</div>
                                <div className="nw_user_offcanvas_listing_content">{moment(leaveData?.created_at).format('DD-MM-YYYY')}</div>
                            </div>
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Leave Type</div>
                                <div className="nw_user_offcanvas_listing_content">{leaveData?.leap_client_leave.leave_name}</div>
                            </div>
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Leave Date</div>
                                <div className="nw_user_offcanvas_listing_content">
                                    {leaveData?.from_date === leaveData?.to_date ?
                                        <div className="ne_user_offcanvas_from_date_mainbox">
                                            <div className="ne_user_offcanvas_single_box">{moment(leaveData?.from_date).format('DD-MM-YYYY')}</div> </div> :
                                        <div className="ne_user_offcanvas_from_date_mainbox"><div className="ne_user_offcanvas_from_to_box"><span className='from_color_code'>From :</span><span>{moment(leaveData?.from_date).format('DD-MM-YYYY')}</span></div>
                                            <div className="ne_user_offcanvas_to_box"><div className="ne_user_offcanvas_from_to_box"><span className='from_color_code'>To :</span><span>{moment(leaveData?.to_date).format('DD-MM-YYYY')}</span></div></div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Reason</div>
                                <div className="nw_user_offcanvas_listing_content">{leaveData?.leave_reason}</div>
                            </div>
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Total days</div>
                                <div className="nw_user_offcanvas_listing_content">{leaveData?.total_days}</div>
                            </div>
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Leave Period</div>
                                <div className="nw_user_offcanvas_listing_content">{/^[0-9]+$/.test(leaveData?.duration || "") ? "--" : leaveData?.duration}</div>
                            </div>
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Status</div>
                                <div className="nw_user_offcanvas_listing_content">
                                    <div className="form_box">
                                        {isToBeEddited ? <select id="status" name="status" value={formValues.status} onChange={(e) => setFormValues((prev) => ({ ...prev, ['status']: e.target.value }))}>
                                            <option value="1">Pending</option>
                                            <option value="2">Approved</option>
                                            <option value="3">Disapproved</option>
                                        </select> : <div className="nw_user_offcanvas_listing_content">{formValues.status == "2" ?
                                            <><div className="nw_priority_mainbox">
                                                <div className="nw_priority_iconbox">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                        <path fill="#008000" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                    </svg>
                                                </div>
                                                <div className="nw_priority_namebox"> {leaveData?.leap_approval_status.approval_type}</div>
                                            </div>
                                            </>
                                            :
                                            <><div className="nw_priority_mainbox">
                                                <div className="nw_priority_iconbox">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                        <path fill="#FF0000" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                    </svg>
                                                </div>
                                                <div className="nw_priority_namebox"> {leaveData?.leap_approval_status.approval_type}</div>
                                            </div>
                                            </>
                                        }</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="nw_user_offcanvas_listing_discription_box">
                                <div className="nw_user_offcanvas_listing_lable">Remark</div>
                                <div className="nw_user_offcanvas_listing_content_textarea">
                                    <div className="col-lg-8 mb-3">
                                        {isToBeEddited ?
                                            <textarea style={{ fontSize: "13px", minHeight: "100px" }} className="form-control" value={formValues.status_remark} name="status_remark" onChange={(e) => setFormValues((prev) => ({ ...prev, ['status_remark']: e.target.value }))} id="status_remark" placeholder="Remark"></textarea>
                                            : <div className="col-lg-8 mb-3">{formValues.status_remark}</div>}
                                    </div>
                                    {isToBeEddited ? <div className="col-lg-8 mb-3">
                                        <input type='submit' value="Update" className="red_button" />
                                    </div> : <></>}
                                </div>
                            </div>
                            <div className="nw_user_canvas_leave_balance_mainbox" >
                                <div className="nw_user_offcanvas_heading nw_user_offcanvas_leave_balance_heading">
                                    Leave <span>Balances</span>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="nw_user_offcanavas_leave_balance_mainbox">
                                            {empleaveBalances && empleaveBalances.customerLeavePendingCount.map((balance, index) =>

                                                <SwiperSlide key={index}>
                                                    <div className="d_user_leave_balance_listing">
                                                        <CircularProgressbar
                                                            value={balance.leaveBalance}
                                                            maxValue={balance.leaveAllotedCount}
                                                            // text=
                                                            // text={balance.leaveType}
                                                            strokeWidth={12}
                                                            styles={buildStyles({
                                                                textColor: "#000",
                                                                pathColor: "#899DAF",
                                                                trailColor: "#C2D4E4",
                                                                // textSize: "14px"
                                                            })} />
                                                        <div className="new_home_leave_balance_typebox_remaining_box">
                                                            <div className="new_home_leave_balance_typebox">
                                                                {extractFirstLetters(balance.leaveType)}
                                                            </div>
                                                            <div className="new_home_leave_balance_remaining">
                                                                {balance.leaveBalance + "/" + balance.leaveAllotedCount}
                                                            </div>
                                                        </div>
                                                        <div className='user_balance_tooltip'>
                                                            <div className="ser_tool_tip_content">
                                                                {balance.leaveType}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            )}
                                        </div>
                                    </div>
                                    {/* {empleaveBalances && empleaveBalances.customerLeavePendingCount.map((counts, index) =>
                                        <div className="col-lg-5 m-3" key={index}>
                                            <div className="summery_box" style={{ backgroundColor: counts.color_code }}>
                                                {counts.leaveType}<br /><span>{counts.leaveBalance + "/ " + counts.leaveAllotedCount}</span>
                                            </div>
                                        </div>
                                    )} */}
                                </div>
                                {showResponseMessage && <div className="row md-5"><label>Leave Type Updated Successfully</label></div>}
                            </div>
                        </div>
                    </form>
                </div>
                {/* -------------- */}
            </div>
        </div>
    )
}

export default LeaveStatusUpdate

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