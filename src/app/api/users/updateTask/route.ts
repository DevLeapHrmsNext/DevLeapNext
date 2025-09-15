// here  once the emp starts working on a task and updates its status to start a timer will start  and at the completion of the task the timer will
// end and will calculate the total time taken to complete the task and will record it in the database table 

import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, apiStatusFailureCode } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
  try {
    const {id, task_details, task_status, total_hours, total_minutes} = await request.json();
    // const taskId = formData.get('id');
    // const taskDetails = formData.get('task_details');
    const newTaskStatus = Number(task_status); // Ensure it's a number

    if (!id) {
      return NextResponse.json({ error: "Task ID needed" }, { status: apiStatusInvalidDataCode });
    }

    // Fetch current task data
    const { data: taskData, error: fetchError } = await supabase
      .from('leap_customer_project_task')
      .select('task_status, task_start_time, total_hours, total_minutes')
      .eq('id', id)
      .single();

    if (fetchError || !taskData) {
      return funSendApiErrorMessage(fetchError, "Task Fetch Issue");
    }

    let updateFields: any = {
      task_details: task_details || null,
      task_status: task_status || null,
      total_hours: total_hours || null,
      total_minutes: total_minutes || null,
      updated_at: new Date(),
    };

    const previousTaskStatus = Number(taskData.task_status); // Convert to number
    // here i want to add if the employee is directly changing the status completed then they can themselves input their hours and minutes spent on the task
if (previousTaskStatus !== 2 && newTaskStatus !== 2) {
      updateFields.total_hours = total_hours;
        updateFields.total_minutes = total_minutes;
    }
    else if (previousTaskStatus !== 2 && newTaskStatus === 2) {
      // Task just entered "Working" status
      updateFields.task_start_time = new Date();
    } else if (previousTaskStatus === 2 && newTaskStatus !== 2) {
      // Task was "Working" and is now changing to another status
      if (taskData.task_start_time) {
        const startTime = new Date(taskData.task_start_time);
        const endTime = new Date();
        const elapsedMs = endTime.getTime() - startTime.getTime();

        const totalMinutes = Math.floor(elapsedMs / (1000 * 60));
        const totalHours = Math.floor(totalMinutes / 60);

        updateFields.total_hours = (taskData.total_hours || 0) + totalHours;
        updateFields.total_minutes = (taskData.total_minutes || 0) + (totalMinutes % 60);
        updateFields.task_start_time = null; // Reset task_start_time after calculation
      }
    }

    // Update the task
    const { data, error } = await supabase
      .from('leap_customer_project_task')
      .update(updateFields)
      .eq('id', id)
      .select();

    if (error) {
      return funSendApiErrorMessage(error, "Task Update Issue");
    }

    return NextResponse.json({ status: 1, message: "Task Updated Successfully", data }, { status: apiStatusSuccessCode });

  } catch (error) {
    return funSendApiException(error);
  }
}


// import { NextRequest, NextResponse } from "next/server";
// import supabase from "@/app/api/supabaseConfig/supabase";
// import { apiStatusInvalidDataCode, apiStatusSuccessCode, apiStatusFailureCode, companyUpdatedData, companyUpdateFailed } from "@/app/pro_utils/stringConstants";
// import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const fdata = {
//         id: formData.get('id'),
//         task_details: formData.get('task_details'),
//         task_status: formData.get('task_status'),
//     }
//     if (!fdata.id) {
//       return NextResponse.json({ error: "Company ID needed" },{ status: apiStatusInvalidDataCode }
//       );
//     }
//     const { data, error } = await supabase
//       .from('leap_customer_project_task')
//       .update({
//         task_details: fdata.task_details || null,
//         task_status: fdata.task_status || null,
//         updated_at: new Date(),  
//       })
//       .eq('id', fdata.id)
//       .select();
    
//     if (error) {
//       return funSendApiErrorMessage(error, "Task Update Issue");
//     }
//     if (data) {
//       return NextResponse.json({status:1, message: "Task Added Successfully", data: data }, { status: apiStatusSuccessCode });
//     }else 
//     return NextResponse.json({status:0, message: "Task failure" }, { status: apiStatusFailureCode });
    
//   } catch (error) {
//     return funSendApiException(error);
//   }
// }