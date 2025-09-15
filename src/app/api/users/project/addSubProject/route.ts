import { NextRequest, NextResponse } from "next/server";
import { funDataAddedSuccessMessage, funDataMissingError, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";
import supabase from "../../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funAddSubProject } from "@/app/pro_utils/constantFunAddData";

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

            clientID: formData.get('client_id'),
            branchID: formData.get('branch_id'),
            departmentID: formData.get('department_id'),
            projectID: formData.get('project_id'),
            proManagerID: formData.get('project_manager_id'),
            subProjectName: formData.get('sub_project_name'),
            startDate: formData.get('start_date'),
            endDate: formData.get('end_date'),
            
        }
        

        const insertSubProject= await funAddSubProject(fdata.clientID,
            fdata.branchID,
            fdata.departmentID,
            fdata.projectID,
            fdata.subProjectName,
            fdata.startDate,
            fdata.endDate,
            fdata.proManagerID,
        );
        
        if (insertSubProject !=null) {
            return funSendApiErrorMessage(insertSubProject, "Failed to add project details");
        }else{
        return NextResponse.json({ status: 1, message: " Sub Project Added Successfully", }, { status: apiStatusSuccessCode })
        }

    } catch (error) {


        return funSendApiException(error);

    }
}