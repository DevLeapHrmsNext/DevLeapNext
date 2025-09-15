import { NextRequest, NextResponse } from "next/server";
import { formatDateYYYYMMDD, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";

export async function POST(request: NextRequest) {

    try {
        const {client_id, assigned_to, task_date, task_status, id, branch_id } = await request.json();
        // const fdata = {
        //     clientID: formData.get('client_id'),
        //     assigned_to: formData.get('assigned_to'),
        //     projectId: formData.get('project_id'),
        //     task_date: formData.get('task_date'),
        //     task_status: formData.get('task_status'),
        //     id: formData.get('id')
        // }
        let query = supabase.from('leap_customer_project_task_assignment')
            .select('*, leap_task_priority_level(*), leap_task_status(*), leap_client_sub_projects(sub_project_name),leap_project_task_types(task_type_name),  leap_customer!leap_task_assignment_assigned_by_fkey(name)')
            
            .order('updated_at', {ascending:false});

        if (funISDataKeyPresent(client_id)) {
            query = query.eq('client_id', client_id)
        }
        if (funISDataKeyPresent(branch_id)) {
            query = query.eq('branch_id', branch_id)
        }
        if (funISDataKeyPresent(assigned_to)) {
            query = query.eq('assigned_to', assigned_to)
        }
       
        if (funISDataKeyPresent(task_date)) {
            query = query.eq('task_date', task_date)
        }
        if (funISDataKeyPresent(id))  {
            query = query.eq('id', id)
        }
        // if (funISDataKeyPresent(task_status))  {
        //     query = query.eq('task_status', task_status)
        // }
        console.log(query);

        const { data: TaskData, error: taskError } = await query;
        if (taskError) {
            return funSendApiErrorMessage(taskError, "Failed to get task");
        }
        return NextResponse.json({ status: 1, message: "All Assigned Tasks", data: TaskData }, { status: apiStatusSuccessCode })

    } catch (error) {
        return funSendApiException(error);
    }
}