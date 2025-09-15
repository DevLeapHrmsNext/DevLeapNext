import { NextRequest, NextResponse } from "next/server";
import { funDataAddedSuccessMessage, funDataMissingError, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { addUserActivities } from "@/app/pro_utils/constantFunAddData";

export async function POST(request: NextRequest) {

    try {
        // const { data: user, error: userError } = await supabase.auth.getUser();

        // // Handle case where the user is not authenticated
        // if (userError || !user) {
        //   return NextResponse.json(
        //     { error: 'User not authenticated' },
        //     { status: 401 }
        //   );
        // }
        const { client_id, customer_id, task_status, branch_id, sub_project_id, task_type_id, total_hours, total_minutes, task_details, task_date } = await request.json();

        const { data: TaskData, error: taskError } = await supabase.from('leap_customer_project_task')
            .insert({
                client_id: client_id,
                branch_id: branch_id,
                customer_id: customer_id,
                // project_id: project_id,
                sub_project_id: sub_project_id,
                task_type_id: task_type_id,
                task_status: task_status,
                total_hours: total_hours || 0,
                total_minutes: total_minutes || 0,
                task_details: task_details,
                task_date: task_date,
                created_at: new Date().toISOString()
            }).select();
        if (taskError) {
            return funSendApiErrorMessage(taskError, "Failed to add task");
        }
        const addActivity = await addUserActivities(client_id, customer_id, "", "Work task", task_details, TaskData[0].id,false);
        if (addActivity == "1") {
            return funSendApiErrorMessage(addActivity, "Customer Task Activity Insert Issue");
        }
        return NextResponse.json({ status: 1, message: "Task Added Successfully", data: TaskData }, { status: apiStatusSuccessCode })
    } catch (error) {
        return funSendApiException(error);
    }
}
