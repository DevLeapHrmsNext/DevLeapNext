
// import { NextRequest, NextResponse } from "next/server";
// import { formatDateDDMMYYYY, funSendApiException } from "@/app/pro_utils/constant";
// import supabase from "../../supabaseConfig/supabase";

// export async function POST(request: NextRequest) {
//   const { client_id, customer_id, role_id } = await request.json();
//   const today = new Date();
//   const startDate = new Date();
//   startDate.setDate(today.getDate() - 90);

//   const startOfRange = startDate.toISOString();
//   const endOfRange = today.toISOString();

//   function groupByDate(activities: any[]) {
//     return activities.reduce((acc, activity) => {
//       const dateKey = formatDateDDMMYYYY(activity.created_at);
//       if (!acc[dateKey]) acc[dateKey] = [];
//       acc[dateKey].push(activity);
//       return acc;
//     }, {} as Record<string, any[]>);
//   }

//   try {
//     let activities: any[] = [];

//     if (role_id === "5") {
//       const { data: userActivities, error } = await supabase
//         .from("leap_client_useractivites")
//         .select(
//           `created_at, activity_details, activity_type_id(id, activity_type), activity_related_id`
//         )
//         .eq("client_id", client_id)
//         .eq("customer_id", customer_id)
//         .gte("created_at", startOfRange)
//         .lt("created_at", endOfRange)
//         .order("id", { ascending: false });

//       if (error) return funSendApiException(error);

//       activities = userActivities.map((a) => ({ ...a, type: "user" }));
//     } else {
    
//       const { data: subordinates, error: subError } = await supabase
//         .from("leap_customer")
//         .select("customer_id")
//         .eq("manager_id", customer_id);
//       if (subError) return funSendApiException(subError);

//       const subordinateIds = subordinates.map((s) => s.customer_id);

//       const { data: teamActivities, error: error1 } = await supabase
//         .from("leap_client_useractivites")
//         .select(
//           `created_at, customer_name, activity_type_id(id, activity_type), activity_details, activity_related_id`
//         )
//         .in("customer_id", subordinateIds)
//         .gte("created_at", startOfRange)
//         .lte("created_at", endOfRange)
//         .order("id", { ascending: false });

//       if (error1) return funSendApiException(error1);

//       const { data: userActivities, error } = await supabase
//         .from("leap_client_useractivites")
//         .select(
//           `  created_at, activity_details, activity_type_id(id, activity_type), activity_related_id`
//         )
//         .eq("client_id", client_id)
//         .eq("customer_id", customer_id)
//         .eq("user_notify", true)
//         .gte("created_at", startOfRange)
//         .lte("created_at", endOfRange)
//         .order("id", { ascending: false });

//       if (error) return funSendApiException(error);

//       const userNotiActivities = userActivities.map((a) => ({ ...a, type: "user" }));
//       const teamNotiActivities = teamActivities.map((a) => ({ ...a, type: "team" }));

//       activities = [...userNotiActivities, ...teamNotiActivities].sort(
//         (a, b) =>
//           new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//       );
//     }

//     const grouped = groupByDate(activities);
//     const formattedData = Object.entries(grouped).map(([date, listing]) => ({
//       date,
//       listing,
//     }));

//     return NextResponse.json({ status: "1", message: "Notification List", data: formattedData}, { status: 200 });
//   } catch (error) {
//     return funSendApiException(error);
//   }
// }
//

// type_id 1 -> user, 2 -> team, null -> both
// role_id !5 then only type_id will work ( to be handled in app )

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

    if (role_id === "5") {
      const { data: userActivities, error } = await supabase
        .from("leap_client_useractivites")
        .select(
          `created_at, activity_details, activity_type_id(id, activity_type), activity_related_id`
        )
        .eq("client_id", client_id)
        .eq("customer_id", customer_id)
        .gte("created_at", startOfRange)
        .lt("created_at", endOfRange)
        .order("id", { ascending: false });

      if (error) return funSendApiException(error);

      activities = userActivities.map((a) => ({ ...a, type: "user" }));
    } else {
      let userNotiActivities: any[] = [];
      let teamNotiActivities: any[] = [];

      //only if type_id is 2 or not provided
      if (!type_id || type_id === "2") {
        const { data: subordinates, error: subError } = await supabase
          .from("leap_customer")
          .select("customer_id")
          .eq("manager_id", customer_id);

        if (subError) return funSendApiException(subError);

        const subordinateIds = subordinates.map((s) => s.customer_id);

        if (subordinateIds.length > 0) {
          const { data: teamActivities, error: error1 } = await supabase
            .from("leap_client_useractivites")
            .select(
              `created_at, customer_name, activity_type_id(id, activity_type), activity_details, activity_related_id`
            )
            .in("customer_id", subordinateIds)
            .gte("created_at", startOfRange)
            .lte("created_at", endOfRange)
            .order("id", { ascending: false });

          if (error1) return funSendApiException(error1);

          teamNotiActivities = teamActivities.map((a) => ({ ...a, type: "team" }));
        }
      }

      //only if type_id is 1 or not provided
      if (!type_id || type_id === "1") {
        const { data: userActivities, error } = await supabase
          .from("leap_client_useractivites")
          .select(
            `created_at, activity_details, activity_type_id(id, activity_type), activity_related_id`
          )
          .eq("client_id", client_id)
          .eq("customer_id", customer_id)
          .eq("user_notify", true)
          .gte("created_at", startOfRange)
          .lte("created_at", endOfRange)
          .order("id", { ascending: false });

        if (error) return funSendApiException(error);

        userNotiActivities = userActivities.map((a) => ({ ...a, type: "user" }));
      }

      
      activities = [...userNotiActivities, ...teamNotiActivities].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

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