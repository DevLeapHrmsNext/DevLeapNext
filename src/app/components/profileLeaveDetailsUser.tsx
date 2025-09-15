'use client'
import React, { useEffect, useState } from 'react'
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import supabase from '@/app/api/supabaseConfig/supabase';
import { useRouter } from 'next/navigation';
import { error } from 'console';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { EmpLeaveBalances } from '../models/leaveModel';
import LoadingDialog from './PageLoader';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';

export const UserProfileLeaveDetails = () => {

    const { contextClientID, contaxtBranchID, contextCustomerID } = useGlobalContext();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {

            try {

                const res = await fetch("/api/users/getAppliedLeaves", {
                    method: "POST",
                    body: JSON.stringify({
                        "client_id": contextClientID,
                        "customer_id": contextCustomerID,
                        "branch_id": contaxtBranchID
                    }),
                });

                const response = await res.json();
                console.log(response);
                if (res.ok) {
                    const leaveBal = response.emp_leave_Balances;
                    setEmpLeaveBalances(leaveBal)
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
    }, []);

    const [empleaveBalances, setEmpLeaveBalances] = useState<EmpLeaveBalances>();
    function extractFirstLetters(sentence: string) {
        const words = sentence.split(" ");
        let result = "";
        for (const word of words) {
            result += word.charAt(0);
        }
        return result;
    }
    return (
        <div className="container" id='leave_id'>
            <div className="row">
                <div className="col-lg-12">
                    <div className="d_user_new_details_mainbox mb-4">
                        <div className="d_user_profile_heading">Leave Balances</div>
                        <div className="d_user_leave_balance_mainbox">
                            {empleaveBalances && empleaveBalances.customerLeavePendingCount.map((balance, index) =>
                                <div className="d_user_leave_balance_listing" key={index}>
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
