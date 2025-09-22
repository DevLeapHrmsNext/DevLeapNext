// // in this api as i have already fetching the notification type, but also i want to check if it is enabled or disabled for a user. will pass customer_id and fetch the status from leap_client_employee_permissions table. also if there is no entry then by default it is enabled
// import { NextRequest, NextResponse } from "next/server";
// import { formatDateYYYYMMDD, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
// import supabase from "../../supabaseConfig/supabase";
// import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";

// export async function POST(request: NextRequest) {

//     try {
//         const {} = await request.json();

//         let query = supabase.from('leap_client_employee_permission_types')
//             .select('emp_permission_id, permission_name')
//             .eq('type_id', 9);

//         const { data: notiData, error: notiError } = await query;
//         if (notiError) {
//             return funSendApiErrorMessage(notiError, "Failed to fetch");
//         }
//         return NextResponse.json({ status: 1, message: "Notification type data fetched", data: notiData }, { status: apiStatusSuccessCode })

//     } catch (error) {
//         return funSendApiException(error);
//     }
// }
import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
  try {
    const { customer_id } = await request.json();

    if (!customer_id) {
      return funSendApiErrorMessage("Missing customer_id", "Invalid Request");
    }

    // 1️⃣ Fetch all notification types
    const { data: notiTypes, error: notiError } = await supabase
      .from("leap_client_employee_permission_types")
      .select("emp_permission_id, permission_name")
      .eq("type_id", 9);

    if (notiError) {
      return funSendApiErrorMessage(notiError, "Failed to fetch notification types");
    }

    // 2️⃣ Fetch user's saved permissions (if any)
    const { data: userPermissions, error: permError } = await supabase
      .from("leap_client_employee_permissions")
      .select("permission_id, is_allowed")
      .eq("customer_id", customer_id);

    if (permError) {
      return funSendApiErrorMessage(permError, "Failed to fetch user permissions");
    }

    // 3️⃣ Merge: for each notification type, check if entry exists in userPermissions
    const result = notiTypes.map((type) => {
      const found = userPermissions?.find(
        (perm) => perm.permission_id === type.emp_permission_id
      );

      return {
        ...type,
        is_allowed: found ? found.is_allowed : true, // default true if no entry
      };
    });

    return NextResponse.json(
      { status: 1, message: "Notification type data fetched", data: result },
      { status: apiStatusSuccessCode }
    );
  } catch (error) {
    return funSendApiException(error);
  }
}