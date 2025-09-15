import { formatDateYYYYMMDD, funloggedInAnotherDevice, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { isAuthTokenValid } from "@/app/pro_utils/constantFunGetData";
import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { ifError } from "node:assert";
import { format } from 'date-fns'

export async function POST(request: NextRequest) {
  async function getAttendanceRequestData(custID: string, date: any) {
  let query = supabase
    .from("leap_client_employee_requests")
    .select("*")
    .eq("customer_id", custID)
    .eq("type_id", 8) 
    .eq("description", format(date, "yyyy-MM-dd")); // request linked to the specific date

  const { data, error } = await query;

  if (error) {
    return [];
  } else {
    return data;
  }
}
  try {
    const { customer_id, client_id, platform, auth_token, branch_id, date } = await request.json();

    if (!await isAuthTokenValid(platform, customer_id, auth_token)) {
      return funloggedInAnotherDevice();
    }
    const selectedDate = new Date(date); 
    const formattedDate = formatDateYYYYMMDD(selectedDate);
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday

    const { data: attendance, error: attendanceError } = await supabase
      .from("leap_customer_attendance")
      .select("customer_id(name), date, in_time, out_time, paused_duration, pause_start_time, pause_end_time, paused_reasons, img_attachment, total_hours,  working_type_id(type)")
      .eq("customer_id", customer_id)
      .eq("date", formattedDate)
      .maybeSingle();

    if (attendanceError) {
      return funSendApiErrorMessage(attendanceError, "Unable to fetch attendance");
    }


    const { data: leave, error: leaveError } = await supabase
      .from("leap_customer_apply_leave")
      .select("*")
      .eq("customer_id", customer_id)
      .eq("leave_status", 2)
      .lte("from_date", formattedDate)
      .gte("to_date", formattedDate)
      .maybeSingle();

    if (leaveError) {
      return funSendApiErrorMessage(leaveError, "Unable to fetch leave info");
    }


    const { data: holiday, error: holidayError } = await supabase
      .from("leap_holiday_list")
      .select("*")
      .eq("client_id", client_id)
      .eq("branch_id", branch_id)
      .eq("date", formattedDate)
      .maybeSingle();

    if (holidayError) {
      return funSendApiErrorMessage(holidayError, "Unable to fetch holiday");
    }


    let userStatus = "Absent"; 
    let attendanceRequestStatus: string | null = null;

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      userStatus = "Weekend"; 
    } else if (attendance?.in_time) {
      userStatus = "Present";
    } else if (holiday) {
      userStatus = "Holiday";
    }  else if (leave) {
      userStatus = "On Leave";
    } else {
      
      const requests = await getAttendanceRequestData(customer_id, formattedDate);

      if (requests.length > 0) {
        const latestRequest = requests[0];
        if (latestRequest.active_status === 1 || latestRequest.active_status === 2 || latestRequest.active_status === 4) {
          attendanceRequestStatus = "Request Raised Already";
        } else if (latestRequest.active_status === 3) {
          attendanceRequestStatus = "Request Denied";
        }
      }
    }
   

    let breakDetails = [];
   if (
      Array.isArray(attendance?.pause_start_time) &&
      Array.isArray(attendance?.pause_end_time) &&
      Array.isArray(attendance?.paused_reasons)
    ) {
      const count = Math.max(
        attendance.pause_start_time.length,
        attendance.pause_end_time.length,
        attendance.paused_reasons.length
      );

  

      for (let i = 0; i < count; i++) {
         const start = attendance.pause_start_time[i];
        const end = attendance.pause_end_time[i];

        let duration = null;
        if (start && end) {
          const startDate = new Date(start);
          const endDate = new Date(end);
          duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
        }
        breakDetails.push({
          pause_start_time: attendance.pause_start_time[i] || null,
          pause_end_time: attendance.pause_end_time[i] || null,
          paused_duration: duration,
          paused_reasons: attendance.paused_reasons[i] || null
        });
      }
    }

    return NextResponse.json({
      status: 1,
      message: "Attendance Summary",
      data: {
        userStatus,
        attendanceRequestStatus,
        attendance,
        breakDetails,
      },
    }, { status: apiStatusSuccessCode });

  } catch (error) {
    return funSendApiException(error);
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funloggedInAnotherDevice, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
// import supabase from "../../supabaseConfig/supabase";
// import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
// import { funGetMyLeaveBalance, isAuthTokenValid } from "@/app/pro_utils/constantFunGetData";
// import { platform } from "os";

// export async function POST(request: NextRequest) {

//     try {
//         // const { data: user, error: userError } = await supabase.auth.getUser();

//         // // Handle case where the user is not authenticated
//         // if (userError || !user) {
//         //   return NextResponse.json(
//         //     { error: 'User not authenticated' },
//         //     { status: 401 }
//         //   );
//         // }
//         const {customer_id, client_id, start_date, end_date, role_id, platform, auth_token, version, branch_id} = await request.json();
        
//         if (!await isAuthTokenValid(platform, customer_id, auth_token)) {
//             return funloggedInAnotherDevice()
//         }
//         let query = null
//         if(role_id=="4" || role_id=="9"){
//          query=   supabase
//             .from("leap_customer_attendance")
//             .select(`*,leap_customer_attendance_geolocation(*)`)
//             .eq("customer_id", customer_id);
//         }else{
//             query=supabase
//             .from("leap_customer_attendance")
//             .select(`*`)
//             .eq("customer_id", customer_id);
//         }
        

//         if (start_date && end_date) {
//             query = query.gte("date", formatDateYYYYMMDD(start_date))
//                 .lte("date", formatDateYYYYMMDD(end_date));
//         } else if (start_date) {
//             query = query.eq("date", formatDateYYYYMMDD(start_date))

//         } else {
//             query = query.eq("date", formatDateYYYYMMDD(new Date()))

//         }
//         query = query.order('date', { ascending: true });

//         const { data: attendance, error } = await query;

//         if (error) {
//             return funSendApiErrorMessage(error, "Unable to fetch users");
//         }
//         const totalLeaves = await funGetMyLeaveBalance(client_id, branch_id, customer_id, 5);

//         const { data: appliedLeavedata, error: appliedLeaveError } = await supabase
//             .from("leap_customer_apply_leave")
//             .select(`*`).eq('customer_id', customer_id)
//             .order("updated_at", { ascending: false })
//             .limit(5);

//         if (appliedLeaveError) {

//             return funSendApiErrorMessage(appliedLeaveError, "Unable to fetch users");
//         }
//         // const { data: holidayData, error:holidayFetchError } = await supabase.from("leap_holiday_list")
//         // .select(`*`)
//         // .eq('client_id', fdata.clientID).eq('branch_id', fdata.branch_id)
//         // .gte('date', fdata.start_date).lte("date",fdata.end_date).order("date",{ascending:true});
//         //  if(holidayFetchError){
//         //     return funSendApiErrorMessage("Holiday fetch error :- ", holidayFetchError);
//         //  }
//         return NextResponse.json({
//             status: 1, message: " All Users",
//             data: {
//                 attendance,
//                 totalLeaves,
//                 appliedLeavedata,
//                 // holidayData

//             }
//         },
//             { status: apiStatusSuccessCode });

//     } catch (error) {


//         return funSendApiException(error);

//     }

// }

