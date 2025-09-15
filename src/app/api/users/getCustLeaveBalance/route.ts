import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { calculateNumMonths, funSendApiErrorMessage, funSendApiException, getFirstDateOfYearbyDate } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
  let leaveStatusApprovedCount = 0, leaveStatusRejectedCount = 0, leaveStatusPendingCount = 0;
  try {
    // const { data: user, error: userError } = await supabase.auth.getUser();


    // // Handle case where the user is not authenticated
    // if (userError || !user) {
    //   return NextResponse.json(
    //     { error: 'User not authenticated' },
    //     { status: 401 }
    //   );
    // }
    const {client_id, branch_id, customer_id} = await request.json();
    // const fdata = {
    //   clientId: formData.get('client_id') as string,
    //   customerId: formData.get('customer_id'),
    // }

    //getCustomer Data
    const { data: customerData, error: customerError } = await supabase
      .from("leap_customer")
      .select(`*`).eq('client_id', client_id).eq('customer_id', customer_id);
    if (customerError) {
      return funSendApiErrorMessage("Customer fetch error", customerError);
    }


    //get client leave types which has leave policy i.e number of days WRT the leave type
    const { data: custleaveData, error: custleaveError } = await supabase
      .from("leap_client_leave")
      .select(`*`).eq('client_id', client_id).eq('branch_id', branch_id);
    if (custleaveError) {
      return funSendApiErrorMessage("Unable to fetch customer leave", custleaveError);
    }

    //get client applied Leave Data with respect to customer
    const { data: appliedLeavedata, error: appliedLeaveError } = await supabase
      .from("leap_customer_apply_leave")
      .select(`*`).eq('client_id', client_id).eq('customer_id', customer_id);

    if (appliedLeaveError) {

      return funSendApiErrorMessage("Applied Leave Error :- ", appliedLeaveError);
    }
    //calculate status wise count pending,approved, rejected/dissaproved
    for (let i = 0; i < appliedLeavedata.length; i++) {
      if (appliedLeavedata[i].leave_status == 1) {
        leaveStatusPendingCount = leaveStatusPendingCount + 1;
      }
      if (appliedLeavedata[i].leave_status == 2) {
        leaveStatusApprovedCount = leaveStatusApprovedCount + 1;
      }
      if (appliedLeavedata[i].leave_status == 3) {
        leaveStatusRejectedCount = leaveStatusRejectedCount + 1;
      }

    }


    let customerLeavePendingCount: LeaveTypeCount[] = [];
    const custJoiningDate = customerData[0].date_of_joining;
    const calcTotalWorkingSpan = calculateNumMonths(new Date(custJoiningDate), new Date());

    const calcCurrentYearSpan = calculateNumMonths(new Date(getFirstDateOfYearbyDate(new Date())), new Date());

    for (let i = 0; i < custleaveData.length; i++) {
      // console.log(customerData[0].gender);

      if ((customerData[0].gender == custleaveData[i].gender || custleaveData[i].gender == "All")) {
        // if (custleaveData[i].if_unused == "Carry Forward") {

        //   customerLeavePendingCount.push({
        //     leaveTypeId: custleaveData[i].leave_id,
        //     leaveType: custleaveData[i].leave_name,
        //     leaveAllotedCount: calcTotalWorkingSpan * custleaveData[i].leave_count,
        //     totalAppliedLeaveDays: 0,
        //     leaveBalance: calcTotalWorkingSpan * custleaveData[i].leave_count,
        //     isPaid: custleaveData[i].is_paid,
        //     color_code: custleaveData[i].color_code
        //   })

        // } else 
          
          customerLeavePendingCount.push({
            leaveTypeId: custleaveData[i].leave_id,
            leaveType: custleaveData[i].leave_name,
            leaveAllotedCount: calcCurrentYearSpan * custleaveData[i].leave_count,
            totalAppliedLeaveDays: 0,
            leaveBalance: calcCurrentYearSpan * custleaveData[i].leave_count,
            isPaid: custleaveData[i].is_paid,
            color_code: custleaveData[i].color_code
          })
        
      }
    }
 let totalLeaveAppliedDays = 0, totalLeaveBalance = 0;
    for (let i = 0; i < appliedLeavedata.length; i++) {
      for (let j = 0; j < customerLeavePendingCount.length; j++) {
        if (appliedLeavedata[i].leave_type === customerLeavePendingCount[j].leaveTypeId && appliedLeavedata[i].leave_status == 2) {
          customerLeavePendingCount[j].totalAppliedLeaveDays = customerLeavePendingCount[j].totalAppliedLeaveDays + appliedLeavedata[i].total_days;
          totalLeaveAppliedDays = totalLeaveAppliedDays + customerLeavePendingCount[j].totalAppliedLeaveDays;
          customerLeavePendingCount[j].leaveBalance = customerLeavePendingCount[j].leaveAllotedCount - customerLeavePendingCount[j].totalAppliedLeaveDays;
          totalLeaveBalance = totalLeaveBalance + customerLeavePendingCount[j].leaveBalance;
        }
      }
    }
    if (appliedLeaveError) {
      return funSendApiErrorMessage("Applied Leave Error", appliedLeaveError);
    }
    else {
      return NextResponse.json({
        message: "Leave Balance",
        status: 1,
        data: {
          customer_id: customerData[0].customer_id,
          joiningDate: customerData[0].date_of_joining,
          client_id: customerData[0].client_id,
          branch_id: custleaveData[0].branch_id,
          leaveStatusPendingCount: leaveStatusPendingCount,
          LeaveStatusAprovedCount: leaveStatusApprovedCount,
          LeaveStatusRejectedCount: leaveStatusRejectedCount,
          leave_balances: customerLeavePendingCount,
        },
      }, { status: apiStatusSuccessCode });
    }


  } catch (error) {
    return funSendApiException(error);

  }
}