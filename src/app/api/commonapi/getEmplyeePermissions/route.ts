import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funloggedInAnotherDevice, funSendApiErrorMessage, funSendApiException, getFirstDateOfYear, getLastDateOfYear } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funGetClientHolidayList, isAuthTokenValid } from "@/app/pro_utils/constantFunGetData";


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
            customer_id:formData.get('customer_id'),
            platform:formData.get('customer_id'),
            version:formData.get('customer_id'),
            authToken: formData.get('auth_token'),

        };
        if (!await isAuthTokenValid(fdata.platform, fdata.customer_id, fdata.authToken)) {
              return funloggedInAnotherDevice()
            }
        const {data:permissionsList,error} = await supabase.from("leap_client_employee_permissions")
            .select('*,leap_client_employee_permission_types')
            .eq("customer_id",fdata.customer_id);
        if (error) {
            return funSendApiErrorMessage("Failed to get Permissions",error);
        }
        return NextResponse.json({ status: 1, message: "All Employee Permissions",data:permissionsList },
            { status: apiStatusSuccessCode });

    } catch (error) {

        console.log("get permissions exception-------",error);
        
        return funSendApiException(error);

    }

}

