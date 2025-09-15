import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";

export async function POST(request: NextRequest) {

    try {
        const now = new Date();
        //   const { data: attendances, error } = await supabase.from('leap_customer_attendance').select('attendance_id, customer_id, in_time, leap_customer!leap_customer_attendance_employee_id_fkey(branch_id)').eq('date', now.toISOString().split('T')[0]);

        const { data: attendances, error } = await supabase
            .from("leap_customer_attendance")
            .select(
                "attendance_id, customer_id, pause_start_time,if_paused, leap_customer!leap_customer_attendance_employee_id_fkey(branch_id)"
            )
            .eq("if_paused", true)
            .eq("date", now.toISOString().split("T")[0]);
        if (error) {
            console.log("Error fetching attendance:", error);

            return NextResponse.json({ message: 'Error fetching attendance', status: 0 }, {
                status: 500
            });
        }

        if(attendances && attendances.length!==0){
        for (const attendance of attendances) {
            const arr: string[] | undefined = attendance.pause_start_time;

            if (!Array.isArray(arr) || arr.length === 0) continue;

            // ✅ get last element
            const lastRaw = arr[arr.length - 1];

            const parsed = parsePossiblyIso(lastRaw);
            if (!parsed) continue;

            const correctedPauseStart = normalizeIfLikelySavedAsLocalButMarkedUTC(parsed);

            const diffMs = now.getTime() - correctedPauseStart.getTime();
            const diffSeconds = Math.floor(diffMs / 1000);
            const diffMinutes = Math.floor(diffSeconds / 60);
            const diffHours = Math.floor(diffMinutes / 60);

            


            if (diffMinutes>40) {

                const formData = new FormData();
                formData.append("customer_id", String(attendance.customer_id));
                formData.append("title", "Attendance Alert");
                formData.append("notify_type", "1");// its 1 for attendance alert in leap_push_notification_types table
                formData.append("message", "Don't forget to resume your attendance.");
                formData.append("send_once", "1");// 1 means true
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendPushNotification`, {
                    method: "POST",
                    body: formData
                });
                console.log(res);
                
                
            }
        }
        return NextResponse.json({ message: 'Cron job executed successfully', status: 1 }, {
            status: 200
        });
    }else{
        return NextResponse.json({ message: 'No paused attendance found', status: 0 }, {
            status: 200
        });     
    }

    } catch (error) {
        console.error("Error executing cron job:", error);
        return new Response(JSON.stringify({ error: "Error executing cron job" }), { status: 500 });
    }

}


// Helpers
const parsePossiblyIso = (s?: string | null): Date | null => {
    if (!s) return null;
    let str = s.trim();

    // Normalize common formats: "YYYY-MM-DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm:ss"
    if (!str.includes("T") && str.includes(" ")) str = str.replace(" ", "T");

    // If it contains timezone or Z, Date() will respect it.
    // If not, Date() will usually treat it as local (engine-dependent), so we try a few fallbacks.
    const d1 = new Date(str);
    if (!isNaN(d1.getTime())) return d1;

    const d2 = new Date(str + "Z"); // force-UTC fallback
    if (!isNaN(d2.getTime())) return d2;

    return null;
};

const normalizeIfLikelySavedAsLocalButMarkedUTC = (d: Date): Date => {
    const now = Date.now();

    // If the parsed date is in the future by more than 1 minute, it's suspicious.
    // Heuristic: assume it was intended as local time but was stored as UTC (common mistake).
    const FUTURE_THRESHOLD_MS = 60 * 1000; // 1 minute
    if (d.getTime() - now > FUTURE_THRESHOLD_MS) {
        // localOffsetMs = +5.5h for IST -> ( -getTimezoneOffset ) * 60 * 1000
        const localOffsetMs = -new Date().getTimezoneOffset() * 60 * 1000;
        // Shift the parsed UTC time backward by the local offset to get the intended UTC time.
        // Example: stored "2025-09-10T15:10:00+00:00" but intended 15:10 local (IST=+5:30)
        // -> corrected = 15:10UTC - 5.5h = intended UTC.
        return new Date(d.getTime() - localOffsetMs);
    }

    return d;
};


