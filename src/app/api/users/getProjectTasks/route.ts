// Project Manager can view their project members Tasks

import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong, taskUpdateFailed } from "@/app/pro_utils/stringConstants";
import { funSendApiException, funISDataKeyPresent } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10); 
    const pageSize = parseInt(searchParams.get("limit") || "50", 10); 

    const {project_manager_id, client_id, branch_id, task_status, task_date, customer_id, project_id, sub_project_id, id} = await request.json();
    const managerId = project_manager_id; 

    if (!managerId) {
      return NextResponse.json({ status: 0, message: "Manager ID is required" }, { status: apiStatusFailureCode });
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // Fetch projects under this manager
    const { data: projectName, error: teamError } = await supabase
      .from("leap_client_sub_projects")
      .select("project_id")
      .eq("project_manager_id", managerId);

    if (teamError) {
      return NextResponse.json({ status: 0, message: apiwentWrong, error: teamError }, { status: apiStatusFailureCode });
    }

    if (!projectName || projectName.length === 0) {
      return NextResponse.json({ status: 1, message: "No Project found under this manager", taskdata: [] }, { status: apiStatusSuccessCode });
    }

    const subprojectIds = projectName.map(emp => emp.project_id);

    // Fetch task records for employees under this manager
    let query = supabase
      .from("leap_customer_project_task")
      .select(`*, leap_project_task_types(task_type_name), leap_customer(name), leap_client_sub_projects(sub_project_name), leap_task_status(*), leap_approval_status(*)`)
      .in("sub_project_id", subprojectIds)
      .order("updated_at", { ascending: false })
      .range(start, end);

        if (funISDataKeyPresent(client_id)) {
            query = query.eq('client_id', client_id)
        }
        if (funISDataKeyPresent(branch_id)) {
          query = query.eq('branch_id', branch_id)
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
        if (funISDataKeyPresent(project_id)) {
            query = query.eq('project_id', project_id)
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

    return NextResponse.json({ message: "All Project Tasks",  status: 1, taskdata: task }, { status: apiStatusSuccessCode });

  } catch (error) {
    return funSendApiException(error);
  }
}

