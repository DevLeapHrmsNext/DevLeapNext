import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { calculateNumMonths, funloggedInAnotherDevice, funSendApiErrorMessage, funSendApiException, getFirstDateOfYearbyDate } from "@/app/pro_utils/constant";
import { isAuthTokenValid } from "@/app/pro_utils/constantFunGetData";

export async function POST(request: NextRequest) {
  let leaveStatusApprovedCount = 0, leaveStatusRejectedCount = 0, leaveStatusPendingCount = 0;
  try {
    // const { data: user, error: userError } = await supabase.auth.getUser();


    // // Handle case where the user is not authenticated
    // if (userError || !user) {
    //   return NextResponse.json(
    //     { error: 'User not authenticated' },
    //     { status: 401 }
    //   );
    // }
    const {client_id, branch_id, customer_id, platform, version, auth_token } = await request.json();
    // const fdata = {
    //   clientId: formData.get('client_id') ,
    //   branch_id: formData.get('branch_id') ,
    //   customer_id: formData.get('customer_id') ,
    //   platform: formData.get('platform') ,
    //   version: formData.get('version') ,
    //   authToken: formData.get('auth_token') ,
      
    // }

    if (!await isAuthTokenValid(platform, customer_id, auth_token)) {
                return funloggedInAnotherDevice()
            }
            let query = supabase
            .from('leap_document_type')
            .select('*,leap_client_documents(*)')
            .eq("document_type_id",1)
            .eq("leap_client_documents.client_id",client_id);

            if(branch_id){
              query=query.eq("leap_client_documents.branch_id",branch_id);
            }
    
            const { data, error } = await query;
    if (error) {
      return funSendApiErrorMessage(error, "Unable to get Documents")
    }
    else {
      const filteredData = data.filter(item => 
        item.leap_client_documents && item.leap_client_documents.length > 0
    );
  //   const processedData = filteredData.map(item => ({
  //     ...item,
  //     leap_customer_documents: item.leap_customer_documents.map((doc) => ({
  //         ...doc,
  //         full_url: `${process.env.NEXT_PUBLIC_BASE_URL}${doc.document_url}` // Concatenating base URL
  //     }))
  // }));
      return NextResponse.json({
        message: "All Documents",
        status: 1,
        data: filteredData

      }, { status: apiStatusSuccessCode })
    }


  } catch (error) {
    return funSendApiException(error);

  }
}