
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

    // Helper function to group by date
    function groupByDate(activities: any[]) {
        return activities.reduce((acc, activity) => {
            const dateKey = formatDateYYYYMMDD(activity.created_at); // "2025-09-19"
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(activity);
            return acc;
        }, {});
    }

    if (role_id === 5) {
        try {
            let qwery = supabase.from("leap_client_useractivites")
                .select(`customer_id,activity_details,created_at,activity_type_id(id, activity_type )`)
                .eq('client_id', client_id)
                .eq('customer_id', customer_id)
                .gte("created_at", startOfRange)
                .lt("created_at", endOfRange)
                .order('id', { ascending: false });

            const { data: userActivities, error } = await qwery;
            if (error) return funSendApiException(error);

            const userNotiActivities = userActivities.map(a => ({ ...a, type: "user" }));
            const groupedData = groupByDate(userNotiActivities);

            return NextResponse.json({ 
                status: 1, 
                message: "Notifications fetched successfully", 
                data: groupedData 
            }, { status: 200 });

        } catch (error) {
            return funSendApiException(error);
        }
    } else {
        try {
            const { data: subordinates, error: subError } = await supabase
                .from("leap_customer")
                .select("customer_id")
                .eq("manager_id", customer_id);
            if (subError) return funSendApiException(subError);

            const subordinateIds = subordinates.map((s) => s.customer_id);

            const { data: teamActivities, error: error1 } = await supabase
                .from("leap_client_useractivites")
                .select(`created_at, customer_name, activity_type_id(id, activity_type), activity_details, activity_related_id`)
                .in("customer_id", subordinateIds)
                .gte("created_at", startOfRange)
                .lte("created_at", endOfRange)
                .order("id", { ascending: false });

            if (error1) return funSendApiException(error1);

            const { data: userActivities, error } = await supabase
                .from("leap_client_useractivites")
                .select(`customer_id, activity_details, activity_type_id(activity_type), created_at`)
                .eq("client_id", client_id)
                .eq("customer_id", customer_id)
                .eq("user_notify", true)
                .gte("created_at", startOfRange)
                .lte("created_at", endOfRange)
                .order("id", { ascending: false });

            if (error) return funSendApiException(error);

            const userNotiActivities = userActivities.map(a => ({ ...a, type: "user" }));
            const teamNotiActivities = teamActivities.map(a => ({ ...a, type: "team" }));

            const mergedActivities = [...userNotiActivities, ...teamNotiActivities]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            const groupedData = groupByDate(mergedActivities);

            return NextResponse.json({ 
                status: 1, 
                message: "Notifications fetched successfully", 
                data: groupedData 
            }, { status: 200 });

        } catch (error) {
            return funSendApiException(error);
        }
    }
}