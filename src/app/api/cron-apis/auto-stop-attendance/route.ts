import { NextRequest } from "next/server";
import supabase from "../../supabaseConfig/supabase";

export async function POST(request: NextRequest) {

    try {

        const now = new Date();
        //   const { data: attendances, error } = await supabase.from('leap_customer_attendance').select('attendance_id, customer_id, in_time, leap_customer!leap_customer_attendance_employee_id_fkey(branch_id)').eq('date', now.toISOString().split('T')[0]);

        const { data: attendances, error } = await supabase
            .from("leap_customer_attendance")
            .select(
                "attendance_id, customer_id, in_time, leap_customer!leap_customer_attendance_employee_id_fkey(branch_id)"
            )
            .neq("attendanceStatus", 2)
        // .eq("date", now.toISOString().split("T")[0]); wont work for night shifts
        if (error) return new Response('Error fetching attendance', {
            status: 500
        });
        console.log("this is the start time---->", attendances);
        if (attendances) {
            for (const attendance of attendances) {
                const branchId = (attendance.leap_customer as unknown as { branch_id: number }).branch_id;
                if (!branchId) continue;
                const startTime = new Date(attendance.in_time);
                // console.log("this is the start time---->",startTime);
                // console.log("this is the start time ---->",startTime.getTime());
                // console.log("this is the time Now---->",now.getTime());

                const diffMinutes = Math.floor((now.getTime() - startTime.getTime()) / 60000);
                const { data: workingPolicy } = await supabase.from('leap_client_working_hour_policy').select('full_day').eq('branch_id', branchId).single();

                if (workingPolicy) {
                    //  3hr buffer to full day policy
                    const allowedMinutes = workingPolicy.full_day + (3 * 60);

                    if (diffMinutes > allowedMinutes) {
                        const { error: updateError } = await supabase
                            .from("leap_customer_attendance")
                            .update({
                                attendanceStatus: 2,
                                out_time: now.toISOString()
                            })
                            .eq("attendance_id", attendance.attendance_id);

                        if (updateError) {
                            return new Response('Error updating attendance', { status: 500 });
                        }
                    }
                }
            }
        }
        return new Response(JSON.stringify({ message: "Cron job executed successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error executing cron job:", error);
        return new Response(JSON.stringify({ error: "Error executing cron job" }), { status: 500 });
    }

}