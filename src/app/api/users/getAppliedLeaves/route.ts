import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { allClientsData, allLeavesData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import { funISDataKeyPresent, funSendApiException } from "@/app/pro_utils/constant";
import { funGetMyLeaveBalance } from "@/app/pro_utils/constantFunGetData";

export async function POST(request: NextRequest) {

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || ""); // Default: 1
    const pageSize = parseInt(searchParams.get("limit") || ""); // Default: 20 per page

    let leaveBalances;
    const { client_id, branch_id, start_date, end_date, id, leave_status, customer_id,  leave_type } = await request.json();
   
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
      .from("leap_customer_apply_leave")
      .select(`*,leap_approval_status(approval_type),leap_client_leave(leave_name),leap_customer(name)`)
      .eq('client_id', client_id)
      .eq('branch_id', branch_id)
      .order('updated_at', { ascending: false })

    if (id) {
      query = query.eq("id", id);
    }
    if (leave_status && leave_status !== "0") {
      query = query.eq('leave_status', leave_status);
    }
    if (customer_id && customer_id != "0") {
      query = query.eq('customer_id', customer_id);
      leaveBalances = await funGetMyLeaveBalance(client_id, branch_id, customer_id, 5);
    }
    if (leave_type && leave_type !== "0") {
      query = query.eq('leave_type', leave_type);
    }
    // if(funISDataKeyPresent(start_date) && funISDataKeyPresent(end_date)!){
    //       query=query.gte('from_date',start_date).lte('to_date',start_date);
    //     }
    // if(funISDataKeyPresent(start_date && funISDataKeyPresent(end_date))){
    //   query=query.lte('from_date',end_date).gte('to_date',start_date);
    // }
    if (funISDataKeyPresent(start_date) && funISDataKeyPresent(end_date)) {
      query = query
        .gte('from_date', start_date)
        .lte('to_date', end_date);
    }

    if (start || end) {
      query = query.range(start, end);
    }
    // console.log(query);
    const { data: leaves, error } = await query;

    if (error) {
      return NextResponse.json({ status: 0, message: apiwentWrong, error: error }, { status: apiStatusFailureCode });
    } else if (leaves.length == 0 && (start_date || end_date)) {
      if (page == 1) {
        return NextResponse.json({ message: "start date present if condition", status: 1, page: page, leavedata: [] }, { status: apiStatusSuccessCode });
      } else {
        return NextResponse.json({ message: allLeavesData, status: 0, page: page - 1 }, { status: apiStatusSuccessCode });
      }
    }
    else if (leaves.length == 0 && !start_date && page) {
      return NextResponse.json({ message: allLeavesData, status: 0, page: page - 1 }, { status: apiStatusSuccessCode });
    }
    else if (leaves.length == 0 && !leave_status && page) {
      return NextResponse.json({ message: allLeavesData, status: 0, page: page - 1 }, { status: apiStatusSuccessCode });
    }
    else {
      if (!leaveBalances) {
        leaveBalances = await funGetMyLeaveBalance(client_id, branch_id, leaves[0].customer_id, 5);
      }
      return NextResponse.json({ message: allLeavesData, leavedata: leaves, status: 1, emp_leave_Balances: leaveBalances }, { status: apiStatusSuccessCode });
    }
  } catch (error) {
    return funSendApiException(error);
  }
}