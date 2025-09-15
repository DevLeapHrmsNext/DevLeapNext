// Manager can view their team members leaves
import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { allClientsData, allLeavesData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import { funSendApiException, funISDataKeyPresent } from "@/app/pro_utils/constant";
import { log } from "console";
import { funGetMyLeaveBalance } from "@/app/pro_utils/constantFunGetData";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "");
    const pageSize = parseInt(searchParams.get("limit") || "");

    const { client_id, manager_id, end_date, start_date, customer_id, leave_status, branch_id } = await request.json();

    let leaveBalances;
    if (!manager_id) {
      return NextResponse.json({ status: 0, message: "Manager ID is required" }, { status: apiStatusFailureCode });
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // Fetch employees under this manager
    const { data: teamMembers, error: teamError } = await supabase
      .from("leap_customer")
      .select("customer_id")
      .eq("manager_id", manager_id)
      .order('updated_at', { ascending: false })

    if (teamError) {
      return NextResponse.json({ status: 0, message: apiwentWrong, error: teamError }, { status: apiStatusFailureCode });
    }

    if (!teamMembers || teamMembers.length === 0) {
      return NextResponse.json({ status: 1, message: "No employees found under this manager", leavedata: [] }, { status: apiStatusSuccessCode });
    }

    const employeeIds = teamMembers.map(emp => emp.customer_id);
    // Fetch leave records for employees under this manager
    let query = supabase
      .from("leap_customer_apply_leave")
      .select(`*, leap_approval_status(approval_type), leap_client_leave(leave_name), leap_customer(name)`)
      .in("customer_id", employeeIds)
      .order("updated_at", { ascending: false })
    // .range(start, end);

    if (customer_id && customer_id != "0") {
      query = query.eq('customer_id', customer_id);
      leaveBalances = await funGetMyLeaveBalance(client_id, branch_id, customer_id, 5);
    }
    if (leave_status && parseInt(leave_status + '') > 0) {
      query = query.eq('leave_status', leave_status);
    }
    if (funISDataKeyPresent(start_date) && funISDataKeyPresent(end_date)) {
      query = query
        .gte('from_date', start_date)
        .lte('to_date', end_date);
    }

    if (start || end) {
      query = query.range(start, end);
    }
    log(query);
    const { data: leaves, error: leaveError } = await query;

    if (leaveError) {
      return NextResponse.json({ status: 0, message: apiwentWrong, error: leaveError }, { status: apiStatusFailureCode });
    } else if (leaves.length == 0 && (start_date || end_date)) {
      return NextResponse.json({
        message: allLeavesData,
        status: 1,
        page,
        leavedata: []
      }, { status: apiStatusSuccessCode });
    }

    else if (leaves.length == 0 && !start_date && page) {
      return NextResponse.json({
        message: allLeavesData,
        status: 1,
        page,
        leavedata: []
      }, { status: apiStatusSuccessCode });
    }

    else if (leaves.length == 0 && !leave_status && page) {
      return NextResponse.json({
        message: allLeavesData,
        status: 1,
        page,
        leavedata: []
      }, { status: apiStatusSuccessCode });
    }
    // else if (leaves.length == 0 && (start_date || end_date)) {
    //   if (page == 1) {
    //     return NextResponse.json({ message: "start date present if condition", status: 1, page: page, leavedata: [] }, { status: apiStatusSuccessCode });
    //   } else {
    //     return NextResponse.json({ message: allLeavesData, status: 0, page: page - 1 }, { status: apiStatusSuccessCode });
    //   }
    // }
    // else if (leaves.length == 0 && !start_date && page) {
    //   return NextResponse.json({ message: allLeavesData, status: 0, page: page - 1 }, { status: apiStatusSuccessCode });
    // }
    // else if (leaves.length == 0 && !leave_status && page) {
    //   return NextResponse.json({ message: allLeavesData, status: 0, page: page - 1 }, { status: apiStatusSuccessCode });
    // }
    else {
      if (!leaveBalances) {
        leaveBalances = await funGetMyLeaveBalance(client_id, branch_id, leaves[0].customer_id, 5);
      }

      return NextResponse.json({ message: allLeavesData, status: 1, leavedata: leaves }, { status: apiStatusSuccessCode });
    }
  }

  catch (error) {
    return funSendApiException(error);
  }
}