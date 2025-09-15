import { NextRequest, NextResponse } from "next/server";
import { formatDateYYYYMMDD, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funGetCompanyWorkingHour } from "@/app/pro_utils/constantFunGetData";

export async function POST(request: NextRequest) {

    try {
        const { client_id, customer_id, project_id, sub_project_id, id, task_status, task_date } = await request.json();

        let query = supabase.from('leap_customer_project_task')
            .select('*,leap_project_task_types(task_type_name),leap_client_sub_projects(sub_project_name), leap_task_status(status, id), leap_approval_status(id,approval_type)')
            //  .select('id,total_hours, total_minutes, task_details, task_type_id(task_type_id,task_type_name), task_status(id,status), approval_status(id,approval_type),sub_project_id(subproject_id,sub_project_name)')

            .order('updated_at', { ascending: false });

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
        // if (funISDataKeyPresent(project_id)) {
        //     query = query.eq('project_id', project_id)
        // }
        if (funISDataKeyPresent(sub_project_id)) {
            query = query.eq('sub_project_id', sub_project_id)
        }
        if (funISDataKeyPresent(id)) {
            query = query.eq('id', id)
        }
        const { data: TaskData, error: taskError } = await query;

        const { data: assignedTask } = await supabase.from("leap_customer_project_task_assignment")
            .select(
                'sub_project_id(sub_project_name),task_details,task_type_id(task_type_name),task_status(status, id)'
            ).eq('assigned_to', customer_id).eq('task_date', formatDateYYYYMMDD(task_date));
        const myTasks = (TaskData || []).map(task => ({ ...task, type: "mytask" }));
        const assignedTasks = (assignedTask || []).map(task => ({ ...task, type: "assigned" }));

        const allTasks = [...myTasks, ...assignedTasks];

        let totalMinutes = 0;

        allTasks.forEach(task => {
            if (task.total_hours || task.total_minutes) {
                totalMinutes += (task.total_hours || 0) * 60 + (task.total_minutes || 0);
            }
        });

      const totalwork = await funGetCompanyWorkingHour(client_id, 3);
        if (taskError) {
            return funSendApiErrorMessage(taskError, "Failed to add task");
        }
        return NextResponse.json({
            status: 1, message: "All Tasks",workingHour: totalwork, total_minutes: totalMinutes, data: allTasks,
        }, { status: apiStatusSuccessCode })

    } catch (error) {
        return funSendApiException(error);
    }
}
// 