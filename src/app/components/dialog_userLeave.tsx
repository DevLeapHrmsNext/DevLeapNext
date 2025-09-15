
'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { AppliedLeave, EmpLeaveBalances } from '../models/leaveModel';
import LoadingDialog from './PageLoader';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';
import moment from 'moment';

const UserLeaveStatus = ({ onClose, id }: { onClose: (fetchData: boolean) => void, id: any }) => {

    const { contextClientID, contaxtBranchID } = useGlobalContext();
    const [leaveData, setLeaveData] = useState<AppliedLeave>();
    const [isLoading, setLoading] = useState(true);

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
                setLeaveData(user)
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <div >
            <div className='rightpoup_close' onClick={(e) => onClose(false)}>
                <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close'  />
            </div>
            {/* -------------- */}
            <div className="nw_user_offcanvas_mainbox">
                <LoadingDialog isLoading={isLoading} />
                <div className="nw_user_offcanvas_heading">
                    Leave <span>Details</span>
                </div>
                <div className="nw_user_offcanvas_listing_mainbox">
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Leave Type</div>
                        <div className="nw_user_offcanvas_listing_content">{leaveData?.leap_client_leave.leave_name}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Applied on</div>
                        <div className="nw_user_offcanvas_listing_content">{moment(leaveData?.created_at).format('DD-MM-YYYY')}</div>
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
                        <div className="nw_user_offcanvas_listing_lable">Total days</div>
                        <div className="nw_user_offcanvas_listing_content">{leaveData?.total_days}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Leave Period</div>
                        <div className="nw_user_offcanvas_listing_content">{/^[0-9]+$/.test(leaveData?.duration || "") ? "--" : leaveData?.duration}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Leave reason</div>
                        <div className="nw_user_offcanvas_listing_content">{leaveData?.leave_reason}</div>
                    </div>
                    <div className="nw_user_offcanvas_listing">
                        <div className="nw_user_offcanvas_listing_lable">Status</div>
                        <div className="nw_user_offcanvas_listing_content">
                            {leaveData?.leave_status === 1 ? (
                                <><div className="nw_priority_mainbox">
                                    <div className="nw_priority_iconbox">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                            <path fill="#FF6600" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                        </svg>
                                    </div>
                                    <div className="nw_priority_namebox"> {leaveData?.leap_approval_status.approval_type}</div>
                                </div>
                                </>
                            ) : leaveData?.leave_status === 2 ? (
                                <><div className="nw_priority_mainbox">
                                    <div className="nw_priority_iconbox">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                            <path fill="#008000" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                        </svg>
                                    </div>
                                    <div className="nw_priority_namebox"> {leaveData?.leap_approval_status.approval_type}</div>
                                </div>
                                </>
                            ) : leaveData?.leave_status === 3 ? (
                                <><div className="nw_priority_mainbox">
                                    <div className="nw_priority_iconbox">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                            <path fill="#FF0000" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                        </svg>
                                    </div>
                                    <div className="nw_priority_namebox"> {leaveData?.leap_approval_status.approval_type}</div>
                                </div>
                                </>
                            ) : < div />
                            }
                        </div>
                    </div>
                    <div className="nw_user_offcanvas_listing_discription_box">
                        <div className="nw_user_offcanvas_listing_lable">Remark</div>
                        <div className="nw_user_offcanvas_listing_content_textarea">{leaveData?.approve_disapprove_remark ? leaveData?.approve_disapprove_remark : "--"}</div>
                    </div>
                </div>
            </div>
            {/* -------------- */}
        </div>
    )
}

export default UserLeaveStatus