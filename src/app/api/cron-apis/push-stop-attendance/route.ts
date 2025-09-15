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
            .eq("date", now.toISOString().split("T")[0]);
        if (error) return new Response('Error fetching attendance', {
            status: 500
        });
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
                
                if (workingPolicy && diffMinutes > workingPolicy.full_day) {

                    const formData = new FormData();
                    formData.append("customer_id", String(attendance.customer_id));
                    formData.append("title", "Attendance Alert");
                    formData.append("notify_type", "1");// its 1 for attendance alert in leap_push_notification_types table
                    formData.append("message", "Your working hours are completed. Please stop your attendance.");
                    formData.append("send_once", "1");// 1 means true
                    const res = await fetch("http://localhost:3000/api/sendPushNotification", {
                        method: "POST",
                        body: formData
                    });
                }
            }
        }
        return new Response(JSON.stringify({ message: "Cron job executed successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error executing cron job:", error);
        return new Response(JSON.stringify({ error: "Error executing cron job" }), { status: 500 });
    }

}