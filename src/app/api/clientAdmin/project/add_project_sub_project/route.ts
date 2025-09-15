
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException, clientAssetSuccess, apiStatusFailureCode, apiwentWrong, clientSalaryComponentSuccess, clientAddProjectSuccess,  } from "@/app/pro_utils/stringConstants";
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
        project_id:fields.project_id[0],
        projectName:fields.project_name[0],
        clientName: fields.clientName[0],
        projectTypeID: fields.projectTypeID[0],
        managerID: fields.managerID[0],
        teamLeadID: fields.teamLeadID[0],
        project_details: fields.project_details[0],
        techStacks: fields.tech_stacks[0] as string,
        start_date: fields.start_date[0],
        end_date: fields.end_date[0],
        departmentID: fields.departmentID[0],
        project_color_code: fields.project_color_code[0],
    }
    

    let fileUploadResponse;
        if(files && files.file && files.file.length>0){
              fileUploadResponse=await apiUploadDocs(files.file[0],fields.branch_id[0],fields.client_id,"client_project_logo")
          
        }
        const {data:projectData,error} =  await supabase.from("leap_client_project")
    .insert({
        client_id:fdata.client_id,
        branch_id:fdata.branch_id,
        project_name:fdata.projectName,
        project_client:fdata.clientName,
        project_manager_id:fdata.managerID,
        // team_lead_id:fdata.teamLeadID,
        project_status:1,
        project_logo:fileUploadResponse ? fileUploadResponse : "",
        project_color_code:fdata.project_color_code,
        project_type_id:fdata.projectTypeID,
        created_at:new Date()
    }).select('project_id'); 

    if(error){
        return funSendApiErrorMessage(error,"Failed to add project")
    }


    let techStackArray: number[]=[]
        if(fdata.techStacks && fdata.techStacks.toString().includes(',')){
            
            const techStacks=fdata.techStacks!.toString().split(',');
            for(let i=0;i<techStacks.length;i++){
                techStackArray.push(parseInt(techStacks[i]));
            }
            
            
        }else if(fdata.techStacks && !fdata.techStacks.toString().includes(',')){
            techStackArray.push(parseInt(fdata.techStacks));
        }
        console.log("projectData[0].project_id",projectData[0].project_id);
        
      const  {data:subProject,error:subError} =  await supabase.from("leap_client_sub_projects")
        .insert({
            client_id:fdata.client_id,
            branch_id:fdata.branch_id,
            project_id:projectData[0].project_id,
            sub_project_name:fdata.projectName,
            project_manager_id:fdata.managerID,
            start_date:fdata.start_date,
            end_date:fdata.end_date,
            department_id:fdata.departmentID,
            sub_project_status:1,
            project_details:fdata.project_details,
            tech_stacks:techStackArray,
            project_type_id:fdata.projectTypeID,
            created_at:new Date()
        });
    
    // if(fdata.isSubProject=="true"){
    //     let techStackArray: number[]=[]
    //     if(fdata.techStacks && fdata.techStacks.toString().includes(',')){
            
    //         const techStacks=fdata.techStacks!.toString().split(',');
    //         for(let i=0;i<techStacks.length;i++){
    //             techStackArray.push(parseInt(techStacks[i]))
    //         }
            
            
    //     }
        
        
    //     query =  supabase.from("leap_client_sub_projects")
    //     .insert({
    //         client_id:fdata.client_id,
    //         branch_id:fdata.branch_id,
    //         project_id:fdata.project_id,
    //         sub_project_name:fdata.projectName,
    //         project_manager_id:fdata.managerID,
    //         start_date:fdata.start_date,
    //         end_date:fdata.end_date,
    //         department_id:fdata.departmentID,
    //         sub_project_status:1,
    //         project_details:fdata.project_details,
    //         tech_stacks:techStackArray,
    //         project_type_id:fdata.projectTypeID,
    //         created_at:new Date()
    //     });
    // }
    // else{
    //     let fileUploadResponse;
    //     if (files && files.file && files.file[0] )  {
    //           const uploadedFile = files.file[0];
    //           const fileBuffer = await fs.readFile(uploadedFile.path);
    //           const fileBlob = new Blob([fileBuffer], { type: uploadedFile.headers["content-type"] });
    //           const formData = new FormData();
    //           formData.append("client_id", fields.client_id[0]);
    //           formData.append("customer_id", '');
    //           formData.append("docType", "project");
    //           formData.append("file", fileBlob, uploadedFile.originalFilename);
    //           const fileUploadURL = await fetch(process.env.NEXT_PUBLIC_UPLOAD_IMAGE_BASE_URL + "/api/UploadFiles", {
    //             method: "POST",
    //             // headers:{"Content-Type":"multipart/form-data"},
    //             body: formData,
    //           });
    //            fileUploadResponse = await fileUploadURL.json();
    //           // if (fileUploadResponse.error) {
    //           //   return NextResponse.json({ error: "File upload api call error : " + fileUploadResponse.error }, { status: 500 });
    //           // }
    //         }
    //     query =  supabase.from("leap_client_project")
    //     .insert({
    //         client_id:fdata.client_id,
    //         branch_id:fdata.branch_id,
    //         project_name:fdata.projectName,
    //         project_client:fdata.clientName,
    //         project_manager_id:fdata.managerID,
    //         team_lead_id:fdata.teamLeadID,
    //         project_status:1,
    //         project_logo:fileUploadResponse! ? fileUploadResponse.documentURL : "",
    //         project_color_code:fdata.project_color_code,
    //         project_type_id:fdata.projectTypeID,
    //         created_at:new Date()
    //     }); 
    // }
    
    if(subError){
        console.log("subError",subError);
        
        return funSendApiErrorMessage(subError,"Failed to add sub project")
    }

    return NextResponse.json({status:1, message: clientAddProjectSuccess}, { status: apiStatusSuccessCode });
    
}catch(error){
    console.log(error);
    return funSendApiException(error);
}
}