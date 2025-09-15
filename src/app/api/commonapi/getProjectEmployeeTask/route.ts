import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funSendApiErrorMessage, funSendApiException, getFirstDateOfYear, getLastDateOfYear } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funGetClientHolidayList } from "@/app/pro_utils/constantFunGetData";


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
        const formData = await request.formData();
        const fdata = {
            client_id:formData.get('client_id'),
            branch_id:formData.get('branch_id'),
            sub_project_id:formData.get('sub_project_id'),
            customer_id:formData.get('customer_id'),
            task_status:formData.get('task_status'),
            start_date:formData.get('start_date'),
            end_date:formData.get('end_date'),
            platform:formData.get('platform'),
            version:formData.get('version'),
        };
        
        let query = supabase.from("leap_customer_project_task")
            .select('*,leap_customer(name,emp_id,customer_id,leap_client_departments(department_name),leap_client_designations(designation_name),leap_client_branch_details(branch_number,leap_client_working_hour_policy(full_day,half_day))),leap_client_project(*),leap_client_sub_projects(*),leap_task_status(*),leap_project_task_types(*))')
            .gte("task_date",fdata.start_date).lte("task_date",fdata.end_date)
            .eq("client_id",fdata.client_id);
            
        if(fdata.branch_id){
            query=query.eq("branch_id",fdata.branch_id);
        }    
        // if(fdata.project_id){
        //     query=query.eq("leap_customer_project_task.project_id",fdata.project_id);
        // }    
        if(fdata.sub_project_id){
            query=query.eq("sub_project_id",fdata.sub_project_id);
        }
        if(fdata.customer_id){
            query=query.eq("customer_id",fdata.customer_id);
        }
        if(fdata.task_status){
            query=query.eq("task_status",fdata.task_status);
        }
        query = query.order("updated_at", { ascending: false });
        // query = query.order("leap_customer_project_task.updated_at", { referencedTable: "leap_customer_project_task", ascending: false });

        console.log(query);
            
        const {data:taskData, error: upcomingError } = await query;
        if (upcomingError) {
            return funSendApiErrorMessage("Failed to add holiday",upcomingError);
        }
        // const groupedData = Object.values(taskData.reduce((acc, task) => {
        //     const customerId = task.leap_customer?.customer_id;
    
        //     if (!customerId) return acc; // Ignore tasks without a valid customer_id
    
        //     // If customer does not exist in acc, create an entry
        //     if (!acc[customerId]) {
        //         acc[customerId] = {
        //             customer: task.leap_customer, // Store customer details
        //             tasks: [] // Initialize empty task list
        //         };
        //     }
    
        //     // Add the task under the respective customer
        //     acc[customerId].tasks.push(task);
        //     return acc;
        // }, {}));
        // taskData.sort((a, b) => {
        //     let maxA = Math.max(
        //       ...a.leap_customer_project_task.map((task) => new Date(task.updated_at).getTime()),
        //       0 // If no tasks, fallback to 0
        //     );
        //     let maxB = Math.max(
        //       ...b.leap_customer_project_task.map((task) => new Date(task.updated_at).getTime()),
        //       0
        //     );
        //     return maxB - maxA; // Sort in descending order (most recent first)
        //   });
    

        return NextResponse.json({ status: 1, message: "Task List",data: taskData },
            { status: apiStatusSuccessCode });

    } catch (error) {

        console.log("holiday add exception-------",error);
        
        return funSendApiException(error);

    }

}

