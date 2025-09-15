import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";


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

            
            customer_id: formData.get("customer_id"),
            branch_id: formData.get("branch_id"),
            designation_id: formData.get("designation_id"),
            department_id: formData.get("department_id"),
            teamLead_id: formData.get("teamLead_id"),
            manager_id: formData.get("manager_id"),
            userrole_id: formData.get("userrole_id"),
            
        };
        // console.log(fdata);
        

        let query= supabase.from("leap_customer")
            .update({
                manager_id:fdata.manager_id,
                designation_id:fdata.designation_id,
                branch_id:fdata.branch_id,
                department_id:fdata.department_id,
                user_role:fdata.userrole_id,
                // user_role:fdata.teamLead_id,
            })
            .eq('customer_id', fdata.customer_id);
         
        const { data: customerData, error } = await query;
        
        if (error) {
            return funSendApiErrorMessage(error, "Unable to fetch users");
        }
      return NextResponse.json({ status: 1, message: "Customer Updated Successfully" }, { status: apiStatusSuccessCode });

    } catch (error) {
        return funSendApiException(error);

    }

}

