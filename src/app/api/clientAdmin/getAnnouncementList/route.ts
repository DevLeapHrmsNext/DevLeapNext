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
        const { role_id, client_id, branch_id } = await request.json();
        if (role_id! && role_id == "1" || role_id == "2" || role_id == "3") {
            return sendAllAnnouncements(client_id, branch_id)
        } else {
            return sendUsersAnnouncement(role_id, branch_id)
        }
    } catch (error) {
        return funSendApiException(error);
    }
}

async function sendAllAnnouncements(client_id: any, branch_id: any) {
    let query = supabase.from('leap_client_announcements')
        .select('*,leap_show_announcement_users(announcement_id, role_id)')
        .eq('client_id', client_id)
        .eq('branch_id', branch_id)
        // .eq('isEnabled', true)
        // .eq('isDeleted', true);
        .eq("isEnabled", true)
        .eq("isDeleted", false);

    const { data: TaskData, error: taskError } = await query;
    if (taskError) {
        return funSendApiErrorMessage(taskError, "Failed to get announcement");
    }
    return NextResponse.json({ status: 1, message: "All Announcement", data: TaskData }, { status: apiStatusSuccessCode })
}

async function sendUsersAnnouncement(roleid: any, branchid: any) {  
    let alldata: any[] = [];

    const role_id = roleid;
    const branch_id = branchid;

    // const orCondition = `leap_show_announcement_users.designation_id.eq.${designationId},  leap_show_announcement_users.department_id.eq.${departmentID}`;
    // let designationQuery=null;
    // let departmentQuery=null;
    let today = dashedDateYYYYMMDD(new Date());

    const { data: designationData, error: desError } = await supabase
        .from('leap_show_announcement_users')
        .select(`
                leap_client_announcements!inner(*)
            `)
        .eq('role_id', role_id)
        .eq('branch_id', branch_id)
        .eq("leap_client_announcements.isEnabled", true)
        .eq("leap_client_announcements.isDeleted", false)

        .or(
            `send_on_date.eq.${today},and(send_on_date.lte.${today},validity_date.gte.${today})`,
            { foreignTable: 'leap_client_announcements' }
        )
        .order('validity_date', { foreignTable: 'leap_client_announcements', ascending: true });

    if (desError) {
        return funSendApiErrorMessage(desError, "Failed to get announcement");
    }

    
    return NextResponse.json({ status: 1, message: "User Announcement", data: designationData }, { status: apiStatusSuccessCode })

}