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
        async function sendUsersAnnouncement(roleid: any, branchid: any) {
            const role_id = roleid;
            const branch_id = branchid;

            let today = dashedDateYYYYMMDD(new Date());


            const { data: previousAnnouncementData, error: previousError } = await supabase
                .from('leap_show_announcement_users')
                .select(`
                        leap_client_announcements!inner( announcement_id,announcement_date,announcement_image,announcement_title,announcement_details)
                    `)
                .eq('role_id', role_id)
                .eq('client_id', client_id)
                .eq('branch_id', branch_id)
                .eq("leap_client_announcements.isEnabled", true)
                .eq("leap_client_announcements.isDeleted", false)
                .lt('leap_client_announcements.validity_date', today);

            if (previousError) {
                return funSendApiErrorMessage(previousError, "Unable to fetch announcement data");
            }
            const { data: activeAnnouncementData, error: activeError } = await supabase
                .from('leap_show_announcement_users')
                .select(`
                        leap_client_announcements!inner( announcement_id,announcement_date,announcement_image,announcement_title,announcement_details)
                    `)
                .eq('role_id', role_id)
                .eq('client_id', client_id)
                .eq('branch_id', branch_id)
                .gte('leap_client_announcements.announcement_date', today)
                .order('validity_date', { foreignTable: 'leap_client_announcements', ascending: true });


            if (activeError) {
                return funSendApiErrorMessage(activeError, "Failed to get announcement");
            }
            return NextResponse.json({ status: 1, message: "User Announcement", activeData: activeAnnouncementData, previousData: previousAnnouncementData }, { status: apiStatusSuccessCode })
        }
        return sendUsersAnnouncement(role_id, branch_id)
    } catch (error) {
        return funSendApiException(error);
    }
}



