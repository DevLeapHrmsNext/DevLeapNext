import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { calculateNumDays, formatDateYYYYMMDD, funCalculateTimeDifference, funDataAddedSuccessMessage, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";
import { error } from "console";
import { funGetActivityTypeId, funGetAdminID, funGetLeaveType, funGetSingleColumnValueCustomer } from "@/app/pro_utils/constantFunGetData";
import { addErrorExceptionLog, addUserActivities, apiUploadDocs } from "@/app/pro_utils/constantFunAddData";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // console.log(request);
  // console.log(request);
  let fileUploadResponse;
  try {
    const { fields, files } = await parseForm(request);
    // console.log("------------------------",files);

    if (files && files.file && files.file.length > 0) {
      fileUploadResponse = await apiUploadDocs(files.file[0], fields.customer_id[0], fields.client_id[0], "applied_leave_docs")

    }
    const totalLeaveDays = calculateNumDays(new Date(fields.from_date), new Date(fields.to_date));

    let query = supabase.from("leap_customer_apply_leave")
      .insert({
        client_id: fields.client_id[0],
        customer_id: fields.customer_id[0],
        branch_id: fields.branch_id[0] || null,
        leave_type: fields.leave_type[0],
        from_date: fields.from_date[0],
        to_date: fields.to_date[0],
        total_days: fields.duration[0] == "1" ? fields.duration[0] : fields.duration[0] == "2" ? "0.5" : totalLeaveDays, //1-full day leave,2:half day leave
        leave_status: 1,
        attachments: fileUploadResponse ? fileUploadResponse : "",
        leave_reason: fields.leave_reason[0],
        duration: fields.duration[0] || "Full day",
        created_at: new Date()
      }).select();

    const { data, error } = await query;
    if (error) {
      console.log(error);
      return funSendApiErrorMessage(error, "Customer Apply Leave Insert Issue");
    }

    (async () => {
      let leaveType = "";
      try {
        const leaveType = await funGetLeaveType(fields.leave_type[0]);
        const addActivity = await addUserActivities(fields.client_id[0], fields.customer_id[0], fields.branch_id[0], "Leave", leaveType, data[0].id, false);
        // console.log("throww error: ", addActivity);
        throw addActivity;
      } catch (err) {

        if (err === "1") {
          // console.log(err);
          const dataPassed = { client_id: fields.client_id[0], customer_id: fields.customer_id[0], branch_id: fields.branch_id[0], activity_type: "Leave", activity_details: leaveType, activity_related_id: data[0].id, user_notify: false };
          await addErrorExceptionLog(fields.client_id[0], fields.customer_id[0], "Add leave activity log error", `failed to add leave activity log with data :${dataPassed}`);
        }
        else if (err) { await addErrorExceptionLog(fields.client_id[0], fields.customer_id[0], "Add leave activity log error", { exception: err.toString() }); }
      }
      if (fields.customer_id[0]) {
        const custName = await funGetSingleColumnValueCustomer(fields.customer_id[0], "name");
        const manager_id = await funGetSingleColumnValueCustomer(fields.customer_id[0], "manager_id");
        const admin_id = await await funGetAdminID(fields.client_id[0]);
        try {
          const { data: shouldNotify, error } = await supabase.from("leap_client_notification_selected_types").select("*").eq("selected_notify_type_id", 4);
          if (shouldNotify && shouldNotify.length === 0) {
            if (manager_id) {
              const managerFormData = new FormData();
              managerFormData.append("customer_id", String(manager_id));
              managerFormData.append("title", "Leave Applied");
              managerFormData.append("notify_type", "4");// its 4 for leave in leap_push_notification_types table
              managerFormData.append("message", custName + " has applied for leave from " + formatDateYYYYMMDD(new Date(fields.from_date[0])) + " to " + formatDateYYYYMMDD(new Date(fields.to_date[0])) + ".");
              const managerRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendPushNotification`, {
                method: "POST",
                body: managerFormData
              });
            }
            if (admin_id) {
              const adminFormData = new FormData();
              adminFormData.append("customer_id", String(manager_id));
              adminFormData.append("title", "Leave Applied");
              adminFormData.append("notify_type", "4");// its 4 for leave in leap_push_notification_types table
              adminFormData.append("message", custName + " has applied for leave from " + formatDateYYYYMMDD(new Date(fields.from_date[0])) + " to " + formatDateYYYYMMDD(new Date(fields.to_date[0])) + ".");
              const adminRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendPushNotification`, {
                method: "POST",
                body: adminFormData
              });
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    })();
    // if (addActivity == "1") {
    //   return funSendApiErrorMessage(addActivity, "Customer Leave Activity Insert Issue");
    // }
    // else {
    return funDataAddedSuccessMessage("Leave Applied Successfully");
    // }
  } catch (error) {
    console.log(error);
    return funSendApiException(error);
  }
}

