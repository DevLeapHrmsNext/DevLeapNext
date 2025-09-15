import { NextRequest, NextResponse } from "next/server";
import { funDataAddedSuccessMessage, funDataMissingError, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { addUserActivities } from "@/app/pro_utils/constantFunAddData";
import { FaPray } from "react-icons/fa";

export async function POST(request: NextRequest) {
    try {
        const {client_id, branch_id, assigned_to, project_id, sub_project_id, task_type_id, task_details,
            task_priority, deadline, assigned_by, 
            // task_status
         } = await request.json();

        const { data: TaskData, error: taskError } = await supabase.from('leap_customer_project_task_assignment')
            .insert({
                client_id: client_id,
                branch_id: branch_id,
                assigned_to: assigned_to || null,
                // project_id: project_id || null,
                sub_project_id: sub_project_id || null,
                task_type_id: task_type_id || null,
                task_details: task_details || null,
                task_date: new Date().toISOString(),
                // formatDateYYYYMMDD(new Date())
                task_priority: task_priority || null,
                deadline: deadline || null,
                assigned_by: assigned_by || null,
                created_at: new Date().toISOString()
            }).select();
        if (taskError) {
            return funSendApiErrorMessage(taskError, "Failed to add task");
        }
        const addActivity= await addUserActivities(client_id,assigned_to,"","Work task", task_details, TaskData[0].id,true);
            if(addActivity=="1"){
              return funSendApiErrorMessage(addActivity, "Customer Leave Activity Insert Issue");
            }
        return NextResponse.json({ status: 1, message: "Task Added Successfully", data: TaskData }, { status: apiStatusSuccessCode })
    } catch (error) {
        return funSendApiException(error);
    }
}