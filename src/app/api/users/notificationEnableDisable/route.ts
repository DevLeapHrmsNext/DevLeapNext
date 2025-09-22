// here we are enabling or disabling the notification permission for a user, if there is no entry then by default it is enabled(true)
// upsert didnt work as this table doesnt have any unique constraint. 

import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
  try {
    const { client_id, customer_id, permission_id, is_allowed } = await request.json();

    if (!customer_id || !permission_id || typeof is_allowed !== "boolean") {
      return funSendApiErrorMessage("Missing or invalid parameters", "Invalid Request");
    }

    // Check if exists
    const { data: existing, error: fetchError } = await supabase
      .from("leap_client_employee_permissions")
      .select("id")
      .eq("customer_id", customer_id)
      .eq("permission_id", permission_id)
      .maybeSingle();

    if (fetchError) {
      return funSendApiErrorMessage(fetchError, "Failed to check existing permission");
    }

    if (existing) {
      // Update
      const { error: updateError } = await supabase
        .from("leap_client_employee_permissions")
        .update({ is_allowed })
        .eq("id", existing.id);

      if (updateError) {
        return funSendApiErrorMessage(updateError, "Failed to update permission");
      }

      return NextResponse.json(
        { status: 1, message: "Permission updated successfully" },
        { status: apiStatusSuccessCode }
      );
    } else {
      // Insert
      const { error: insertError } = await supabase
        .from("leap_client_employee_permissions")
        .insert([{ client_id, customer_id, permission_id, is_allowed, created_at: new Date() }]);

      if (insertError) {
        return funSendApiErrorMessage(insertError, "Failed to create permission");
      }

      return NextResponse.json(
        { status: 1, message: "Permission updated successfully" },
        { status: apiStatusSuccessCode }
      );
    }
  } catch (exception) {
    return funSendApiException(exception);
  }
}