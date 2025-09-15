'use client'
import React, { useEffect, useState } from 'react'
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import supabase from '@/app/api/supabaseConfig/supabase';
import { useRouter } from 'next/navigation';
import { error } from 'console';
import { Bank, BankDetail, BankModel, SalaryDetail, TotalSalary } from '../models/employeeDetailsModel';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { EmpLeaveBalances } from '../models/leaveModel';
import LoadingDialog from './PageLoader';

export const UserProfileLeaveDetails = () => {

    

    const { contextClientID, contextRoleID,contextSelectedCustId } = useGlobalContext();
    const [isLoading,setLoading] = useState(true);  


    useEffect(() => {
        const fetchData = async () => {

            try {
                const branchId=await getEmployeeBranch(contextClientID,contextSelectedCustId);
                console.log("kjdbfkabsd fabhfkadsbfbasd fhasbd ",branchId);
                
                // const formData = new FormData();
                // formData.append("client_id", contextClientID);
                // formData.append("customer_id", contextSelectedCustId);
                

                const res = await fetch("/api/users/getAppliedLeaves", {
                    method: "POST",
                    body: JSON.stringify({
                        "client_id":contextClientID,
                        "customer_id":contextSelectedCustId,
                        "branch_id":branchId[0].branch_id
                    }),
                });

                const response = await res.json();
                console.log(response);
                if (res.ok) {
                    const leaveBal=response.emp_leave_Balances;
                setEmpLeaveBalances(leaveBal)
                setLoading(false);
                    
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
    }, []);

    const [empleaveBalances,setEmpLeaveBalances]=useState<EmpLeaveBalances>();

    return (
        <div className="grey_box">
            <LoadingDialog isLoading={isLoading} />
           <div className="row">
                    <div className="col-lg-12 mb-4 inner_heading25">
                    Leave Balances
                    </div>
                </div>
                <div className="row">
                        {empleaveBalances && empleaveBalances.customerLeavePendingCount.map((counts, index)=>
                            <div className="col-lg-4" key={index}>
                                <div className='profileleave_bal_box'>
                                    <div className='profileleave_bal_head'>{counts.leaveType}</div>
                                    <div className={(counts.leaveBalance && counts.leaveBalance.toString().length<=2) || (counts.leaveAllotedCount && counts.leaveAllotedCount.toString().length<=2) ? 'profileleave_bal_count':'profileleave_bal_count_small'}>{counts.leaveBalance+"/ "+counts.leaveAllotedCount}</div>
                                </div>
                                {/* <div className="summery_box" style={{ backgroundColor: counts.color_code }}>
                                    {counts.leaveType}<br /><span>{counts.leaveBalance+"/ "+counts.leaveAllotedCount}</span>
                                </div> */}
                            </div>
                        )}
                </div>
        </div>
    )
}

async function getEmployeeBranch(client_id: any,customer_id:any) {

    let query = supabase
        .from('leap_customer')
        .select("branch_id")
        .eq("client_id", client_id)
        .eq("customer_id", customer_id);

    const { data, error } = await query;

    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}




