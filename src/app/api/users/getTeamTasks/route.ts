// Manager can view their team members leaves
import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong, taskUpdateFailed, taskUpdatedData } from "@/app/pro_utils/stringConstants";
import { funSendApiException, funISDataKeyPresent } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10); 
    const pageSize = parseInt(searchParams.get("limit") || "50", 10); 

    const {manager_id, client_id, task_status, task_date, customer_id, sub_project_id, id } = await request.json();
    // const managerId = manager_id; 

    // if (!manager_id) {
    //   return NextResponse.json({ status: 0, message: "Manager ID is required" }, { status: apiStatusFailureCode });
    // }

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // Fetch employees under this manager
    const { data: teamMembers, error: teamError } = await supabase
      .from("leap_customer")
      .select("customer_id")
      .eq("manager_id", manager_id);

    if (teamError) {
      return NextResponse.json({ status: 0, message: apiwentWrong, error: teamError }, { status: apiStatusFailureCode });
    }

    if (!teamMembers || teamMembers.length === 0) {
      return NextResponse.json({ status: 1, message: "No employees found under this manager", taskdata: [] }, { status: apiStatusSuccessCode });
    }

    const employeeIds = teamMembers.map(emp => emp.customer_id);

    // Fetch task records for employees under this manager
    let query = supabase
      .from("leap_customer_project_task")
      .select(`*, leap_project_task_types(*), leap_customer(name), leap_client_sub_projects(*), leap_task_status(*), leap_approval_status(*)`)
      .in("customer_id", employeeIds)
      .order("updated_at", { ascending: false })
      // .range(start, end);
       
        if (funISDataKeyPresent(client_id)) {
            query = query.eq('client_id', client_id)
        }
        if (funISDataKeyPresent(task_status)) {
            query = query.eq('task_status', task_status)
        }
        if (funISDataKeyPresent(task_date)) {
            query = query.eq('task_date', task_date)
        }
        if (funISDataKeyPresent(customer_id)) {
            query = query.eq('customer_id', customer_id)
        }
       
        if (funISDataKeyPresent(sub_project_id)) {
            query = query.eq('sub_project_id', sub_project_id)
        }
        if (funISDataKeyPresent(id))  {
            query = query.eq('id', id)
        }
    const { data: task, error: taskError } = await query;

    if (taskError) {
      return NextResponse.json({ status: 0, message: taskUpdateFailed, error: taskError }, { status: apiStatusFailureCode });
    }

    return NextResponse.json({ message: "All Team Tasks",  status: 1, taskdata: task }, { status: apiStatusSuccessCode });

  } catch (error) {
    return funSendApiException(error);
  }
}

