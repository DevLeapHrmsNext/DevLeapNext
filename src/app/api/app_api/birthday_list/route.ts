import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funloggedInAnotherDevice, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import {isAuthTokenValid } from "@/app/pro_utils/constantFunGetData";


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
        const {customer_id, client_id, role_id, platform, auth_token, version } = await request.json();
        // const fdata = {

        //     customer_id: formData.get('customer_id'),
        //     client_id: formData.get('client_id'),
        //     role_id: formData.get('role_id'),
        //     platform: formData.get('platform'),
        //     authToken: formData.get('auth_token'),
        //     version: formData.get('version')
        // };
        if (auth_token && customer_id) {
            if (!await isAuthTokenValid(platform, customer_id, auth_token)) {
                return funloggedInAnotherDevice()
            }
        }
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Get month (01-12)
        const day = String(today.getDate()).padStart(2, "0"); // Get day (01-31)

        const { data: birthdayList, error:todayListError } = await supabase.from("leap_all_birthdays")
            .select(`*,leap_customer(name)`)
            .eq('client_id', client_id)
            .neq("customer_id", customer_id)
            .eq("leap_customer.employment_status", true)
            .order("ocassion_date", { ascending: true });
        let todayList:any=[],upcommingList:any=[];
        if (todayListError) {
            return funSendApiErrorMessage(todayListError, "Unable tofetch birthday's for today")
        }else{
            todayList= birthdayList.filter((birthday) => {
                const date = new Date(birthday.ocassion_date);
                return date.getMonth() + 1 === parseInt(month) && date.getDate() === parseInt(day);
              });
            upcommingList= birthdayList.filter((birthday) => {
                const date = new Date(birthday.ocassion_date);
                return date.getMonth() + 1 >= parseInt(month) && date.getDate() >= parseInt(day);
              });
        }

        return NextResponse.json({
            status: 1, message: "Birthday List",
            todayList,upcommingList

        },{ status: apiStatusSuccessCode });

    } catch (error) {


        return funSendApiException(error);

    }

}

