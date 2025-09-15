import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

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
        const formData = await request.formData();
        const fdata = {
            clientId:formData.get('client_id') as string,
            branchAddress: formData.get('branch_address') as string,
            branchCity: formData.get('branch_city') as string,
            contactDetails: formData.get('contact_details') as string,
            totalEmployees: formData.get('total_employees') as string,
            branchEmail: formData.get('branch_email') as string,
            branchNumber: formData.get('branch_number') as string,
            isMainBranch: formData.get('is_main_branch') as string,
            createdAt: formData.get('created_at') as string,
            // id: formData.get('id') as string,
            
          }
        
          const { data:branchDetails,error:branchError } = await supabase.from('leap_client_branch_details').insert([
            { client_id: fdata.clientId,
                branch_address: fdata.branchAddress,
                branch_city:fdata.branchCity,
                contact_details:fdata.contactDetails,
                total_employees:fdata.totalEmployees,
                branch_email:fdata.branchEmail,
                branch_number:fdata.branchNumber,
                is_main_branch:fdata.isMainBranch,
                // id:fdata.id,

                created_at: new Date(),
            }]).select();
            
          if(branchError){
            return funSendApiErrorMessage(branchError,"Branch Insert Error");
          }
          const {data:clientData,error:clientError} =await supabase
          .from("leap_client")
          .select(`
            *,
            leap_client_branch_details(*)
          `)
          .eq("client_id", fdata.clientId);
           if(branchDetails && clientData){
            return NextResponse.json({ message: clientAddedSuccess ,clientDetails:clientData[0]}, { status: apiStatusSuccessCode });
          }

  
    }catch(error){
        return funSendApiException(error);
        
    }
}