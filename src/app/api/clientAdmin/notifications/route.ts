
import { NextRequest, NextResponse } from "next/server";
import { formatDateDDMMYYYY, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";

export async function POST(request: NextRequest) {
  const { client_id, customer_id, role_id, type_id } = await request.json();
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 90);

  const startOfRange = startDate.toISOString();
  const endOfRange = today.toISOString();

  function groupByDate(activities: any[]) {
    return activities.reduce((acc, activity) => {
      const dateKey = formatDateDDMMYYYY(activity.created_at);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(activity);
      return acc;
    }, {} as Record<string, any[]>);
  }

  try {
    let activities: any[] = [];

    
      const { data: userActivities, error } = await supabase
        .from("leap_client_useractivites")
        .select(
          `created_at,customer_id, activity_details, activity_type_id(id, activity_type), activity_related_id`
        )
        .eq("client_id", client_id)
        .gte("created_at", startOfRange)
        .lt("created_at", endOfRange)
        .order("id", { ascending: false });

      if (error) return funSendApiException(error);

      activities = userActivities.map((a) => ({ ...a, type: "user" }));
    
    

    const grouped = groupByDate(activities);
    const formattedData = Object.entries(grouped).map(([date, listing]) => ({
      date,
      listing,
    }));

    return NextResponse.json(
      { status: "1", message: "Notification List", data: formattedData },
      { status: 200 }
    );
  } catch (error) {
    return funSendApiException(error);
  }
}