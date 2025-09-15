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
            
        }
        console.log(fdata);
        

        let query =null;
        if(fdata.projectID=='' || fdata.projectID== null){
            console.log('hello ---------------------------------------');
            
           query= supabase.from('leap_client_project').select('*')
            .eq('client_id',fdata.clientID)
            if(fdata.branchID && fdata.branchID != 'null'){
                console.log('hello---------------branch id--------------------------');
                query=query.eq('branch_id',fdata.branchID)
            }
        }else{
            console.log('niklo-----------------------------------------');
            
            query= supabase.from('leap_client_project').select('*,leap_client_sub_projects(*)')
            .eq('client_id',fdata.clientID)
            .eq('project_id',fdata.projectID)

            if(fdata.branchID && fdata.branchID != 'null'){
                console.log('niklo-----------branch id------------------------------');
                query=query.eq('branch_id',fdata.branchID)
            }
            console.log(fdata.departmentID);
            
            if(fdata.departmentID && fdata.departmentID!='null'){
                console.log('niklo----------department id-------------------------------');
                query=query.eq('leap_client_sub_projects.department_id',fdata.departmentID)
            }
        }
        
        
        const {data:allProject,error}=await query!;
        
        if (error) {
            return funSendApiErrorMessage(error, "Failed to add project details");
        }
        return NextResponse.json({ status: 1, message: " Sub Project Successfully", data: allProject}, { status: apiStatusSuccessCode })
        

    } catch (error) {


        return funSendApiException(error);

    }
}