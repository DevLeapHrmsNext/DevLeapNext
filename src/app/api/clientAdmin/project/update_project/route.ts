
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException, clientAssetSuccess, apiStatusFailureCode, apiwentWrong, clientSalaryComponentSuccess, clientAddProjectSuccess, clientUpdateProjectSuccess,  } from "@/app/pro_utils/stringConstants";
import { calculateNumDays, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";
import { apiUploadDocs } from "@/app/pro_utils/constantFunAddData";


export async function POST(request: NextRequest) {
    console.log("hello api called");
    
    try{
        const { fields, files } = await parseForm(request);

    const fdata = {
        client_id:fields.client_id[0],
        branch_id:fields.branch_id[0],
        isSubProject:fields.isSubProject[0],
        update_project_id:fields.update_project_id[0],
        project_id:fields.project_id[0],
        projectName:fields.project_name[0],
        clientName: fields.clientName[0],
        projectTypeID: fields.projectTypeID[0],
        managerID: fields.managerID[0],
        teamLeadID: fields.teamLeadID[0],
        project_details: fields.project_details[0],
        project_status: fields.project_status[0],
        techStacks: fields.tech_stacks[0],
        start_date: fields.start_date[0],
        end_date: fields.end_date[0],
        project_color_code: fields.project_color_code[0],
        isDeleted: fields.is_deleted[0],
    }
    let query;

    
    console.log(fdata.isSubProject);
    
    if(fdata.isSubProject=="true"){
        let techStackArray: number[]=[]
        if(fdata.techStacks && fdata.techStacks.toString().includes(',')){
            
            const techStacks=fdata.techStacks!.toString().split(',');
            for(let i=0;i<techStacks.length;i++){
                techStackArray.push(parseInt(techStacks[i]))
            }
            
            
        }
        query =  supabase.from("leap_client_sub_projects")
        .update({
            client_id:fdata.client_id,
            branch_id:fdata.branch_id,
            project_id:fdata.project_id,
            sub_project_name:fdata.projectName,
            project_manager_id:fdata.managerID,
            start_date:fdata.start_date,
            end_date:fdata.end_date,
            sub_project_status:fdata.project_status,
            project_type_id:fdata.projectTypeID,
            project_details:fdata.project_details,
            tech_stacks:techStackArray,
            is_deleted: fdata.isDeleted,
            
        }).eq("subproject_id",fdata.update_project_id);
    }
    else{
        let fileUploadResponse;
            if(files && files.file && files.file.length>0){
                  fileUploadResponse=await apiUploadDocs(files.file[0],fields.branch_id[0],fields.client_id,"client_project_logo")
              
            }
        query =  supabase.from("leap_client_project")
        .update({
            client_id:fdata.client_id,
            branch_id:fdata.branch_id,
            project_name:fdata.projectName,
            project_client:fdata.clientName,
            project_manager_id:fdata.managerID,
            team_lead_id:fdata.teamLeadID,
            project_status:fdata.project_status,
            project_logo:fileUploadResponse ? fileUploadResponse : "",
            project_color_code:fdata.project_color_code,
            is_deleted: fdata.isDeleted,
            project_type_id:fdata.projectTypeID,

            
        }).eq("project_id",fdata.update_project_id); 
    }
    console.log(query);
    
    const {error } =await query;
    if(error){
        return funSendApiErrorMessage(error,"Failed to add project")
    }

        return NextResponse.json({status:1, message: clientUpdateProjectSuccess}, { status: apiStatusSuccessCode });
    
}catch(error){
    console.log(error);
    return funSendApiException(error);
}
}