import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funloggedInAnotherDevice, funSendApiErrorMessage, funSendApiException, getFirstDateOfYear, getLastDateOfYear } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funGetClientHolidayList, isAuthTokenValid } from "@/app/pro_utils/constantFunGetData";


export async function POST(request: NextRequest) {

    try {
        
        const {client_id, branch_id, customer_id, id, platform, auth_token, version, show_employee,holiday_year,isadmin } = await request.json();
        
        if (auth_token && customer_id) {
            if (!await isAuthTokenValid(platform, customer_id, auth_token)) {
                return funloggedInAnotherDevice()
            }
        }
        // let query = supabase.from("leap_holiday_list")
        //     .select(`*,holiday_type_id(id, holiday_type),leap_client_branch_details(branch_number),leap_holiday_year(id, list_name, is_deleted, show_employee)`)
        //     .eq('client_id', client_id)
        //     .eq('leap_holiday_year.is_deleted', false);

            let query = supabase
  .from("leap_holiday_list")
  .select(`
    *,
    holiday_type_id ( id, holiday_type ),
    leap_client_branch_details ( branch_number ),
    holiday_year!inner ( id, list_name, is_deleted, show_employee )
  `)
  .eq("client_id", client_id)
  .eq("holiday_year.is_deleted", false);

        if (branch_id ) {
            query = query.eq('branch_id', branch_id);
        }
        if (id ) {
            query = query.eq('id', id);
        }
        if (holiday_year) {
            query = query.eq('holiday_year', holiday_year);
        }else{
            query = query.gte('date', formatDateYYYYMMDD(getFirstDateOfYear())) // `to_date` must be >= `fromDate`
            .lte('date', formatDateYYYYMMDD(getLastDateOfYear()));
        }
        if (show_employee ) {
            query = query.eq('holiday_year.show_employee', true);
        }
        // query = query.gte('date', formatDateYYYYMMDD(getFirstDateOfYear())) // `to_date` must be >= `fromDate`
        //     .lte('date', formatDateYYYYMMDD(getLastDateOfYear())).order('date', { ascending: true });

        query=query.order('date', { ascending: true });

        console.log(query);
        
        const { data: holidayData, error } = await query;
        if (error) {
            return funSendApiErrorMessage("Failed to fetsch Holidays", error);
        }
        // let upcomingQuery = supabase.from("leap_holiday_list")
        //     .select(`id`)
        //     .eq('client_id', fdata.clientID);
        // if (branch_id) {
        //     upcomingQuery = query.eq('branch_id', branch_id);
        // }
        // upcomingQuery = query.gte('date', formatDateYYYYMMDD(new Date())).limit(1);
       


        // const { data: holidayList, error: holidayError } = await query;
        // if (holidayError) {
        //     return funSendApiErrorMessage("failed to get Upcoming holiday",holidayError);
        // }
        
        const holidaysByMonth = holidayData.reduce((acc, holiday) => {
            const monthName = new Date(holiday.date).toLocaleString("en-US", { month: "long" }); // Get month name
            if (!acc[monthName]) {
              acc[monthName] = [];
            }
            acc[monthName].push(holiday);
            return acc;
          }, {});
      
          // **Convert grouped object into an array of objects**
          const formattedHolidays = Object.keys(holidaysByMonth).map((month) => ({
            month: month,
            holidays: holidaysByMonth[month],
          }));
        return NextResponse.json({ status: 1, message: "All Holiday List", data: { totalHolidays: holidayData.length, holidays: platform &&(platform.toLowerCase()=="android"||platform=="ios")?formattedHolidays:holidayData } },
            { status: apiStatusSuccessCode });

    } catch (error) {
        return funSendApiException(error);
    }

}