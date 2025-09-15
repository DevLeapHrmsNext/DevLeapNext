import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import {  funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{
        // const { data: user, error: userError } = await supabase.auth.getUser();
    
    
        // // Handle case where the user is not authenticated
        // if (userError || !user) {
        //   return NextResponse.json(
        //     { error: 'User not authenticated' },
        //     { status: 401 }
        //   );
        // }
        const {client_id}  = await request.json();
    
          let query = supabase
          .from("leap_client_sub_projects")
          .select(`subproject_id, sub_project_name`)
          .eq('client_id',client_id);
   
   
          const {data:projectData,error:error}=await query;
          
          if(error){
            return NextResponse.json({ message: apiwentWrong ,error:error}, 
                  { status: apiStatusFailureCode });
          }
          let query1 = supabase
          .from("leap_project_task_types")
          .select(`task_type_id, task_type_name`)
          .eq('client_id',client_id)
          .order('updated_at', { ascending: true });
          
          const {data:TaskTypeData,error:error1}=await query1;
          
          if(error1){
            return NextResponse.json({ message: apiwentWrong ,error:error}, 
                  { status: apiStatusFailureCode });
          }
          
          let query2 = supabase
          .from("leap_task_status")
          .select(`id, status`)
          .eq('is_deleted',false)
          .order('updated_at', { ascending: true });
        
          const {data:TaskStatusData,error:error2}=await query2;
          
          if(error2){
            return NextResponse.json({ message: apiwentWrong ,error:error}, 
                  { status: apiStatusFailureCode });
          }
          let query3 = supabase
          .from("leap_task_priority_level")
          .select(`id, priority_type`)
          .eq('is_deleted',false)
          .order('updated_at', { ascending: true });
        
          const {data:TaskPriorityData,error:error3}=await query3;
          
          if(error3){
            return NextResponse.json({ message: apiwentWrong ,error:error}, 
                  { status: apiStatusFailureCode });
          }
           if(projectData){
            return NextResponse.json({ message: "All Project list" ,status:1 ,data:{projectData , TaskTypeData, TaskStatusData, TaskPriorityData}}, 
                  { status: apiStatusSuccessCode });
          }
  
    }catch(error){
        return funSendApiException(error);
    }
}