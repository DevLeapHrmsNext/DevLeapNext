import { NextRequest, NextResponse } from "next/server";
import { formatDateYYYYMMDD, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";

export async function POST(request: NextRequest) {

    const { client_id, customer_id, role_id } = await request.json();
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 90);

    const startOfRange = startDate.toISOString();
    const endOfRange = today.toISOString();
    if (role_id === 5) {
        try {
            // const today = new Date();
            // const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
            // const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
            let qwery = supabase.from("leap_client_useractivites")
                .select(`customer_id,activity_details,activity_type_id(id, activity_type )`)
                .eq('client_id', client_id)
                .eq('customer_id', customer_id)
                // .eq("user_notify", true)
                .gte("created_at", startOfRange)
                .lt("created_at", endOfRange);

            qwery = qwery.order('id', { ascending: false });
            const { data: userActivities, error } = await qwery;

            if (error) {
                console.log(error);
                return funSendApiException(error);
            }
            const userNotiActivities = userActivities.map(a => ({ ...a, type: "user" }));
            return NextResponse.json({ status: 1, message: "Notifications fetched successfully", data: userNotiActivities }, { status: 200 });
        } catch (error) {
            return funSendApiException(error);
        }
    } else {
        try {
            const { data: subordinates, error: subError } = await supabase
                .from("leap_customer")
                .select("customer_id")
                .eq("manager_id", customer_id);
            if (subError) {
                console.log(subError);
                return funSendApiException(subError);
            }
            const subordinateIds = subordinates.map((s) => s.customer_id);
            // const today = new Date();
            // const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
            // const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
            const { data: teamActivities, error: error1 } = await supabase
                .from("leap_client_useractivites")
                .select(`created_at, customer_name, activity_type_id(id, activity_type), activity_details, activity_related_id, activity_related_id`)
                // .select(`*, leap_user_activity_type(*)`)
                .in("customer_id", subordinateIds)
                // .eq("user_notify", true)
                .gte("created_at", startOfRange)
                .lte("created_at", endOfRange)
                .order("id", { ascending: false });

            if (error1) {
                console.log(error1);
                return funSendApiException(error1);
            }
            const { data: userActivities, error } = await supabase
                .from("leap_client_useractivites")
                .select(`customer_id, activity_details, activity_type_id(activity_type), created_at`)
                .eq("client_id", client_id)
                .eq("customer_id", customer_id)
                .eq("user_notify", true)
                .gte("created_at", startOfRange)
                .lte("created_at", endOfRange)
                .order("id", { ascending: false });

            if (error) {
                console.log(error);
                return funSendApiException(error);
            }
            const userNotiActivities = userActivities.map(a => ({ ...a, type: "user" }));
            const teamNotiActivities = teamActivities.map(a => ({ ...a, type: "team" }));

            const mergedActivities = [...userNotiActivities, ...teamNotiActivities]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            return NextResponse.json({ status: 1, message: "Notifications fetched successfully", data: mergedActivities }, { status: 200 });

        } catch (error) {
            return funSendApiException(error);
            
        }
    }
}