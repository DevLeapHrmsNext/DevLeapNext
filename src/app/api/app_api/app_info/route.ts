import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funloggedInAnotherDevice, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funGetMyLeaveBalance, isAuthTokenValid } from "@/app/pro_utils/constantFunGetData";
import { platform } from "os";


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
        const {customer_id, role_id, platform, auth_token, version} = await request.json();
        // const fdata = {

        //     customer_id: formData.get('customer_id'),
        //     role_id: formData.get('role_id'),
        //     platform: formData.get('platform'),
        //     authToken: formData.get('auth_token'),
        //     version: formData.get('version')
        // };
        // console.log(fdata);
        if(auth_token && customer_id){
            if (!await isAuthTokenValid(platform, customer_id, auth_token)) {
                return funloggedInAnotherDevice()
            }
        }
//  here we get the app version if platform is passed in api and matches ios or android
        let appVersions:any=[];
        
        if(platform && (platform==="android" || platform==="ios")){
            console.log(platform);

            const {data,error} = await supabase
            .from("app_versioning")
            .select("*").eq("platform",platform);
            if (error) {
                console.log(error);
                appVersions=[]
            }else{
                appVersions=data;
            }
        }
//  here we get the customer company info if customer_id is passed in api

        let companyDetails:any=[];
        let permission:any=[];
        if(customer_id){
            const {data,error} = await supabase
            .from("leap_customer")
            .select("auth_token, leap_client(leap_client_basic_info(*))")
            .eq("customer_id", customer_id);

            if (error) {
                return funSendApiErrorMessage(error,"Unable to get user");
            }else{
                companyDetails=data;
            }
        
        const {data:DashboardPermission,error:perError} = await supabase.from("leap_client_employee_permissions")
            .select('*,leap_client_employee_permission_types(*)')
            .eq("customer_id",customer_id)
            console.log(DashboardPermission);
            if (perError) {
                return funSendApiErrorMessage(error,"Unable to get user permissions");
            }
            const permission = DashboardPermission?.filter(permission =>
                permission.leap_client_employee_permission_types?.permission_name === "Dashboard"
              );
        }
// here we create the result api response data into a single object
        let appInfoResult: any;
        if (customer_id) {
            appInfoResult = {
                platform: appVersions[0]?.platform,
                version: appVersions[0]?.app_version,
                force_update: appVersions[0]?.force_update,
                live_app_url: appVersions[0]?.app_url,
                client_id: companyDetails[0]?.leap_client?.leap_client_basic_info[0]?.client_id,
                auth_token: companyDetails[0]?.auth_token,
                company_logo: companyDetails[0]?.leap_client?.leap_client_basic_info[0]?.company_logo,
                company_name: companyDetails[0]?.leap_client?.leap_client_basic_info[0]?.company_name,
                compnay_websit: companyDetails[0]?.leap_client?.leap_client_basic_info[0]?.compnay_websit,
                primary_color: companyDetails[0]?.leap_client?.leap_client_basic_info[0]?.primary_color,
                secondary_color: companyDetails[0]?.leap_client?.leap_client_basic_info[0]?.secondary_color,
                show_dashboard: permission && permission.length > 0 ? permission[0].is_allowed : true,
                appBgImg:  "https://v2.leaphrms.com/images/user/app_bg_img.png"
            };
        } else {
            appInfoResult = {
                platform: appVersions[0]?.platform,
                version: appVersions[0]?.app_version,
                force_update: appVersions[0]?.force_update,
                live_app_url: appVersions[0]?.app_url,
                appBgImg:  "https://v2.leaphrms.com/images/user/app_bg_img.png"
            } ;
        }

        return NextResponse.json({
                status: 1, message: "App Info",
                data: //appVersions,companyDetails,
                                  appInfoResult

            },
            { status: apiStatusSuccessCode });

    } catch (error) {
        return funSendApiException(error);
    }
}