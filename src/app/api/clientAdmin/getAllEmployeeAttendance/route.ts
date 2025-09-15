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
        const { client_id, branch_id, start_date, end_date, customer_id } = await request.json();
        // const fdata = {

        //     clientID: formData.get('client_id'),
        //     branchID: formData.get('branch_id'),
        //     start_date: formData.get('start_date'),
        //     end_date: formData.get('end_date'),
        //     customer_id: formData.get('customer_id'),
        // };
        // console.log(fdata);

        let attendanceRecord;
        let query = supabase
            .from("leap_customer")
            .select(
                `*, 
      leap_client_designations(*), 
      leap_client_departments(*), 
      leap_customer_attendance!leap_customer_attendance_employee_id_fkey(
        *, 
        leap_customer_attendance_geolocation(*), 
        leap_working_type(*)
      )`
            )
            .eq("client_id", client_id)
            .eq("employment_status", true)
            .neq("user_role", 2)
            .gte("leap_customer_attendance.date", formatDateYYYYMMDD(start_date))
            .lte("leap_customer_attendance.date", formatDateYYYYMMDD(end_date));
        // .order('name', { ascending: true });
        if (customer_id) {
            query = query.eq('customer_id', customer_id);
        }
        console.log("This is the query to get employee attendance--=-==-=-=-=-=-=-=-=-=-=-=-=-", query);
        const { data: attendance, error } = await query;
        if (error) {
            console.log(error);
            return funSendApiErrorMessage(error, "Unable to fetch users");
        }
        if (attendance.length == 0) {
            console.log("record not present");

            let query = supabase
                .from("leap_customer")
                .select(
                    `*, 
                leap_client_designations(*), 
                leap_client_departments(*)    
                )`
                )
                .eq("client_id", client_id)

                .neq("user_role", 2)

            // .order('name', { ascending: true });
            // if(fdata.emp_name){
            //     query=query.ilike('name', '%'+fdata.emp_name+'%');
            // }

            // console.log("attendance not present so query",query);
            if (customer_id) {
                query = query.eq('customer_id', customer_id);
            }

            const { data, error } = await query;
            if (error) {
                console.log(error);

                return funSendApiErrorMessage(error, "Unable to fetch users");
            }
            attendanceRecord = data;

        } else {
            attendanceRecord = attendance;
        }

        const { data: holidayData, error: holidayFetchError } = await supabase.from("leap_holiday_list")
            .select(`*`)
            .eq('client_id', client_id).eq('branch_id', branch_id)
            .gte('date', start_date).lte("date", end_date).order("date", { ascending: true });
        if (holidayFetchError) {
            return funSendApiErrorMessage("Holiday fetch error :- ", holidayFetchError);

        }
        let leaveQuery = supabase
            .from("leap_customer_apply_leave")
            .select(`*,leap_approval_status(approval_type),leap_client_leave(leave_name)`).eq('client_id', client_id).eq('customer_id', customer_id)
            .gte("from_date", dashedDateYYYYMMDD(start_date)).lte("to_date", end_date);
        //  console.log(leaveQuery);

        const { data: appliedLeavedata, error: appliedLeaveError } = await leaveQuery;
        if (appliedLeaveError) {

            return funSendApiErrorMessage("Applied Leave Error :- ", appliedLeaveError);
        }

        return NextResponse.json({ status: 1, message: " All Users", data: attendanceRecord, holidaylist: holidayData, leaveList: appliedLeavedata }, { status: apiStatusSuccessCode });

    } catch (error) {


        return funSendApiException(error);

    }

}


